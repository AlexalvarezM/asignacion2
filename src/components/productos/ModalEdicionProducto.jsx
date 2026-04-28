import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionProducto = ({ show, onHide, producto, categorias, onUpdate, setToast }) => {
  const [datos, setDatos] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_producto: "",
    stock: "",
    imagen_url: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto) {
      setDatos({
        nombre_producto: producto.nombre_producto || "",
        descripcion_producto: producto.descripcion_producto || "",
        categoria_producto: producto.categoria_producto || "",
        precio_producto: producto.precio_producto || "",
        stock: producto.stock || "",
        imagen_url: producto.imagen_url || "",
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      if (!datos.nombre_producto || !datos.precio_producto || !datos.categoria_producto || !datos.stock) {
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
          nombre_producto: datos.nombre_producto,
          descripcion_producto: datos.descripcion_producto,
          categoria_producto: parseInt(datos.categoria_producto),
          precio_producto: parseFloat(datos.precio_producto),
          stock: parseInt(datos.stock),
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
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={datos.nombre_producto}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="categoria_producto"
                  value={datos.categoria_producto}
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
              <Form.Group className="mb-3">
                <Form.Label>Precio de venta *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio_producto"
                  value={datos.precio_producto || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock"
                  value={datos.stock || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion_producto"
                  value={datos.descripcion_producto || ""}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
