import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col, Card, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { agendamentoService, clienteService, petService, servicoService } from '../services/api';
import { Link } from 'react-router-dom';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [petsData, setPetsData] = useState([]);
  const [servicosData, setServicosData] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    pet: '',
    servico: '',
    data_agendamento: '',
    observacoes: '',
    status: 'agendado'
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // FUNÇÃO formatarHorario - ADICIONE ESTA FUNÇÃO
  

  useEffect(() => {
    loadAgendamentos();
    loadClientes();
    loadServicos();
    loadRelatedData();
  }, []);

  const loadAgendamentos = async () => {
    try {
      const response = await agendamentoService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const agendamentosData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setAgendamentos(agendamentosData);
    } catch (error) {
      showAlert('Erro ao carregar agendamentos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const clientesData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setClientes(clientesData);
    } catch (error) {
      showAlert('Erro ao carregar clientes', 'danger');
    }
  };

  const loadServicos = async () => {
    try {
      const response = await servicoService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const servicosData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setServicos(servicosData);
    } catch (error) {
      showAlert('Erro ao carregar serviços', 'danger');
    }
  };

  const loadRelatedData = async () => {
    try {
      const [petsRes, servicosRes] = await Promise.all([
        petService.getAll(),
        servicoService.getAll()
      ]);
      
      // CORREÇÃO: Verificar se as respostas são paginadas
      const petsData = Array.isArray(petsRes.data) 
        ? petsRes.data 
        : petsRes.data.results || [];
      const servicosData = Array.isArray(servicosRes.data) 
        ? servicosRes.data 
        : servicosRes.data.results || [];
      
      setPetsData(petsData);
      setServicosData(servicosData);
    } catch (error) {
      console.error('Erro ao carregar dados relacionados:', error);
    }
  };

  const loadPetsByCliente = async (clienteId) => {
    try {
      const response = await petService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const petsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      const petsDoCliente = petsData.filter(pet => pet.cliente == clienteId);
      setPets(petsDoCliente);
    } catch (error) {
      showAlert('Erro ao carregar pets', 'danger');
    }
  };

  const loadHorariosDisponiveis = async (date, servicoId) => {
    if (date && servicoId) {
      try {
        const dataStr = date.toISOString().split('T')[0];
        const response = await agendamentoService.getHorariosDisponiveis(dataStr, servicoId);
        
        // Log para debug
        console.log('Resposta da API - Horários:', response.data);
        
        setHorariosDisponiveis(response.data.horarios_disponiveis || []);
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        showAlert('Erro ao carregar horários disponíveis', 'danger');
      }
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const getPetName = (agendamento) => {
    if (agendamento.pet_nome) return agendamento.pet_nome;
    const pet = petsData.find(p => p.id === agendamento.pet);
    return pet ? pet.nome : `Pet ID: ${agendamento.pet}`;
  };

  const getServicoName = (agendamento) => {
    if (agendamento.servico_nome) return agendamento.servico_nome;
    const servico = servicosData.find(s => s.id === agendamento.servico);
    return servico ? servico.nome : `Serviço ID: ${agendamento.servico}`;
  };

  const getStatusBadge = (status) => {
    const variants = {
      agendado: 'warning',
      confirmado: 'success',
      cancelado: 'danger',
      concluido: 'info'
    };
    return variants[status] || 'secondary';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (!formData.pet || !formData.servico || !formData.data_agendamento || !selectedDate) {
      showAlert('Preencha todos os campos obrigatórios', 'danger');
      return;
    }

    // Extrair apenas a parte do horário (HH:MM)
    let horarioPart = formData.data_agendamento;
    if (horarioPart.includes('T')) {
      const dataObj = new Date(horarioPart);
      horarioPart = dataObj.toTimeString().split(' ')[0].substring(0, 5);
    }

    // Ajuste para o fuso horário de São Paulo (UTC-3)
    const localDate = new Date(selectedDate);
    localDate.setHours(Number(horarioPart.split(':')[0]));
    localDate.setMinutes(Number(horarioPart.split(':')[1]));
    localDate.setSeconds(0);



    const dataISO = localDate.toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS

    const agendamentoData = {
      pet: formData.pet,
      servico: formData.servico,
      data_agendamento: dataISO,
      observacoes: formData.observacoes,
      status: 'agendado'
    };

    console.log('Dados do agendamento:', agendamentoData);

    await agendamentoService.create(agendamentoData);
    showAlert('Agendamento criado com sucesso!', 'success');

    setShowModal(false);
    setFormData({ pet: '', servico: '', data_agendamento: '', observacoes: '', status: 'agendado' });
    setSelectedDate(null);
    setHorariosDisponiveis([]);
    setPets([]);

    loadAgendamentos();

  } catch (error) {
    console.error('Erro detalhado:', error.response?.data || error);
    const errorMsg = error.response?.data?.error || error.response?.data?.detail || error.message;
    showAlert(`Erro ao criar agendamento: ${errorMsg}`, 'danger');
  } finally {
    setSubmitting(false);
  }
};

  const handleStatusChange = async (id, novoStatus) => {
    try {
      const agendamento = agendamentos.find(a => a.id === id);
      await agendamentoService.update(id, { ...agendamento, status: novoStatus });
      showAlert('Status atualizado com sucesso!', 'success');
      loadAgendamentos();
    } catch (error) {
      showAlert('Erro ao atualizar status', 'danger');
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await agendamentoService.delete(id);
        showAlert('Agendamento excluído com sucesso!', 'success');
        loadAgendamentos();
      } catch (error) {
        showAlert('Erro ao excluir agendamento', 'danger');
      }
    }
  };

  // Filtrar agendamentos de hoje
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => 
    a.data_agendamento && a.data_agendamento.startsWith(hoje)
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Agendamentos</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Novo Agendamento
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.type} className="mb-3">
          {alert.message}
        </Alert>
      )}

      {/* Card com agendamentos de hoje */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Agendamentos de Hoje ({agendamentosHoje.length})</h5>
        </Card.Header>
        <Card.Body>
          {agendamentosHoje.length === 0 ? (
            <p className="text-muted">Nenhum agendamento para hoje.</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Pet</th>
                    <th>Serviço</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosHoje.map(agendamento => (
                    <tr key={agendamento.id}>
                      <td>
                        {agendamento.data_agendamento ? 
                          new Date(agendamento.data_agendamento).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : '-'}
                      </td>
                      <td>{getPetName(agendamento)}</td>
                      <td>{getServicoName(agendamento)}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(agendamento.status)}`}>
                          {agendamento.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-1"
                          onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                          disabled={agendamento.status === 'confirmado'}
                        >
                          ✓
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-1"
                          onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                          disabled={agendamento.status === 'cancelado'}
                        >
                          ✕
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                          disabled={agendamento.status === 'concluido'}
                        >
                          ✓✓
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Todos os agendamentos */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Todos os Agendamentos</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Pet</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map(agendamento => (
                  <tr key={agendamento.id}>
                    <td>
                      {agendamento.data_agendamento ? 
                        new Date(agendamento.data_agendamento).toLocaleString('pt-BR') : '-'}
                    </td>
                    <td>
  <Link to={`/pets/${agendamento.pet}`} className="text-decoration-none">
    {getPetName(agendamento)}
  </Link>
</td>
<td>
  <Link to={`/servicos/${agendamento.servico}`} className="text-decoration-none">
    {getServicoName(agendamento)}
  </Link>
</td>
                    <td>
                      <span className={`badge bg-${getStatusBadge(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(agendamento.id)}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Novo Agendamento */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setFormData({ pet: '', servico: '', data_agendamento: '', observacoes: '', status: 'agendado' });
        setSelectedDate(null);
        setHorariosDisponiveis([]);
        setPets([]);
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Novo Agendamento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cliente *</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => {
                      const clienteId = e.target.value;
                      if (clienteId) {
                        loadPetsByCliente(clienteId);
                      }
                      setFormData({...formData, pet: ''});
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pet *</Form.Label>
                  <Form.Select
                    required
                    value={formData.pet}
                    onChange={(e) => setFormData({...formData, pet: e.target.value})}
                    disabled={pets.length === 0}
                  >
                    <option value="">Selecione um pet</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nome}
                      </option>
                    ))}
                  </Form.Select>
                  {pets.length === 0 && (
                    <Form.Text className="text-muted">
                      Selecione um cliente primeiro
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Serviço *</Form.Label>
                  <Form.Select
                    required
                    value={formData.servico}
                    onChange={(e) => {
                      setFormData({...formData, servico: e.target.value});
                      if (selectedDate) {
                        loadHorariosDisponiveis(selectedDate, e.target.value);
                      }
                    }}
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.map(servico => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data *</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      if (formData.servico) {
                        loadHorariosDisponiveis(date, formData.servico);
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    minDate={new Date()}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Horário Disponível *</Form.Label>
              <Form.Select
                required
                value={formData.data_agendamento}
                onChange={(e) => setFormData({...formData, data_agendamento: e.target.value})}
                disabled={horariosDisponiveis.length === 0}
              >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map((horario, index) => (
                  <option key={index} value={horario}>
                    {horario}
                  </option>
                ))}
              </Form.Select>
              {horariosDisponiveis.length === 0 && selectedDate && formData.servico && (
                <Form.Text className="text-danger">
                  Não há horários disponíveis para esta data e serviço.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações sobre o agendamento..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowModal(false);
                setFormData({ pet: '', servico: '', data_agendamento: '', observacoes: '', status: 'agendado' });
                setSelectedDate(null);
                setHorariosDisponiveis([]);
                setPets([]);
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={!formData.pet || !formData.servico || !formData.data_agendamento || submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Agendando...
                </>
              ) : (
                'Agendar'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Agendamentos;