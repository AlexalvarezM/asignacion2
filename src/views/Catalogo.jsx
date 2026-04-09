import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Badge, Spinner, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  const filtrarProductos = useCallback(() => {
    let filtrados = productos;

    if (busqueda) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (categoriaSeleccionada !== "Todas") {
      filtrados = filtrados.filter((p) => p.categoria_id === parseInt(categoriaSeleccionada));
    }

    setProductosFiltrados(filtrados);
  }, [productos, busqueda, categoriaSeleccionada]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [filtrarProductos]);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="profe-page-title mb-0">
              <i className="bi bi-grid-fill me-2" style={{ fontSize: '1.5rem' }}></i>
              Catálogo de Productos
            </h3>
          </Col>
        </Row>
        <hr className="profe-separator" />

        <div className="bg-white p-4 rounded-3 shadow-sm mb-4 border">
          <Row className="g-3 align-items-center">
            <Col md={8}>
              <CuadroBusquedas value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </Col>
            <Col md={4}>
              <Form.Select 
                value={categoriaSeleccionada} 
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="py-2"
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((p) => (
                <Col key={p.id_producto} sm={6} lg={4} xl={3}>
                  <TarjetaCatalogo producto={p} />
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <p className="text-muted fs-5">No se encontraron productos en esta categoría.</p>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Catalogo;
