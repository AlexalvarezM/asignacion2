import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { supabase } from '../../database/supabaseconfig';

const FormularioLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Credenciales inválidas. Por favor intente de nuevo.");
      console.error(error.message);
    }

    setLoading(false);
  };

  return (
    <Card className="shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }}>
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3">
            <i className="bi-shield-lock-fill fs-2"></i>
          </div>
          <h2 className="h4 fw-bold mb-1">Inicio de Sesión</h2>
          <p className="text-muted small">Ingresa tus credenciales para continuar</p>
        </div>

        {error && <Alert variant="danger" className="py-2 small text-center mb-4">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium text-secondary">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
              className="py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-medium text-secondary">Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="py-2"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2 fw-bold" 
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Entrar'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormularioLogin;
