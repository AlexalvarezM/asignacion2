import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionCliente = ({ show, onHide, cliente, actualizarCliente }) => {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setDatos({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        celular: cliente.celular || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    await actualizarCliente(datos);
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
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
          <Form.Group className="mb-3">
            <Form.Label>Celular *</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={datos.celular}
              onChange={handleChange}
              required
            />
          </Form.Group>
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

export default ModalEdicionCliente;
