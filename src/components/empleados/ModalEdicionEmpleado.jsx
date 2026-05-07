import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionEmpleado = ({ show, onHide, empleado, actualizarEmpleado }) => {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empleado) {
      setDatos({
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        pin_acceso: empleado.pin_acceso || "",
        tipo_empleado: empleado.tipo_empleado || "",
      });
    }
  }, [empleado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    await actualizarEmpleado(datos);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
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
                  value={datos.nombre}
                  onChange={handleChange}
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
                  value={datos.apellido}
                  onChange={handleChange}
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
                  value={datos.pin_acceso}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Empleado *</Form.Label>
                <Form.Select
                  name="tipo_empleado"
                  value={datos.tipo_empleado}
                  onChange={handleChange}
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
        <Button variant="primary" onClick={handleGuardar} disabled={loading}>
          {loading ? "Actualizando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleado;
