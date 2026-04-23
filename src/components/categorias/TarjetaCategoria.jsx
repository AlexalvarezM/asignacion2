import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCategoria = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  paginaActual,
  registrosPorPagina
}) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <div>
      {categorias.map((categoria, index) => {
        const tarjetaActiva = idTarjetaActiva === categoria.id_categoria;
        const idSecuencial = index + 1 + (paginaActual - 1) * registrosPorPagina;

        return (
          <Card
            key={categoria.id_categoria}
            className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
            onClick={() => alternarTarjetaActiva(categoria.id_categoria)}
            tabIndex={0}
            onKeyDown={(evento) => {
              if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                alternarTarjetaActiva(categoria.id_categoria);
              }
            }}
            aria-label={`Categoría ${categoria.nombre_categoria}`}
          >
            <Card.Body
              className={`p-2 tarjeta-categoria-cuerpo ${
                tarjetaActiva
                  ? "tarjeta-categoria-cuerpo-activo"
                  : "tarjeta-categoria-cuerpo-inactivo"
              }`}
            >
              <Row className="align-items-center gx-2">
                <Col xs={2} className="px-2">
                  <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-categoria-placeholder-imagen">
                    <span className="fw-bold text-primary">#{idSecuencial}</span>
                  </div>
                </Col>

                <Col xs={6} className="text-start">
                  <div className="fw-semibold text-truncate">
                    {categoria.nombre_categoria}
                  </div>
                  <div className="small text-muted text-truncate">
                    {categoria.descripcion_categoria}
                  </div>
                </Col>

                <Col xs={4} className="d-flex flex-column align-items-end justify-content-center text-end">
                  <Badge bg="success" className="fw-semibold small">Activa</Badge>
                </Col>
              </Row>
            </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-categoria-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-categoria-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(categoria);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${categoria.nombre_categoria}`}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(categoria);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${categoria.nombre_categoria}`}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
    </div>
  );
};

export default TarjetaCategoria;
