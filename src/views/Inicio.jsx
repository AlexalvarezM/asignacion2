import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Inicio = () => {
  return (
    <div className="min-vh-100 bg-secondary-subtle d-flex align-items-center">
      <Container className="py-5">
        <Row className="justify-content-center align-items-center">
          <Col lg={7} className="text-center text-lg-start animate-up">
            <BadgeCustom text="Sistema de Gestión" />
            <h1 className="display-2 fw-extrabold text-main mb-3">
              Bienvenido a <span className="text-primary">OmniLex</span>
            </h1>
            <p className="lead fs-4 text-muted mb-0 pe-lg-5">
              Optimiza tu inventario y organiza tus categorías con elegancia y precisión divina. 
              Utiliza el menú superior para navegar por las diferentes secciones.
            </p>
          </Col>
          
          <Col lg={5} className="mt-5 mt-lg-0 animate-up" style={{ animationDelay: '0.2s' }}>
            <div className="position-relative">
              {/* Decoración de fondo */}
              <div className="position-absolute top-50 start-50 translate-middle bg-primary opacity-10 rounded-circle" style={{ width: '400px', height: '400px', filter: 'blur(50px)' }}></div>
              
              <Card className="glass border-0 rounded-5 shadow-2xl p-2 overflow-hidden position-relative">
                <Card.Body className="p-4 text-center">
                  <div className="bg-primary-light text-primary rounded-4 d-inline-flex p-4 mb-4 shadow-sm">
                    <i className="bi bi-house-door-fill display-3"></i>
                  </div>
                  <h3 className="fw-bold text-main mb-3">Calidad Divina</h3>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <Row className="g-3">
                    <Col xs={6}>
                      <div className="bg-white p-3 rounded-4 shadow-sm">
                        <span className="d-block fw-extrabold text-primary h4 mb-0">+100</span>
                        <span className="text-muted small">Productos</span>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="bg-white p-3 rounded-4 shadow-sm">
                        <span className="d-block fw-extrabold text-accent h4 mb-0">24/7</span>
                        <span className="text-muted small">Control</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const BadgeCustom = ({ text }) => (
  <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill mb-4 fw-bold text-uppercase tracking-wider shadow-sm" style={{ fontSize: '0.75rem' }}>
    <i className="bi bi-check2-circle me-2"></i>
    {text}
  </span>
);

export default Inicio;
