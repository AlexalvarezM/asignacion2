import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaEmpleados = ({ empleados, abrirModalEdicion, abrirModalEliminacion, paginaActual, registrosPorPagina }) => {
  return (
    <Table striped borderless hover responsive size="sm" className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre Completo</th>
          <th>Tipo</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map((empleado, index) => (
          <tr key={empleado.id_empleado}>
            <td>{index + 1 + (paginaActual - 1) * registrosPorPagina}</td>
            <td>{empleado.nombre} {empleado.apellido}</td>
            <td>{empleado.tipo_empleado}</td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="m-1"
                onClick={() => abrirModalEdicion(empleado)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(empleado)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaEmpleados;
