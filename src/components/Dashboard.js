import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { clienteService, petService, agendamentoService, servicoService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPets: 0,
    agendamentosHoje: 0,
    totalServicos: 0,
    proximosAgendamentos: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fazer todas as requisições em paralelo
      const [clientesRes, petsRes, servicosRes, agendamentosRes] = await Promise.all([
        clienteService.getAll(),
        petService.getAll(),
        servicoService.getAll(),
        agendamentoService.getAll()
      ]);

      // CORREÇÃO: Verificar se os dados são paginados e extrair o array correto
      const clientesData = Array.isArray(clientesRes.data) ? clientesRes.data : clientesRes.data.results || [];
      const petsData = Array.isArray(petsRes.data) ? petsRes.data : petsRes.data.results || [];
      const servicosData = Array.isArray(servicosRes.data) ? servicosRes.data : servicosRes.data.results || [];
      const agendamentosData = Array.isArray(agendamentosRes.data) ? agendamentosRes.data : agendamentosRes.data.results || [];

      // Calcular agendamentos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const agendamentosHoje = agendamentosData.filter(a => 
        a.data_agendamento && a.data_agendamento.startsWith(hoje)
      );

      // Próximos agendamentos (ordenados por data)
      const agora = new Date();
      const proximosAgendamentos = agendamentosData
        .filter(a => a.data_agendamento && new Date(a.data_agendamento) > agora)
        .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento))
        .slice(0, 5); // Apenas os 5 próximos

      setStats({
        totalClientes: clientesData.length,
        totalPets: petsData.length,
        agendamentosHoje: agendamentosHoje.length,
        totalServicos: servicosData.length,
        proximosAgendamentos
      });

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      agendado: 'warning',
      confirmado: 'success',
      cancelado: 'danger',
      concluido: 'info'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          {error}
          <div className="mt-2">
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={loadDashboardData}
            >
              Tentar Novamente
            </button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="my-4">Dashboard</h2>
      
      {/* Estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Clientes</Card.Title>
              <Card.Text className="display-6 text-primary">
                {stats.totalClientes}
              </Card.Text>
              <small className="text-muted">Total cadastrado</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pets</Card.Title>
              <Card.Text className="display-6 text-success">
                {stats.totalPets}
              </Card.Text>
              <small className="text-muted">Total cadastrado</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Agendamentos Hoje</Card.Title>
              <Card.Text className="display-6 text-warning">
                {stats.agendamentosHoje}
              </Card.Text>
              <small className="text-muted">Para hoje</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Serviços</Card.Title>
              <Card.Text className="display-6 text-info">
                {stats.totalServicos}
              </Card.Text>
              <small className="text-muted">Disponíveis</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Próximos Agendamentos */}
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Próximos Agendamentos</h5>
            </Card.Header>
            <Card.Body>
              {stats.proximosAgendamentos.length === 0 ? (
                <p className="text-muted">Nenhum agendamento futuro.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Pet</th>
                        <th>Serviço</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.proximosAgendamentos.map(agendamento => (
                        <tr key={agendamento.id}>
                          <td>{formatarDataHora(agendamento.data_agendamento)}</td>
                          <td>{agendamento.pet_nome || `Pet ID: ${agendamento.pet}`}</td>
                          <td>{agendamento.servico_nome || `Serviço ID: ${agendamento.servico}`}</td>
                          <td>
                            <span className={`badge bg-${getStatusBadgeVariant(agendamento.status)}`}>
                              {agendamento.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Status do Sistema</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Backend API:</span>
                <span className="badge bg-success">Online</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Banco de Dados:</span>
                <span className="badge bg-success">Conectado</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Frontend:</span>
                <span className="badge bg-success">Operacional</span>
              </div>
              
              <hr />
              
              <div className="text-center">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={loadDashboardData}
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar Dados'}
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
