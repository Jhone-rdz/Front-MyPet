import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const NavigationBar = () => {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          PetShop Agendamentos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/pets">
              Pets
            </Nav.Link>
            <Nav.Link as={Link} to="/agendamentos">
              Agendamentos
            </Nav.Link>
            <Nav.Link as={Link} to="/servicos">
              Serviços
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={`Olá, ${user?.first_name || user?.username}`} id="user-dropdown">
              <NavDropdown.Item onClick={handleLogout}>
                Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;