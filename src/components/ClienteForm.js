import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Container } from 'react-bootstrap';
import { clienteService } from '../services/api';

const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id); // Carrega apenas se tiver ID
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    if (id) {
      loadCliente();
    }
  }, [id]);

  const loadCliente = async () => {
    try {
      const response = await clienteService.getById(id);
      setFormData(response.data);
    } catch (error) {
      setError('Erro ao carregar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      if (id) {
        await clienteService.update(id, formData);
      } else {
        await clienteService.create(formData);
      }
      navigate('/clientes');
    } catch (error) {
      setError('Erro ao salvar cliente: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Editar' : 'Novo'} Cliente</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/clientes')}>
          ← Voltar
        </Button>
      </div>

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome *</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome completo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@email.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefone *</Form.Label>
              <Form.Control
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/clientes')}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClienteForm;