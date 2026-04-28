import React from "react";
import { Container, Button } from "react-bootstrap";

const Catalogo = () => {
  return (
    <div className="min-vh-100 bg-secondary-subtle d-flex align-items-center justify-content-center">
      <Container className="text-center py-5">
        <div className="glass p-5 rounded-5 shadow-lg animate-up border-0">
          <i className="bi bi-cone-striped display-1 text-accent mb-4 d-block"></i>
          <h2 className="fw-extrabold text-main mb-3">Sección en Mantenimiento</h2>
          <p className="text-muted fs-5 mb-4">
            Estamos trabajando en mejoras increíbles para nuestro catálogo. 
            <br />Vuelve pronto para ver las novedades.
          </p>
          <Button 
            variant="primary" 
            className="rounded-pill px-5 py-3 fw-bold shadow"
            onClick={() => window.location.href = '/'}
          >
            <i className="bi bi-house-door-fill me-2"></i>
            Volver al Inicio
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Catalogo;
