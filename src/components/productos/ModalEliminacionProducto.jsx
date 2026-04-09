import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionProducto = ({ show, onHide, producto, onUpdate, setToast }) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", producto.id_producto);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Producto retirado del inventario con éxito.",
        tipo: "exito",
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar el producto.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="profe-modal">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-extrabold text-accent">Retirar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="fs-5 fw-medium text-main">
          ¿Estás seguro de que deseas eliminar <strong>{producto?.nombre}</strong> del inventario?
        </p>
        <p className="text-accent small fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4">
        <Button variant="outline-primary" onClick={onHide} className="px-4">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEliminar} disabled={loading} className="px-4 bg-accent">
          {loading ? "Procesando..." : "Confirmar Retiro"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;
