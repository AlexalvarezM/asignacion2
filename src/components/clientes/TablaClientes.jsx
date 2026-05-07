import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaClientes = ({ clientes, abrirModalEdicion, abrirModalEliminacion, paginaActual, registrosPorPagina }) => {
  return (
    <Table striped borderless hover responsive size="sm" className="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Celular</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente, index) => (
          <tr key={cliente.id_cliente}>
            <td>{index + 1 + (paginaActual - 1) * registrosPorPagina}</td>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.celular}</td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="m-1"
                onClick={() => abrirModalEdicion(cliente)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(cliente)}
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

export default TablaClientes;
