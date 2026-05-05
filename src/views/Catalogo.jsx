import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      
      // Cargar categorías
      const { data: catData, error: catError } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre", { ascending: true });
      
      if (catError) throw catError;
      setCategorias(catData || []);

      // Cargar productos
      const { data: prodData, error: prodError } = await supabase
        .from("productos")
        .select("*")
        .order("nombre_producto", { ascending: true });

      if (prodError) throw prodError;
      setProductos(prodData || []);
    } catch (err) {
      console.error("Error al cargar datos:", err.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id_categoria === idCategoria);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchCategoria = 
      categoriaSeleccionada === "Todas" || 
      producto.categoria_producto === parseInt(categoriaSeleccionada);
    
    const matchBusqueda = 
      producto.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.descripcion_producto && producto.descripcion_producto.toLowerCase().includes(busqueda.toLowerCase()));
    
    return matchCategoria && matchBusqueda;
  });

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <div className="text-center mb-5">
          <h2 className="fw-extrabold text-primary display-5 mb-2">Nuestro Catálogo</h2>
          <p className="text-muted fs-5"></p>
        </div>

        <div className="bg-white p-4 rounded-4 shadow-sm mb-5 border-0">
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-bold text-uppercase text-muted mb-2">Filtrar por categoría</Form.Label>
                <Form.Select 
                  value={categoriaSeleccionada} 
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="rounded-pill border-2 py-2 px-3 shadow-none"
                >
                  <option value="Todas">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-bold text-uppercase text-muted mb-2">Búsqueda rápida</Form.Label>
                <CuadroBusquedas 
                  textoBusqueda={busqueda} 
                  manejarCambioBusqueda={(e) => setBusqueda(e.target.value)} 
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted fw-bold">Cargando productos...</p>
          </div>
        ) : (
          <>
            {productosFiltrados.length > 0 ? (
              <Row className="g-4">
                {productosFiltrados.map((producto) => (
                  <Col key={producto.id_producto} sm={6} lg={4} xl={3}>
                    <TarjetaCatalogo 
                      producto={producto} 
                      categorianombre={obtenerNombreCategoria(producto.categoria_producto)}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5 bg-white rounded-5 shadow-sm border">
                <i className="bi bi-search display-1 text-muted opacity-25 mb-4 d-block"></i>
                <h3 className="fw-bold text-main">No se encontraron productos</h3>
                <p className="text-muted">Intenta con otros criterios de búsqueda o categoría.</p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Catalogo;
