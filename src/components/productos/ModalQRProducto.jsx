import React from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "react-qr-code";

const ModalQRProducto = ({
  mostrar,
  onHide,
  producto
}) => {
  if (!producto) return null;

  const urlImagen = producto.imagen_url || producto.url_imagen;

  return (
    <Modal show={mostrar} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">
          QR - {producto.nombre_producto}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        {urlImagen ? (
          <>
            <QRCode
              value={urlImagen}
              size={230}
              className="mx-auto shadow-sm"
            />
            <p className="text-muted mt-3 small mb-1">
              Escanea para ver la imagen del producto
            </p>
            <p className="text-primary small">
              {producto.nombre_producto}
            </p>
          </>
        ) : (
          <p className="text-danger">No hay imagen disponible</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQRProducto;
