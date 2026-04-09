import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pagina404 = () => {
  return (
    <Container className="text-center py-5">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="mb-4">¡Vaya! Página no encontrada</h2>
        <p className="lead text-muted mb-5">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg" className="px-5 rounded-pill">
          Volver al Inicio
        </Button>
      </div>
    </Container>
  );
};

export default Pagina404;
