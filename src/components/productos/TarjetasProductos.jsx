import React, { useState } from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import ModalEdicionProducto from "./ModalEdicionProducto";
import ModalEliminacionProducto from "./ModalEliminacionProducto";

const TarjetasProductos = ({ productos, categorias, onUpdate, setToast }) => {
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalEdicion(true);
  };

  const handleEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalEliminacion(true);
  };

  return (
    <>
      <Row xs={1} md={2} lg={3} className="g-4 animate-up">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <Col key={producto.id_producto}>
              <Card className="h-100 product-card shadow-sm border-0 overflow-hidden">
                <div className="position-relative" style={{ height: "220px" }}>
                  {producto.imagen_url ? (
                    <Card.Img
                      variant="top"
                      src={producto.imagen_url}
                      className="h-100 w-100 object-fit-cover transition-zoom"
                      alt={producto.nombre_producto}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center h-100">
                      <i className="bi bi-image text-muted display-4"></i>
                    </div>
                  )}
                  <div className="position-absolute bottom-0 start-0 m-3">
                    <Badge bg="primary" className="px-3 py-2 rounded-pill shadow text-dark fw-bold">
                      ${parseFloat(producto.precio_producto || 0).toLocaleString()}
                    </Badge>
                  </div>
                  {producto.stock <= 5 && (
                    <div className="position-absolute top-0 end-0 m-3">
                      <Badge bg="danger" className="px-2 py-1 shadow">
                        ¡Stock Bajo: {producto.stock}!
                      </Badge>
                    </div>
                  )}
                </div>
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-extrabold mb-0 text-primary fs-4">
                      {producto.nombre_producto}
                    </Card.Title>
                    <Badge
                      bg="primary-light"
                      text="primary"
                      className="text-uppercase px-2 py-1"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {producto.categorias?.nombre || "Sin Categoría"}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted small mb-2 flex-grow-1">
                    {producto.descripcion_producto ||
                      "Este producto es parte esencial de nuestro inventario de alta calidad."}
                  </Card.Text>
                  <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                    <span className="text-muted small">
                      <i className="bi bi-box me-1"></i> Stock: {producto.stock}
                    </span>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        className="flex-grow-1 py-2 fw-bold"
                        onClick={() => handleEditar(producto)}
                      >
                        <i className="bi bi-pencil-square me-2"></i> Editar
                      </Button>
                      <Button 
                        variant="outline-accent" 
                        className="flex-grow-1 py-2 fw-bold"
                        style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
                        onClick={() => handleEliminar(producto)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center py-5 glass rounded-5 border-0 shadow-sm">
              <i className="bi bi-inbox display-1 text-primary opacity-25"></i>
              <p className="mt-4 fs-4 fw-bold text-main">El inventario está vacío...</p>
              <p className="text-muted mb-4">Empieza a llenar el almacén con productos divinos.</p>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="primary" className="rounded-pill px-5 py-3">
                Registrar primer producto
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {productoSeleccionado && (
        <>
          <ModalEdicionProducto
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            producto={productoSeleccionado}
            categorias={categorias}
            onUpdate={onUpdate}
            setToast={setToast}
          />
          <ModalEliminacionProducto
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            producto={productoSeleccionado}
            onUpdate={onUpdate}
            setToast={setToast}
          />
        </>
      )}
    </>
  );
};

export default TarjetasProductos;
