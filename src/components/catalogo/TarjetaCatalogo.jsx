import React from "react";
import { Card, Badge } from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {
  return (
    <Card className="h-100 shadow-lg border-0 animate-up overflow-hidden" style={{ borderRadius: '32px' }}>
      <div className="position-relative overflow-hidden" style={{ height: "240px" }}>
        <div className="bg-primary-light d-flex align-items-center justify-content-center h-100">
          <i className="bi bi-box-seam text-primary opacity-25 display-3"></i>
        </div>
        <div className="position-absolute top-0 start-0 m-3">
          <Badge
            bg="white"
            text="primary"
            className="px-4 py-2 rounded-pill shadow-lg fw-bold fs-6 border-0"
            style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}
          >
            ${producto.precio?.toLocaleString()}
          </Badge>
        </div>
        {producto.stock <= 0 && (
          <div className="position-absolute top-0 end-0 m-3">
            <Badge bg="accent" className="px-3 py-1 rounded-pill shadow-sm fw-bold">
              Agotado
            </Badge>
          </div>
        )}
      </div>
      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-3">
          <Badge bg="primary-light" text="primary" className="text-uppercase fw-extrabold px-3 py-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            {producto.categorias?.nombre || "General"}
          </Badge>
        </div>
        <Card.Title className="fw-extrabold mb-2 h4 text-main">{producto.nombre}</Card.Title>
        <Card.Text className="text-muted fw-medium small flex-grow-1 mb-0">
          Un producto de calidad superior, traído directamente de nuestras reservas rústicas.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCatalogo;
