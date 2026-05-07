import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCliente = ({ show, onHide, agregarCliente, nuevaCliente, manejoCambioInput }) => {
  const [loading, setLoading] = useState(false);

  const handleAgregar = async () => {
    setLoading(true);
    await agregarCliente();
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nuevaCliente.nombre}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={nuevaCliente.apellido}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Celular *</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={nuevaCliente.celular}
              onChange={manejoCambioInput}
              placeholder="Ej: 8888-8888"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>Cancelar</Button>
        <Button variant="primary" onClick={handleAgregar} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cliente"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;
