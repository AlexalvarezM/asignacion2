import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al sincronizar categorías.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre de la categoría es obligatorio.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        {
          nombre: nuevaCategoria.nombre,
          descripcion: nuevaCategoria.descripcion,
        },
      ]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre}" creada con éxito.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre: "", descripcion: "" });
      setMostrarModal(false);
      fetchCategorias();

    } catch (err) {
      console.error("Error al agregar categoría:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Hubo un error al crear la categoría.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={7} md={8}>
            <h3 className="profe-page-title mb-0">
              <i className="bi bi-bookmark-plus-fill me-2" style={{ fontSize: '1.5rem' }}></i>
              Categorías
            </h3>
          </Col>
          <Col xs={5} md={4} className="text-end">
            <Button onClick={() => setMostrarModal(true)} className="profe-add-btn">
              <i className="bi bi-plus me-1"></i>
              Nueva Categoría
            </Button>
          </Col>
        </Row>
        <hr className="profe-separator" />

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="table-responsive bg-white rounded-3 shadow-sm border p-3">
            <TablaCategorias
              categorias={categorias}
              onUpdate={fetchCategorias}
              setToast={setToast}
            />
          </div>
        )}

        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejoCambioInput={manejoCambioInput}
          agregarCategoria={agregarCategoria}
        />

        <NotificacionOperacion
          mostrar={toast.mostrar}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast({ ...toast, mostrar: false })}
        />
      </Container>
    </div>
  );
};

export default Categorias;
