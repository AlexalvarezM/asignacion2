import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import emailjs from "@emailjs/browser";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado de carga inicial
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre: "",
    descripcion: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1); // Reset to page 1 on search
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(textoLower) ||
          (cat.descripcion_categoria && cat.descripcion_categoria.toLowerCase().includes(textoLower))
      );
      setCategoriasFiltradas(filtradas);
    }
  }, [textoBusqueda, categorias]);

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre_categoria,
      descripcion: categoria.descripcion_categoria,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const generarPDFCategoria = (categoria) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Categoría", 14, 20);

    // Línea decorativa
    doc.line(14, 25, 195, 25);

    // Información de la categoría
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", categoria.id_categoria],
        ["Nombre", categoria.nombre_categoria],
        ["Descripción", categoria.descripcion_categoria],
      ],
    });

    // Descargar PDF
    doc.save(`categoria_${categoria.id_categoria}.pdf`);
  };

  const exportarTodasLasCategorias = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Reporte General de Categorías", 14, 20);
    
    doc.line(14, 25, 195, 25);
    
    const body = categorias.map(cat => [
      cat.id_categoria,
      cat.nombre_categoria,
      cat.descripcion_categoria
    ]);
    
    autoTable(doc, {
      startY: 35,
      head: [["ID", "Nombre", "Descripción"]],
      body: body,
    });
    
    doc.save("todas_las_categorias.pdf");
  };

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar categorías.",
          tipo: "error",
        });
        return;
      }
      
      // Mapear los datos de la BD a los nombres de campo solicitados por el profesor
      const datosMapeados = (data || []).map(cat => ({
        id_categoria: cat.id_categoria,
        nombre_categoria: cat.nombre || "",
        descripcion_categoria: cat.descripcion || ""
      }));
      
      setCategorias(datosMapeados);
    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre || !nuevaCategoria.nombre.trim()) {
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
      await cargarCategorias();

    } catch (err) {
      console.error("Error al agregar categoría:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Hubo un error al crear la categoría.",
        tipo: "error",
      });
    }
  };

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";

    let texto = "LISTADO DE CATEGORÍAS\n\n";
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de Categorías: ${categorias.length}\n\n`;

    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre_categoria}\n`;
      if (cat.descripcion_categoria) {
        texto += `   Descripción: ${cat.descripcion_categoria}\n`;
      }
      texto += "\n";
    });

    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }

    setEnviandoCorreo(true);

    const mensaje = formatearCategoriasParaCorreo();

    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setToast({
        mostrar: true,
        mensaje: "Correo enviado correctamente.",
        tipo: "exito",
      });
      setMostrarModalCorreo(false);
      setEmailDestino("");
    })
    .catch((error) => {
      console.error("Error EmailJS:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al enviar el correo.",
        tipo: "error",
      });
    })
    .finally(() => {
      setEnviandoCorreo(false);
    });
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
            <h3 className="mb-0">
              <i className="bi bi-bookmark-plus-fill me-2"></i> Categorías
            </h3>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} className="text-end">
            <Button variant="primary" onClick={abrirModalCorreo} size="md">
              <i className="bi bi-envelope"></i>
              <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
            </Button>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} className="text-end">
            <Button
              variant="primary"
              onClick={() => setMostrarModal(true)}
              size="md"
            >
              <i className="bi bi-plus-lg"></i>
              <span className="d-none d-lg-inline ms-2">Nueva Categoría</span>
            </Button>
          </Col>
        </Row>
        <hr className="profe-separator" />

        {/* Cuadro de búsqueda debajo de la línea divisoria */}
        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
              placeholder="Buscar por nombre o descripción..."
            />
          </Col>
        </Row>

        {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
        {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="text-center">
                <i className="bi bi-info-circle me-2"></i>
                No se encontraron categorías que coincidan con "{textoBusqueda}".
              </Alert>
            </Col>
          </Row>
        )}

        {/* Spinner mientras se cargan las categorías */}
        {cargando && (
          <Row className="text-center my-5">
            <Col>
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Cargando categorías...</p>
            </Col>
          </Row>
        )}

        {/* Lista de categorías filtradas */}
        {!cargando && categoriasFiltradas.length > 0 && (
          <Row>
            {/* Implementación de las tarjetas para móviles */}
            <Col xs={12} sm={12} md={12} className="d-lg-none">
              <TarjetaCategoria
                categorias={categoriasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
              />
            </Col>

            {/* Implementación de la tabla para pantallas grandes */}
            <Col lg={12} className="d-none d-lg-block">
              <TablaCategorias
                categorias={categoriasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                generarPDFCategoria={generarPDFCategoria}
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
              />
            </Col>
          </Row>
        )}

        {/* Paginación */}
        {categoriasFiltradas.length > 0 && (
          <Paginacion
            registrosPorPagina={registrosPorPagina}
            totalRegistros={categoriasFiltradas.length}
            paginaActual={paginaActual}
            establecerPaginaActual={establecerPaginaActual}
            establecerRegistrosPorPagina={establecerRegistrosPorPagina}
          />
        )}

        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejoCambioInput={manejoCambioInput}
          agregarCategoria={agregarCategoria}
        />

        {categoriaEditar && (
          <ModalEdicionCategoria
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            categoria={categoriaEditar}
            onUpdate={cargarCategorias}
            setToast={setToast}
          />
        )}

        {categoriaAEliminar && (
          <ModalEliminacionCategoria
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            categoria={categoriaAEliminar}
            onUpdate={cargarCategorias}
            setToast={setToast}
          />
        )}

        <ModalEnvioCorreoCategorias
          mostrarModalCorreo={mostrarModalCorreo}
          setMostrarModalCorreo={setMostrarModalCorreo}
          emailDestino={emailDestino}
          setEmailDestino={setEmailDestino}
          enviandoCorreo={enviandoCorreo}
          enviarCorreoCategorias={enviarCorreoCategorias}
          totalCategorias={categorias.length}
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
