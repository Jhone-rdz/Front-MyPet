import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from 'react-bootstrap';

const NotImplemented = ({ featureName }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card className="text-center mt-5">
        <Card.Body>
          <h3>🚧 Em Desenvolvimento</h3>
          <p className="text-muted">
            {featureName || 'Esta funcionalidade'} está em desenvolvimento e estará disponível em breve.
          </p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotImplemented;