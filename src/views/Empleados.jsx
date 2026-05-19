import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const limpiarTexto = (valor) => valor?.trim() || "";

const normalizarOpcional = (valor) => {
  const texto = limpiarTexto(valor);
  return texto || null;
};

const normalizarEmpleado = (empleado) => ({
  id_empleado: empleado.id_empleado,
  nombre_empleado: empleado.nombre_empleado || "",
  apellido_empleado: empleado.apellido_empleado || "",
  email: empleado.email || "",
  celular: empleado.celular || "",
  pin: empleado.pin_acceso || empleado.pin || "",
  tipo_empleado: empleado.tipo_empleado || "mesero",
});

const construirPayloadEmpleado = (empleado) => {
  const apellido = normalizarOpcional(empleado.apellido_empleado);
  return {
    nombre_empleado: limpiarTexto(empleado.nombre_empleado),
    apellido_empleado: apellido,
    apellido: apellido || "", // Columna legacy con restricción NOT NULL
    pin_acceso: normalizarOpcional(empleado.pin),
    email: limpiarTexto(empleado.email),
    tipo_empleado: limpiarTexto(empleado.tipo_empleado) || "mesero",
  };
};

const Empleados = () => {

  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);   // ← Estado de carga inicial
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_empleado: "",
    apellido_empleado: "",
    celular: "",
    pin: "",
    email: "",
    password: "",
    tipo_empleado: "mesero",
  });

  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_empleado: "",
    nombre_empleado: "",
    apellido_empleado: "",
    celular: "",
    pin: "",
    email: "",
    tipo_empleado: "",
  });

  const [empleadoEliminar, setEmpleadoEliminar] = useState(null);

  const cargarEmpleados = useCallback(async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al cargar empleados", tipo: "error" });
        return;
      }
      const empleadosNormalizados = (data || []).map(normalizarEmpleado);
      setEmpleados(empleadosNormalizados);
      setEmpleadosFiltrados(empleadosNormalizados);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar empleados", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }, []);

  const insertarEmpleado = useCallback(async (empleado) => {
    const payload = construirPayloadEmpleado(empleado);
    const { error } = await supabase.from("empleados").insert([payload]);
    if (error) throw error;
  }, []);

  const actualizarRegistroEmpleado = useCallback(async (empleado) => {
    const payload = construirPayloadEmpleado(empleado);
    const { error } = await supabase
      .from("empleados")
      .update(payload)
      .eq("id_empleado", empleado.id_empleado);
    if (error) throw error;
  }, []);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  // Filtrado
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const texto = textoBusqueda.toLowerCase().trim();
      const filtrados = empleados.filter(emp =>
        `${emp.nombre_empleado} ${emp.apellido_empleado} ${emp.email || ""} ${emp.tipo_empleado || ""}`
          .toLowerCase().includes(texto)
      );
      setEmpleadosFiltrados(filtrados);
    }
  }, [textoBusqueda, empleados]);

  const agregarEmpleado = async () => {
    if (
      !limpiarTexto(nuevoEmpleado.nombre_empleado) ||
      !limpiarTexto(nuevoEmpleado.email) ||
      !limpiarTexto(nuevoEmpleado.password)
    ) {
      setToast({ mostrar: true, mensaje: "Los campos Nombre, Email y Contraseña son obligatorios", tipo: "advertencia" });
      return;
    }

    try {
      setMostrarModal(false);

      const { error: authError } = await supabase.auth.signUp({
        email: limpiarTexto(nuevoEmpleado.email),
        password: nuevoEmpleado.password,
        options: {
          data: {
            nombre: limpiarTexto(nuevoEmpleado.nombre_empleado),
            apellido: normalizarOpcional(nuevoEmpleado.apellido_empleado),
          },
        },
      });

      if (authError) throw authError;

      await insertarEmpleado(nuevoEmpleado);

      await cargarEmpleados();
      setNuevoEmpleado({
        nombre_empleado: "",
        apellido_empleado: "",
        celular: "",
        pin: "",
        email: "",
        password: "",
        tipo_empleado: "mesero",
      });

      setToast({
        mostrar: true,
        mensaje: `Empleado ${nuevoEmpleado.nombre_empleado} registrado correctamente`,
        tipo: "exito"
      });
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: err.message || "Error al registrar empleado", tipo: "error" });
    }
  };

  const actualizarEmpleado = async () => {
    if (!limpiarTexto(empleadoEditar.nombre_empleado)) {
      setToast({ mostrar: true, mensaje: "El nombre del empleado es obligatorio", tipo: "advertencia" });
      return;
    }

    try {
      setMostrarModalEdicion(false);
      await actualizarRegistroEmpleado(empleadoEditar);

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoEditar.nombre_empleado} actualizado`,
        tipo: "exito"
      });
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      setToast({ mostrar: true, mensaje: error.message || "Error al actualizar empleado", tipo: "error" });
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar({
      id_empleado: empleado.id_empleado,
      nombre_empleado: empleado.nombre_empleado,
      apellido_empleado: empleado.apellido_empleado,
      celular: empleado.celular || "",
      pin: empleado.pin || "",
      email: empleado.email || "",
      tipo_empleado: empleado.tipo_empleado || "mesero",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h3><i className="bi-person-badge-fill me-2"></i>Empleados</h3>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg me-1"></i>Nuevo Empleado
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {/* Spinner de carga inicial */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando empleados...</p>
          </Col>
        </Row>
      )}

      {/* Alert cuando no hay coincidencias en la búsqueda */}
      {!cargando && textoBusqueda.trim() && empleadosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron empleados que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Mostrar tabla o tarjetas solo cuando hay resultados y ya cargó */}
      {!cargando && empleadosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaEmpleado
              empleados={empleadosFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaEmpleados
              empleados={empleadosFiltrados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Modales */}
      <ModalRegistroEmpleado
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        setNuevoEmpleado={setNuevoEmpleado}
        agregarEmpleado={agregarEmpleado}
      />

      <ModalEdicionEmpleado
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        empleadoEditar={empleadoEditar}
        setEmpleadoEditar={setEmpleadoEditar}
        actualizarEmpleado={actualizarEmpleado}
      />

      <ModalEliminacionEmpleado
        show={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        empleado={empleadoEliminar}
        onUpdate={cargarEmpleados}
        setToast={setToast}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Empleados;
