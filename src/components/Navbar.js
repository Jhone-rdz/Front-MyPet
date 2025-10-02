import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove a autenticação do localStorage
    localStorage.removeItem('isAuthenticated');
    // Redireciona para a tela de login
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🐾 MyPet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              📊 Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/clientes">
              👥 Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/pets">
              🐶 Pets
            </Nav.Link>
            <Nav.Link as={Link} to="/agendamentos">
              📅 Agendamentos
            </Nav.Link>
            <Nav.Link as={Link} to="/servicos">
              🔧 Serviços
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link 
              onClick={handleLogout} 
              className="text-warning"
              style={{ cursor: 'pointer' }}
            >
              🚪 Sair
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
