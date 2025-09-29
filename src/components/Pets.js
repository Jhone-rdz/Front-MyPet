import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { petService, clienteService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPet, setCurrentPet] = useState({
    id: '',
    nome: '',
    especie: 'C',
    raca: '',
    observacoes: '',
    cliente: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

   useEffect(() => {
    loadPets();
    loadClientes();
  }, []);

  const navigate = useNavigate();

  const loadPets = async () => {
    try {
      const response = await petService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const petsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setPets(petsData);
    } catch (error) {
      showAlert('Erro ao carregar pets', 'danger');
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

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await petService.update(currentPet.id, currentPet);
        showAlert('Pet atualizado com sucesso!', 'success');
      } else {
        await petService.create(currentPet);
        showAlert('Pet criado com sucesso!', 'success');
      }
      setShowModal(false);
      setCurrentPet({ id: '', nome: '', especie: 'C', raca: '', observacoes: '', cliente: '' });
      setEditMode(false);
      loadPets();
    } catch (error) {
      showAlert('Erro ao salvar pet', 'danger');
    }
  };

  const handleEdit = (pet) => {
    setCurrentPet({
      ...pet,
      cliente: pet.cliente
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      try {
        await petService.delete(id);
        showAlert('Pet excluído com sucesso!', 'success');
        loadPets();
      } catch (error) {
        showAlert('Erro ao excluir pet', 'danger');
      }
    }
  };

  const getEspecieName = (especie) => {
    const especies = { 'C': 'Cachorro', 'G': 'Gato', 'O': 'Outro' };
    return especies[especie] || 'Desconhecido';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h2>Pets</h2>
  <Button variant="primary" onClick={() => navigate('/pets/novo')}>
    Novo Pet
  </Button>
</div>

      {alert.show && (
        <Alert variant={alert.type} className="mb-3">
          {alert.message}
        </Alert>
      )}

      <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Espécie</th>
      <th>Raça</th>
      <th>Dono</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {pets.map(pet => (
      <tr key={pet.id}>
        <td>
          <Link to={`/pets/${pet.id}`} className="text-decoration-none">
            {pet.nome}
          </Link>
        </td>
        <td>{getEspecieName(pet.especie)}</td>
        <td>{pet.raca || '-'}</td>
        <td>
          <Link to={`/clientes/${pet.cliente}`} className="text-decoration-none">
            {pet.cliente_nome || `Cliente ID: ${pet.cliente}`}
          </Link>
        </td>
        <td>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => handleEdit(pet)}
          >
            Editar
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/pets/${pet.id}`)}
          >
            Detalhes
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(pet.id)}
          >
            Excluir
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar' : 'Novo'} Pet</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Pet</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={currentPet.nome}
                    onChange={(e) => setCurrentPet({...currentPet, nome: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dono</Form.Label>
                  <Form.Select
                    required
                    value={currentPet.cliente}
                    onChange={(e) => setCurrentPet({...currentPet, cliente: e.target.value})}
                  >
                    <option value="">Selecione o dono</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Espécie</Form.Label>
                  <Form.Select
                    value={currentPet.especie}
                    onChange={(e) => setCurrentPet({...currentPet, especie: e.target.value})}
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
                    value={currentPet.raca}
                    onChange={(e) => setCurrentPet({...currentPet, raca: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentPet.observacoes}
                onChange={(e) => setCurrentPet({...currentPet, observacoes: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Pets;