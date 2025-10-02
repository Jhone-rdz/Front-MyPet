import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Row, Col, Badge, Table } from 'react-bootstrap';
import { servicoService } from '../services/api';

const ServicoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServico();
  }, [id]);

  const loadServico = async () => {
    try {
      setLoading(true);
      const response = await servicoService.getById(id);
      setServico(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviço:', error);
      setError('Erro ao carregar detalhes do serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicoService.delete(id);
        navigate('/servicos');
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        setError('Erro ao excluir serviço');
      }
    }
  };

  const getStatusVariant = (ativo) => {
    return ativo ? 'success' : 'danger';
  };

  const getStatusText = (ativo) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando serviço...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <Button as={Link} to="/servicos" variant="primary">
              Voltar para Serviços
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          Serviço não encontrado.
          <div className="mt-2">
            <Button as={Link} to="/servicos" variant="primary">
              Voltar para Serviços
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/servicos" className="text-decoration-none">Serviços</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {servico.nome}
              </li>
            </ol>
          </nav>
          <h2>Detalhes do Serviço</h2>
        </div>
        <div>
          <Button 
            as={Link} 
            to={`/servicos/editar/${servico.id}`} 
            variant="primary" 
            className="me-2"
          >
            Editar Serviço
          </Button>
          <Button 
            as={Link} 
            to="/servicos" 
            variant="outline-secondary"
          >
            Voltar
          </Button>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Informações do Serviço</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td width="30%" className="fw-bold">Nome:</td>
                    <td>{servico.nome}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Descrição:</td>
                    <td>{servico.descricao || 'Nenhuma descrição fornecida'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Preço:</td>
                    <td>
                      <h5 className="text-primary mb-0">
                        R$ {parseFloat(servico.preco).toFixed(2)}
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Duração:</td>
                    <td>
                      <Badge bg="info" className="fs-6">
                        {servico.duracao} minutos
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Status:</td>
                    <td>
                      <Badge bg={getStatusVariant(servico.ativo)} className="fs-6">
                        {getStatusText(servico.ativo)}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Categoria:</td>
                    <td>
                      {servico.categoria ? (
                        <Badge bg="secondary" className="fs-6">
                          {servico.categoria}
                        </Badge>
                      ) : (
                        'Não categorizado'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Data de Criação:</td>
                    <td>
                      {servico.data_criacao ? 
                        new Date(servico.data_criacao).toLocaleDateString('pt-BR') : 
                        'N/A'
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ações</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to={`/servicos/editar/${servico.id}`}
                  variant="primary"
                  size="lg"
                >
                  ✏️ Editar Serviço
                </Button>
                <Button 
                  as={Link} 
                  to="/agendamentos/novo"
                  variant="success"
                  size="lg"
                >
                  📅 Agendar este Serviço
                </Button>
                <Button 
                  variant="outline-danger"
                  size="lg"
                  onClick={handleDelete}
                >
                  🗑️ Excluir Serviço
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">Informações Adicionais</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                {servico.ativo ? 
                  'Este serviço está ativo e disponível para agendamento.' :
                  'Este serviço está inativo e não está disponível para novos agendamentos.'
                }
              </p>
              {servico.observacoes && (
                <div>
                  <h6>Observações:</h6>
                  <p className="text-muted">{servico.observacoes}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServicoDetail;