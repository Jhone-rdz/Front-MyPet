import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { petService, clienteService } from '../services/api';

const PetForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id); // Carrega apenas se tiver ID (edição)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    especie: 'C',
    raca: '',
    observacoes: '',
    cliente: searchParams.get('cliente') || '' // Pega cliente da URL se existir
  });

  useEffect(() => {
    loadClientes();
    if (id) {
      loadPet();
    }
  }, [id]);

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll();
      const clientesData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar lista de clientes');
    }
  };

  const loadPet = async () => {
    try {
      const response = await petService.getById(id);
      setFormData({
        nome: response.data.nome || '',
        especie: response.data.especie || 'C',
        raca: response.data.raca || '',
        observacoes: response.data.observacoes || '',
        cliente: response.data.cliente || ''
      });
    } catch (error) {
      console.error('Erro ao carregar pet:', error);
      setError('Erro ao carregar dados do pet');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('Nome do pet é obrigatório');
      }
      if (!formData.cliente) {
        throw new Error('Selecione um cliente');
      }

      if (id) {
        await petService.update(id, formData);
      } else {
        await petService.create(formData);
      }
      
      navigate('/pets');
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      setError('Erro ao salvar pet: ' + (error.response?.data?.error || error.message || error));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCancel = () => {
    if (formData.cliente) {
      navigate(`/clientes/${formData.cliente}`);
    } else {
      navigate('/pets');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando dados do pet...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? 'Editar' : 'Novo'} Pet</h2>
        <Button variant="outline-secondary" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Dados do Pet</h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Pet *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome do pet"
                    maxLength={50}
                  />
                  <Form.Text className="text-muted">
                    Máximo 50 caracteres
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Espécie *</Form.Label>
                      <Form.Select
                        name="especie"
                        value={formData.especie}
                        onChange={handleChange}
                        required
                      >
                        <option value="C">Cachorro</option>
                        <option value="G">Gato</option>
                        <option value="O">Outro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Raça</Form.Label>
                      <Form.Control
                        type="text"
                        name="raca"
                        value={formData.raca}
                        onChange={handleChange}
                        placeholder="Ex: Labrador, Siames"
                        maxLength={50}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Dono *</Form.Label>
                  <Form.Select
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    required
                    disabled={!!searchParams.get('cliente')} // Desabilita se veio da URL
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.telefone}
                      </option>
                    ))}
                  </Form.Select>
                  {searchParams.get('cliente') && (
                    <Form.Text className="text-info">
                      Cliente selecionado automaticamente
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Informações importantes sobre o pet (alergias, comportamentos, etc.)"
                    maxLength={500}
                  />
                  <Form.Text className="text-muted">
                    {formData.observacoes.length}/500 caracteres
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving || !formData.nome || !formData.cliente}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {id ? 'Atualizando...' : 'Salvando...'}
                      </>
                    ) : (
                      id ? 'Atualizar Pet' : 'Cadastrar Pet'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Card de informações */}
          {!id && (
            <Card className="mt-3">
              <Card.Header>
                <h6 className="mb-0">💡 Informações</h6>
              </Card.Header>
              <Card.Body>
                <p className="text-muted small mb-0">
                  • Após cadastrar o pet, você poderá agendar serviços para ele<br/>
                  • O histórico de serviços ficará disponível na página de detalhes do pet<br/>
                  • Campos marcados com * são obrigatórios
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PetForm;