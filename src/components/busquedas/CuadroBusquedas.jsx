import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const CuadroBusquedas = ({ value, onChange }) => {
  return (
    <InputGroup className="shadow-sm rounded-4 overflow-hidden border-2 border-light">
      <InputGroup.Text className="bg-light border-0 px-4">
        <i className="bi-search text-primary fs-5"></i>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Buscar productos por nombre o descripción..."
        value={value}
        onChange={onChange}
        className="py-3 border-0 bg-light shadow-none focus-primary"
        style={{ transition: 'var(--transition)' }}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;
