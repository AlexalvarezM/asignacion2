import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Inicio = () => {
  return (
    <div className="min-vh-100 bg-secondary-subtle py-5">
      <Container className="py-5 text-center">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="bg-primary text-white rounded-circle d-inline-flex p-4 mb-4">
              <i className="bi bi-house-door-fill fs-1"></i>
            </div>
            <h1 className="display-4 fw-bold mb-3 text-dark">
              Bienvenido a Discosa
            </h1>
            <p className="lead mb-5 text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Sistema de gestión de inventario y categorías. Utiliza el menú superior para navegar por las diferentes secciones.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inicio;
