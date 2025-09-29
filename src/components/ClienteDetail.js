import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { clienteService, petService } from '../services/api';

const ClienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClienteDetail();
  }, [id]);

  const loadClienteDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar dados do cliente e pets em paralelo
      const [clienteResponse, petsResponse] = await Promise.all([
        clienteService.getById(id),
        petService.getAll()
      ]);
      
      setCliente(clienteResponse.data);
      
      // Filtrar pets deste cliente
      const petsData = Array.isArray(petsResponse.data) 
        ? petsResponse.data 
        : petsResponse.data.results || [];
      
      const petsDoCliente = petsData.filter(pet => pet.cliente == id);
      setPets(petsDoCliente);
      
    } catch (error) {
      console.error('Erro ao carregar detalhes do cliente:', error);
      
      if (error.response?.status === 404) {
        setError('Cliente não encontrado');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        setError('Erro ao carregar detalhes do cliente: ' + 
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

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const handleNovoPet = () => {
    navigate(`/pets/novo?cliente=${id}`);
  };

  const handleEditarCliente = () => {
    navigate(`/clientes/editar/${id}`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando detalhes do cliente...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
          <div className="mt-3">
            <Button variant="outline-secondary" onClick={() => navigate('/clientes')}>
              Voltar para Clientes
            </Button>
            <Button variant="outline-primary" onClick={loadClienteDetail} className="ms-2">
              Tentar Novamente
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!cliente) {
    return (
      <Container>
        <Alert variant="warning">
          Cliente não encontrado
          <div className="mt-2">
            <Button variant="outline-secondary" onClick={() => navigate('/clientes')}>
              Voltar para Lista de Clientes
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
          <Button variant="outline-secondary" onClick={() => navigate('/clientes')} className="me-2">
            ← Voltar
          </Button>
          <h2 className="d-inline-block mb-0">Detalhes do Cliente</h2>
        </div>
        <Button variant="outline-primary" onClick={handleEditarCliente}>
          Editar Cliente
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informações do Cliente</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Nome:</strong></td>
                    <td>{cliente.nome}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{cliente.email || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Telefone:</strong></td>
                    <td>{cliente.telefone || '-'}</td>
                  </tr>
                  <tr>
                    <td><strong>Data de Cadastro:</strong></td>
                    <td>{formatarData(cliente.data_cadastro)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total de Pets:</strong></td>
                    <td>
                      <Badge bg={pets.length > 0 ? 'success' : 'secondary'}>
                        {pets.length}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Estatísticas</h5>
              <Button variant="primary" size="sm" onClick={handleNovoPet}>
                + Novo Pet
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={6}>
                  <div className="border rounded p-3 mb-3">
                    <h6>Total de Pets</h6>
                    <h3 className={pets.length > 0 ? 'text-primary' : 'text-secondary'}>
                      {pets.length}
                    </h3>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3 mb-3">
                    <h6>Cadastrado em</h6>
                    <h6 className="text-muted">{formatarData(cliente.data_cadastro)}</h6>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Pets do Cliente</h5>
        </Card.Header>
        <Card.Body>
          {pets.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Nenhum pet cadastrado para este cliente.</p>
              <Button variant="primary" onClick={handleNovoPet}>
                Cadastrar Primeiro Pet
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Espécie</th>
                    <th>Raça</th>
                    <th>Data Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet.id}>
                      <td>
                        <Link to={`/pets/${pet.id}`} className="text-decoration-none fw-bold">
                          {pet.nome}
                        </Link>
                      </td>
                      <td>{getEspecieBadge(pet.especie)}</td>
                      <td>{pet.raca || '-'}</td>
                      <td>{formatarData(pet.data_cadastro)}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => navigate(`/pets/${pet.id}`)}
                          className="me-2"
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/agendamentos/novo?pet=${pet.id}`)}
                        >
                          Agendar
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

      {/* Card de Ações Rápidas */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Ações Rápidas</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleNovoPet}>
              Adicionar Novo Pet
            </Button>
            <Button variant="outline-primary" onClick={handleEditarCliente}>
              Editar Dados do Cliente
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/clientes')}>
              Voltar para Lista
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClienteDetail;