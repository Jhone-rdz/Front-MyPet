import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { agendamentoService, petService, servicoService, clienteService } from '../services/api';

const AgendamentoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState(null);
  const [pet, setPet] = useState(null);
  const [servico, setServico] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAgendamentoDetail();
  }, [id]);

  const loadAgendamentoDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar dados do agendamento
      const agendamentoResponse = await agendamentoService.getById(id);
      const agendamentoData = agendamentoResponse.data;
      setAgendamento(agendamentoData);

      // Buscar dados relacionados em paralelo
      const promises = [];
      
      if (agendamentoData.pet) {
        promises.push(
          petService.getById(agendamentoData.pet)
            .then(response => setPet(response.data))
            .catch(error => console.warn('Erro ao carregar pet:', error))
        );
      }
      
      if (agendamentoData.servico) {
        promises.push(
          servicoService.getById(agendamentoData.servico)
            .then(response => setServico(response.data))
            .catch(error => console.warn('Erro ao carregar serviço:', error))
        );
      }

      await Promise.all(promises);

      // Buscar dados do cliente se tivermos o pet
      if (agendamentoData.pet) {
        try {
          const petResponse = await petService.getById(agendamentoData.pet);
          const petData = petResponse.data;
          if (petData.cliente) {
            const clienteResponse = await clienteService.getById(petData.cliente);
            setCliente(clienteResponse.data);
          }
        } catch (error) {
          console.warn('Erro ao carregar cliente:', error);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar detalhes do agendamento:', error);
      
      if (error.response?.status === 404) {
        setError('Agendamento não encontrado');
      } else {
        setError('Erro ao carregar detalhes do agendamento: ' + 
          (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
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

  const formatarDataHora = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
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

  const handleEditarAgendamento = () => {
    navigate(`/agendamentos/editar/${id}`);
  };

  const handleStatusChange = async (novoStatus) => {
    if (window.confirm(`Deseja realmente alterar o status para "${novoStatus}"?`)) {
      try {
        await agendamentoService.update(id, {
          ...agendamento,
          status: novoStatus
        });
        loadAgendamentoDetail(); // Recarregar dados
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        setError('Erro ao atualizar status do agendamento');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await agendamentoService.delete(id);
        navigate('/agendamentos');
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        setError('Erro ao excluir agendamento');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando detalhes do agendamento...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
          <div className="mt-3">
            <Button variant="outline-secondary" onClick={() => navigate('/agendamentos')}>
              Voltar para Agendamentos
            </Button>
            <Button variant="outline-primary" onClick={loadAgendamentoDetail} className="ms-2">
              Tentar Novamente
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!agendamento) {
    return (
      <Container>
        <Alert variant="warning">
          Agendamento não encontrado
          <div className="mt-2">
            <Button variant="outline-secondary" onClick={() => navigate('/agendamentos')}>
              Voltar para Lista de Agendamentos
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
          <Button variant="outline-secondary" onClick={() => navigate('/agendamentos')} className="me-2">
            ← Voltar para Agendamentos
          </Button>
          <h2 className="d-inline-block mb-0">Detalhes do Agendamento</h2>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            onClick={handleEditarAgendamento}
            className="me-2"
          >
            Editar Agendamento
          </Button>
          <Button 
            variant="outline-danger"
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informações do Agendamento</h5>
              <div>
                {getStatusBadge(agendamento.status)}
              </div>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td width="30%" className="fw-bold">Data e Hora:</td>
                    <td>{formatarDataHora(agendamento.data_agendamento)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Status:</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(agendamento.status)}
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleStatusChange('confirmado')}
                            disabled={agendamento.status === 'confirmado'}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleStatusChange('concluido')}
                            disabled={agendamento.status === 'concluido'}
                          >
                            Concluir
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleStatusChange('cancelado')}
                            disabled={agendamento.status === 'cancelado'}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Pet:</td>
                    <td>
                      {pet ? (
                        <Link to={`/pets/${pet.id}`} className="text-decoration-none">
                          {pet.nome}
                        </Link>
                      ) : (
                        `Pet #${agendamento.pet}`
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Serviço:</td>
                    <td>
                      {servico ? (
                        <Link to={`/servicos/${servico.id}`} className="text-decoration-none">
                          {servico.nome}
                        </Link>
                      ) : (
                        `Serviço #${agendamento.servico}`
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Dono:</td>
                    <td>
                      {cliente ? (
                        <Link to={`/clientes/${cliente.id}`} className="text-decoration-none">
                          {cliente.nome}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                  {servico && (
                    <tr>
                      <td className="fw-bold">Valor do Serviço:</td>
                      <td>
                        <h5 className="text-primary mb-0">
                          {formatarPreco(servico.preco)}
                        </h5>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="fw-bold">Data de Criação:</td>
                    <td>{formatarData(agendamento.data_criacao)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {agendamento.observacoes && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Observações</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">{agendamento.observacoes}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informações do Pet</h5>
            </Card.Header>
            <Card.Body>
              {pet ? (
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Nome:</strong></td>
                      <td>{pet.nome}</td>
                    </tr>
                    <tr>
                      <td><strong>Espécie:</strong></td>
                      <td>
                        <Badge bg={
                          pet.especie === 'C' ? 'primary' : 
                          pet.especie === 'G' ? 'info' : 'secondary'
                        }>
                          {pet.especie === 'C' ? 'Cachorro' : 
                           pet.especie === 'G' ? 'Gato' : 'Outro'}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Raça:</strong></td>
                      <td>{pet.raca || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Informações do pet não disponíveis</p>
              )}
              <div className="d-grid">
                {pet && (
                  <Button 
                    as={Link} 
                    to={`/pets/${pet.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Ver Detalhes do Pet
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informações do Serviço</h5>
            </Card.Header>
            <Card.Body>
              {servico ? (
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Nome:</strong></td>
                      <td>{servico.nome}</td>
                    </tr>
                    <tr>
                      <td><strong>Preço:</strong></td>
                      <td>{formatarPreco(servico.preco)}</td>
                    </tr>
                    <tr>
                      <td><strong>Duração:</strong></td>
                      <td>{servico.duracao} minutos</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>
                        <Badge bg={servico.ativo ? 'success' : 'danger'}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">Informações do serviço não disponíveis</p>
              )}
              <div className="d-grid">
                {servico && (
                  <Button 
                    as={Link} 
                    to={`/servicos/${servico.id}`}
                    variant="outline-info"
                    size="sm"
                  >
                    Ver Detalhes do Serviço
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Ações Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary"
                  onClick={handleEditarAgendamento}
                >
                  Editar Agendamento
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => handleStatusChange('confirmado')}
                  disabled={agendamento.status === 'confirmado'}
                >
                  Confirmar Agendamento
                </Button>
                <Button 
                  variant="outline-info"
                  onClick={() => handleStatusChange('concluido')}
                  disabled={agendamento.status === 'concluido'}
                >
                  Marcar como Concluído
                </Button>
                <Button 
                  variant="outline-danger"
                  onClick={() => handleStatusChange('cancelado')}
                  disabled={agendamento.status === 'cancelado'}
                >
                  Cancelar Agendamento
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => navigate('/agendamentos')}
                >
                  Voltar para Lista
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgendamentoDetail;