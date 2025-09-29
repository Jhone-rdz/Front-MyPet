import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { servicoService } from '../services/api';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentServico, setCurrentServico] = useState({
    id: '',
    nome: '',
    descricao: '',
    preco: '',
    duracao_estimada: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      const response = await servicoService.getAll();
      // CORREÇÃO: Verificar se a resposta é paginada
      const servicosData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setServicos(servicosData);
    } catch (error) {
      showAlert('Erro ao carregar serviços', 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const servicoData = {
        ...currentServico,
        preco: parseFloat(currentServico.preco),
        duracao_estimada: parseInt(currentServico.duracao_estimada)
      };

      if (editMode) {
        await servicoService.update(currentServico.id, servicoData);
        showAlert('Serviço atualizado com sucesso!', 'success');
      } else {
        await servicoService.create(servicoData);
        showAlert('Serviço criado com sucesso!', 'success');
      }
      setShowModal(false);
      setCurrentServico({ id: '', nome: '', descricao: '', preco: '', duracao_estimada: '' });
      setEditMode(false);
      loadServicos();
    } catch (error) {
      showAlert('Erro ao salvar serviço', 'danger');
    }
  };

  const handleEdit = (servico) => {
    setCurrentServico({
      ...servico,
      preco: servico.preco.toString(),
      duracao_estimada: servico.duracao_estimada.toString()
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicoService.delete(id);
        showAlert('Serviço excluído com sucesso!', 'success');
        loadServicos();
      } catch (error) {
        showAlert('Erro ao excluir serviço', 'danger');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Serviços</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Novo Serviço
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
            <th>Descrição</th>
            <th>Preço (R$)</th>
            <th>Duração (min)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map(servico => (
            <tr key={servico.id}>
              <td>{servico.nome}</td>
              <td>{servico.descricao || '-'}</td>
              <td>R$ {parseFloat(servico.preco).toFixed(2)}</td>
              <td>{servico.duracao_estimada}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(servico)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(servico.id)}
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
          <Modal.Title>{editMode ? 'Editar' : 'Novo'} Serviço</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Serviço</Form.Label>
              <Form.Control
                type="text"
                required
                value={currentServico.nome}
                onChange={(e) => setCurrentServico({...currentServico, nome: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentServico.descricao}
                onChange={(e) => setCurrentServico({...currentServico, descricao: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={currentServico.preco}
                    onChange={(e) => setCurrentServico({...currentServico, preco: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duração (minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    required
                    value={currentServico.duracao_estimada}
                    onChange={(e) => setCurrentServico({...currentServico, duracao_estimada: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
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

export default Servicos;