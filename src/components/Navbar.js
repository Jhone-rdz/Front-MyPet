import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  // REMOVA completamente qualquer referência ao authService
  
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
            <Nav.Link as={Link} to="/" className="text-success">
              ✅ Sistema Aberto
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
