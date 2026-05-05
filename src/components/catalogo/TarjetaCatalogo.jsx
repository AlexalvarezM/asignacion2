import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categorianombre }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const descripcion = producto.descripcion_producto || "";
  const previewCuerpoTexto = descripcion.length > 50 ? descripcion.substring(0, 50) + "..." : descripcion;
  const tieneMasTexto = descripcion.length > 50;

  return (
    <>
      <Card
        className="h-100 border-0 shadow-lg overflow-hidden position-relative cursor-pointer animate-up"
        style={{ borderRadius: '24px', transition: "transform 0.3s, box-shadow 0.3s" }}
        role="button"
        tabIndex={0}
        onClick={() => setMostrarModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setMostrarModal(true)}
        aria-label={`Ver detalles de ${producto.nombre_producto}`}
      >
        <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
          {producto.imagen_url ? (
            <Card.Img
              variant="top"
              src={producto.imagen_url}
              alt={producto.nombre_producto}
              className="w-100 h-100 object-fit-cover transition-transform"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x220?text=Imagen+No+Disponible";
              }}
            />
          ) : (
            <div className="bg-primary-light d-flex align-items-center justify-content-center h-100">
              <i className="bi bi-box-seam text-primary opacity-25 display-3"></i>
            </div>
          )}
          
          <div className="position-absolute top-0 start-0 m-3">
            <Badge
              bg="white"
              text="primary"
              className="px-3 py-2 rounded-pill shadow fw-bold border-0"
              style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}
            >
              ${parseFloat(producto.precio_producto || 0).toLocaleString()}
            </Badge>
          </div>

          {producto.stock <= 0 && (
            <div className="position-absolute top-0 end-0 m-3">
              <Badge bg="danger" className="px-3 py-1 shadow">Agotado</Badge>
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column p-4">
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <Badge bg="primary" className="text-uppercase fw-bold px-2 py-1" style={{ fontSize: '0.65rem' }}>
              {categorianombre || "General"}
            </Badge>
            <span className="text-muted small fw-bold">Stock: {producto.stock}</span>
          </div>
          
          <Card.Title className="fw-extrabold mb-2 h5 text-main">{producto.nombre_producto}</Card.Title>
          
          <Card.Text className="text-muted small mb-0">
            {previewCuerpoTexto}
            {tieneMasTexto && <span className="text-primary ms-1 fw-bold">Ver más</span>}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        centered
        size="lg"
        className="profe-modal"
      >
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-extrabold text-main">Detalles del Producto</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="px-4 pb-4">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: "300px" }}>
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre_producto}
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center h-100">
                    <i className="bi bi-image text-muted display-1"></i>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <Badge bg="primary" className="mb-2 text-uppercase">{categorianombre || "General"}</Badge>
              <h2 className="fw-extrabold text-primary mb-3">{producto.nombre_producto}</h2>
              
              <div className="mb-4">
                <h5 className="fw-bold text-main mb-2">Descripción</h5>
                <p className="text-muted fs-6" style={{ textAlign: 'justify' }}>
                  {producto.descripcion_producto || "No hay descripción disponible para este producto."}
                </p>
              </div>
              
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-4">
                <div>
                  <span className="d-block text-muted small fw-bold text-uppercase">Precio</span>
                  <span className="fs-3 fw-extrabold text-primary">${parseFloat(producto.precio_producto || 0).toLocaleString()}</span>
                </div>
                <div className="text-end">
                  <span className="d-block text-muted small fw-bold text-uppercase">Stock Disponible</span>
                  <span className={`fs-4 fw-bold ${producto.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {producto.stock} unidades
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="primary" className="rounded-pill px-4 py-2 fw-bold" onClick={() => setMostrarModal(false)}>
            Cerrar Ventana
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;
