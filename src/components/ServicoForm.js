import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { servicoService } from '../services/api';

const ServicoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: '',
    categoria: '',
    observacoes: '',
    ativo: true
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadServico();
    }
  }, [id]);

  const loadServico = async () => {
    try {
      setLoading(true);
      const response = await servicoService.getById(id);
      const servico = response.data;
      
      setFormData({
        nome: servico.nome || '',
        descricao: servico.descricao || '',
        preco: servico.preco || '',
        duracao: servico.duracao || '',
        categoria: servico.categoria || '',
        observacoes: servico.observacoes || '',
        ativo: servico.ativo !== undefined ? servico.ativo : true
      });
    } catch (error) {
      console.error('Erro ao carregar serviço:', error);
      setError('Erro ao carregar dados do serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const servicoData = {
        ...formData,
        preco: parseFloat(formData.preco),
        duracao: parseInt(formData.duracao)
      };

      if (isEdit) {
        await servicoService.update(id, servicoData);
      } else {
        await servicoService.create(servicoData);
      }

      navigate('/servicos');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      setError(error.response?.data?.message || `Erro ao ${isEdit ? 'atualizar' : 'criar'} serviço`);
    } finally {
      setSubmitting(false);
    }
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
                {isEdit ? 'Editar Serviço' : 'Novo Serviço'}
              </li>
            </ol>
          </nav>
          <h2>{isEdit ? 'Editar Serviço' : 'Novo Serviço'}</h2>
        </div>
        <Button as={Link} to="/servicos" variant="outline-secondary">
          Voltar
        </Button>
      </div>

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Serviço *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Banho e Tosa, Consulta Veterinária..."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    placeholder="Ex: Estética, Saúde..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva o serviço em detalhes..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço (R$) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duração (minutos) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleChange}
                    required
                    placeholder="30"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observações adicionais sobre o serviço..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="ativo"
                label="Serviço ativo"
                checked={formData.ativo}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Serviços inativos não aparecem para novos agendamentos
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {isEdit ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  isEdit ? 'Atualizar Serviço' : 'Criar Serviço'
                )}
              </Button>
              
              <Button 
                as={Link} 
                to="/servicos" 
                variant="outline-secondary"
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ServicoForm;