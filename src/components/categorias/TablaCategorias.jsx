import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import ModalEdicionCategoria from "./ModalEdicionCategoria";
import ModalEliminacionCategoria from "./ModalEliminacionCategoria";

const TablaCategorias = ({ categorias, onUpdate, setToast }) => {
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const handleEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setMostrarModalEdicion(true);
  };

  const handleEliminar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setMostrarModalEliminacion(true);
  };

  return (
    <>
      <Table responsive className="align-middle profe-table">
        <thead>
          <tr>
            <th className="px-4">Nombre</th>
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td className="px-4 fw-bold">{categoria.nombre}</td>
                <td className="text-muted small">
                  {categoria.descripcion || "Sin descripción"}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditar(categoria)}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(categoria)}>
                      <i className="bi bi-trash3-fill"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-5 text-muted">
                No hay categorías registradas en el reino.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {categoriaSeleccionada && (
        <>
          <ModalEdicionCategoria
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            categoria={categoriaSeleccionada}
            onUpdate={onUpdate}
            setToast={setToast}
          />
          <ModalEliminacionCategoria
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            categoria={categoriaSeleccionada}
            onUpdate={onUpdate}
            setToast={setToast}
          />
        </>
      )}
    </>
  );
};

export default TablaCategorias;
