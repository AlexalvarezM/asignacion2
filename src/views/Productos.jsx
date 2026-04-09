import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Productos = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: prodData, error: prodError } = await supabase
        .from("productos")
        .select("*, categorias(nombre)")
        .order("nombre", { ascending: true });

      if (prodError) throw prodError;
      setProductos(prodData || []);

      const { data: catData, error: catError } = await supabase
        .from("categorias")
        .select("id_categoria, nombre")
        .order("nombre", { ascending: true });

      if (catError) throw catError;
      setCategorias(catData || []);

    } catch (err) {
      console.error("Error al cargar datos:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error al sincronizar el inventario.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={7} md={8}>
            <h3 className="profe-page-title mb-0">
              <i className="bi bi-box-seam-fill me-2" style={{ fontSize: '1.5rem' }}></i>
              Productos
            </h3>
          </Col>
          <Col xs={5} md={4} className="text-end">
            <Button onClick={() => setMostrarModal(true)} className="profe-add-btn">
              <i className="bi bi-plus me-1"></i>
              Nuevo Producto
            </Button>
          </Col>
        </Row>
        <hr className="profe-separator" />

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <TarjetasProductos 
            productos={productos} 
            categorias={categorias}
            onUpdate={fetchData} 
            setToast={setToast} 
          />
        )}

        <ModalRegistroProducto
          show={mostrarModal}
          onHide={() => setMostrarModal(false)}
          categorias={categorias}
          onUpdate={fetchData}
          setToast={setToast}
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

export default Productos;
