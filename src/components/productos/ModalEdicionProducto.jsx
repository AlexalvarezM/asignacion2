import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionProducto = ({ show, onHide, producto, categorias, onUpdate, setToast }) => {
  const [datos, setDatos] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto) {
      setDatos({
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        categoria_id: producto.categoria_id,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      if (!datos.nombre || !datos.precio || !datos.categoria_id || datos.stock === "") {
        setToast({
          mostrar: true,
          mensaje: "Por favor complete todos los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      setLoading(true);
      const { error } = await supabase
        .from("productos")
        .update({
          nombre: datos.nombre,
          precio: parseFloat(datos.precio),
          stock: parseInt(datos.stock),
          categoria_id: parseInt(datos.categoria_id),
        })
        .eq("id_producto", producto.id_producto);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Producto actualizado con éxito.",
        tipo: "exito",
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar el producto.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg" className="profe-modal">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-extrabold text-primary">Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-muted small text-uppercase">Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-muted small text-uppercase">Categoría *</Form.Label>
                <Form.Select
                  name="categoria_id"
                  value={datos.categoria_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-muted small text-uppercase">Precio *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="precio"
                  value={datos.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-muted small text-uppercase">Stock *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={datos.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4">
        <Button variant="outline-primary" onClick={onHide} className="px-4">
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleGuardar}
          disabled={loading || !datos.nombre || !datos.precio || !datos.categoria_id}
          className="px-4"
        >
          {loading ? "Sincronizando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
