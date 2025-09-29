import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { clienteService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);

   const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const clientesData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showAlert('Erro ao carregar clientes', 'danger');
    } finally {
      setLoading(false);
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
        await clienteService.update(currentCliente.id, currentCliente);
        showAlert('Cliente atualizado com sucesso!', 'success');
      } else {
        await clienteService.create(currentCliente);
        showAlert('Cliente criado com sucesso!', 'success');
      }
      setShowModal(false);
      setCurrentCliente({ id: '', nome: '', email: '', telefone: '' });
      setEditMode(false);
      loadClientes();
    } catch (error) {
      showAlert('Erro ao salvar cliente', 'danger');
    }
  };

  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clienteService.delete(id);
        showAlert('Cliente excluído com sucesso!', 'success');
        loadClientes();
      } catch (error) {
        showAlert('Erro ao excluir cliente', 'danger');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h2>Clientes</h2>
  <Button variant="primary" onClick={() => navigate('/clientes/novo')}>
    Novo Cliente
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
      <th>Email</th>
      <th>Telefone</th>
      <th>Total de Pets</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {clientes.map(cliente => (
      <tr key={cliente.id}>
        <td>
          <Link to={`/clientes/${cliente.id}`} className="text-decoration-none">
            {cliente.nome}
          </Link>
        </td>
        <td>{cliente.email}</td>
        <td>{cliente.telefone}</td>
        <td>
          <span className="badge bg-secondary">{cliente.total_pets || 0}</span>
        </td>
        <td>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => handleEdit(cliente)}
          >
            Editar
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/clientes/${cliente.id}`)}
          >
            Detalhes
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(cliente.id)}
          >
            Excluir
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar' : 'Novo'} Cliente</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                required
                value={currentCliente.nome}
                onChange={(e) => setCurrentCliente({...currentCliente, nome: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={currentCliente.email}
                onChange={(e) => setCurrentCliente({...currentCliente, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                required
                value={currentCliente.telefone}
                onChange={(e) => setCurrentCliente({...currentCliente, telefone: e.target.value})}
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

export default Clientes;