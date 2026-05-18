import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionEmpleado = ({ show, onHide, empleado, onUpdate, setToast }) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    if (!empleado?.id_empleado) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id_empleado", empleado.id_empleado);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleado.nombre_empleado} eliminado con éxito.`,
        tipo: "exito",
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error al eliminar empleado:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar el empleado. Inténtelo de nuevo.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Eliminar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar al empleado{" "}
          <strong>
            {empleado?.nombre_empleado} {empleado?.apellido_empleado}
          </strong>
          ?
        </p>
        <p className="text-muted small">
          <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar} disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar Empleado"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEmpleado;
