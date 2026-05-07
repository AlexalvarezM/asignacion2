import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroEmpleado = ({ show, onHide, agregarEmpleado, nuevaEmpleado, manejoCambioInput }) => {
  const [loading, setLoading] = useState(false);

  const handleAgregar = async () => {
    setLoading(true);
    await agregarEmpleado();
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Empleado</Modal.Title>
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
                  value={nuevaEmpleado.nombre}
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
                  value={nuevaEmpleado.apellido}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PIN de Acceso *</Form.Label>
                <Form.Control
                  type="password"
                  name="pin_acceso"
                  value={nuevaEmpleado.pin_acceso}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Empleado *</Form.Label>
                <Form.Select
                  name="tipo_empleado"
                  value={nuevaEmpleado.tipo_empleado}
                  onChange={manejoCambioInput}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Almacén">Almacén</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>Cancelar</Button>
        <Button variant="primary" onClick={handleAgregar} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Empleado"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;
