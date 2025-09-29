import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { authService } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    // Se já estiver autenticado, redireciona para dashboard
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginData);
      const { access, user } = response.data;
      
      authService.setToken(access);
      authService.setUser(user);
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(registerData);
      const { access, user } = response.data;
      
      authService.setToken(access);
      authService.setUser(user);
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-primary">PetShop</h2>
                  <p className="text-muted">Sistema de Agendamentos</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                  fill
                >
                  <Tab eventKey="login" title="Login">
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          placeholder="Digite seu usuário"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Digite sua senha"
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Entrando...
                          </>
                        ) : (
                          'Entrar'
                        )}
                      </Button>
                    </Form>
                  </Tab>

                  <Tab eventKey="register" title="Cadastrar">
                    <Form onSubmit={handleRegister}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                              type="text"
                              name="first_name"
                              value={registerData.first_name}
                              onChange={handleRegisterChange}
                              placeholder="Seu nome"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Sobrenome</Form.Label>
                            <Form.Control
                              type="text"
                              name="last_name"
                              value={registerData.last_name}
                              onChange={handleRegisterChange}
                              placeholder="Seu sobrenome"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          placeholder="Escolha um usuário"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar Senha</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Digite a senha novamente"
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="success"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Cadastrando...
                          </>
                        ) : (
                          'Criar Conta'
                        )}
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    {activeTab === 'login' 
                      ? 'Não tem uma conta? ' 
                      : 'Já tem uma conta? '}
                    <Link 
                      to="#" 
                      onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                      className="text-decoration-none"
                    >
                      {activeTab === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Login;