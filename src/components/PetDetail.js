import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Table, Button, Badge, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { petService, agendamentoService, clienteService } from '../services/api';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadPetDetail();
  }, [id]);

  const loadPetDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar dados do pet, agendamentos e cliente em paralelo
      const [petResponse, agendamentosResponse] = await Promise.all([
        petService.getById(id),
        agendamentoService.getAll()
      ]);
      
      setPet(petResponse.data);
      
      // Filtrar agendamentos deste pet
      const agendamentosData = Array.isArray(agendamentosResponse.data) 
        ? agendamentosResponse.data 
        : agendamentosResponse.data.results || [];
      
      const agendamentosDoPet = agendamentosData.filter(ag => ag.pet == id);
      setAgendamentos(agendamentosDoPet);
      
      // Buscar dados do cliente se disponível
      if (petResponse.data.cliente) {
        try {
          const clienteResponse = await clienteService.getById(petResponse.data.cliente);
          setCliente(clienteResponse.data);
        } catch (clienteError) {
          console.warn('Erro ao carregar dados do cliente:', clienteError);
        }
      }
      
    } catch (error) {
      console.error('Erro ao carregar detalhes do pet:', error);
      
      if (error.response?.status === 404) {
        setError('Pet não encontrado');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        setError('Erro ao carregar detalhes do pet: ' + 
          (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const getEspecieBadge = (especie) => {
    const especies = {
      'C': { variant: 'primary', text: 'Cachorro' },
      'G': { variant: 'info', text: 'Gato' },
      'O': { variant: 'secondary', text: 'Outro' }
    };
    const especieInfo = especies[especie] || { variant: 'dark', text: 'Desconhecido' };
    return <Badge bg={especieInfo.variant}>{especieInfo.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'agendado': { variant: 'warning', text: 'Agendado' },
      'confirmado': { variant: 'success', text: 'Confirmado' },
      'cancelado': { variant: 'danger', text: 'Cancelado' },
      'concluido': { variant: 'info', text: 'Concluído' }
    };
    const statusInfo = statuses[status] || { variant: 'dark', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const formatarPreco = (preco) => {
    if (!preco) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const handleNovoAgendamento = () => {
    navigate(`/agendamentos/novo?pet=${id}`);
  };

  const handleEditarPet = () => {
    navigate(`/pets/editar/${id}`);
  };

  const handleVerCliente = () => {
    if (pet?.cliente) {
      navigate(`/clientes/${pet.cliente}`);
    }
  };

  // Estatísticas
  const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido').length;
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado').length;
  const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado').length;

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando detalhes do pet...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
          <div className="mt-3">
            <Button variant="outline-secondary" onClick={() => navigate('/pets')}>
              Voltar para Pets
            </Button>
            <Button variant="outline-primary" onClick={loadPetDetail} className="ms-2">
              Tentar Novamente
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container>
        <Alert variant="warning">
          Pet não encontrado
          <div className="mt-2">
            <Button variant="outline-secondary" onClick={() => navigate('/pets')}>
              Voltar para Lista de Pets
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="outline-secondary" onClick={() => navigate('/pets')} className="me-2">
            ← Voltar
          </Button>
          <h2 className="d-inline-block mb-0">Detalhes do Pet</h2>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            onClick={handleEditarPet}
            className="me-2"
          >
            Editar Pet
          </Button>
          <Button 
            variant="primary"
            onClick={handleNovoAgendamento}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informações Básicas</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Nome:</strong></td>
                    <td>{pet.nome}</td>
                  </tr>
                  <tr>
                    <td><strong>Espécie:</strong></td>
                    <td>{getEspecieBadge(pet.especie)}</td>
                  </tr>
                  <tr>
                    <td><strong>Raça:</strong></td>
                    <td>{pet.raca || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Dono:</strong></td>
                    <td>
                      {cliente ? (
                        <Link to={`/clientes/${pet.cliente}`} className="text-decoration-none">
                          {cliente.nome}
                        </Link>
                      ) : pet.cliente ? (
                        <Button variant="link" size="sm" onClick={handleVerCliente}>
                          Ver Dono
                        </Button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Data Cadastro:</strong></td>
                    <td>{formatarData(pet.data_cadastro)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {pet.observacoes && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Observações</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">{pet.observacoes}</p>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header>
              <h5 className="mb-0">Estatísticas</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="border rounded p-3 mb-3">
                  <h6>Total de Serviços</h6>
                  <h3 className="text-primary">{agendamentos.length}</h3>
                </div>
                
                <Row>
                  <Col md={6}>
                    <div className="border rounded p-2 mb-2">
                      <small>Concluídos</small>
                      <h6 className="text-success mb-0">{agendamentosConcluidos}</h6>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="border rounded p-2 mb-2">
                      <small>Confirmados</small>
                      <h6 className="text-warning mb-0">{agendamentosConfirmados}</h6>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Tab eventKey="info" title="Histórico de Serviços" />
                <Tab eventKey="stats" title="Estatísticas Completas" />
              </Tabs>
            </Card.Header>
            <Card.Body>
              {activeTab === 'info' && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Histórico de Agendamentos</h6>
                    <small className="text-muted">
                      {agendamentos.length} registro(s) encontrado(s)
                    </small>
                  </div>
                  
                  {agendamentos.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">Nenhum agendamento encontrado.</p>
                      <Button variant="primary" onClick={handleNovoAgendamento}>
                        Fazer Primeiro Agendamento
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped hover size="sm">
                        <thead>
                          <tr>
                            <th>Data/Hora</th>
                            <th>Serviço</th>
                            <th>Status</th>
                            <th>Valor</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agendamentos.map(agendamento => (
                            <tr key={agendamento.id}>
                              <td>{formatarDataHora(agendamento.data_agendamento)}</td>
                              <td>{agendamento.servico_nome || `Serviço #${agendamento.servico}`}</td>
                              <td>{getStatusBadge(agendamento.status)}</td>
                              <td>{agendamento.servico_preco ? formatarPreco(agendamento.servico_preco) : '-'}</td>
                              <td>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => navigate(`/agendamentos/${agendamento.id}`)}
                                >
                                  Detalhes
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'stats' && (
                <Row>
                  <Col md={6}>
                    <Card className="text-center mb-3">
                      <Card.Body>
                        <h6>Total de Serviços</h6>
                        <h3 className="text-primary">{agendamentos.length}</h3>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-center mb-3">
                      <Card.Body>
                        <h6>Serviços Concluídos</h6>
                        <h3 className="text-success">{agendamentosConcluidos}</h3>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-center mb-3">
                      <Card.Body>
                        <h6>Agendados/Confirmados</h6>
                        <h3 className="text-warning">{agendamentosConfirmados}</h3>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-center mb-3">
                      <Card.Body>
                        <h6>Cancelados</h6>
                        <h3 className="text-danger">{agendamentosCancelados}</h3>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Card de Ações Rápidas */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Ações Rápidas</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleNovoAgendamento}>
              Novo Agendamento
            </Button>
            <Button variant="outline-primary" onClick={handleEditarPet}>
              Editar Dados do Pet
            </Button>
            {cliente && (
              <Button variant="outline-info" onClick={handleVerCliente}>
                Ver Dono do Pet
              </Button>
            )}
            <Button variant="outline-secondary" onClick={() => navigate('/pets')}>
              Voltar para Lista
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PetDetail;