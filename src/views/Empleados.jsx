import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: ""
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    const res = empleados.filter(emp => 
      emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFiltrados(res);
    setPaginaActual(1);
  }, [busqueda, empleados]);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });
      if (error) throw error;
      setEmpleados(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarEmpleado = async () => {
    try {
      const { error } = await supabase.from("empleados").insert([nuevoEmpleado]);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Empleado registrado con éxito", tipo: "exito" });
      setMostrarRegistro(false);
      setNuevoEmpleado({ nombre: "", apellido: "", pin_acceso: "", tipo_empleado: "" });
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al registrar empleado", tipo: "error" });
    }
  };

  const actualizarEmpleado = async (datos) => {
    try {
      const { error } = await supabase
        .from("empleados")
        .update(datos)
        .eq("id_empleado", empleadoSeleccionado.id_empleado);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Empleado actualizado con éxito", tipo: "exito" });
      setMostrarEdicion(false);
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al actualizar empleado", tipo: "error" });
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este empleado?")) return;
    try {
      const { error } = await supabase.from("empleados").delete().eq("id_empleado", id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Empleado eliminado", tipo: "exito" });
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al eliminar empleado", tipo: "error" });
    }
  };

  const empleadosPaginados = filtrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3><i className="bi bi-people-fill me-2"></i> Gestión de Empleados</h3>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarRegistro(true)} variant="primary">
            <i className="bi bi-plus-lg me-2"></i>Nuevo Empleado
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <CuadroBusquedas 
            textoBusqueda={busqueda} 
            manejarCambioBusqueda={(e) => setBusqueda(e.target.value)} 
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <TablaEmpleados 
            empleados={empleadosPaginados} 
            abrirModalEdicion={(emp) => { setEmpleadoSeleccionado(emp); setMostrarEdicion(true); }}
            abrirModalEliminacion={(emp) => eliminarEmpleado(emp.id_empleado)}
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
          />
          <Paginacion 
            paginaActual={paginaActual}
            totalRegistros={filtrados.length}
            registrosPorPagina={registrosPorPagina}
            establecerPaginaActual={setPaginaActual}
            establecerRegistrosPorPagina={setRegistrosPorPagina}
          />
        </>
      )}

      <ModalRegistroEmpleado 
        show={mostrarRegistro} 
        onHide={() => setMostrarRegistro(false)}
        agregarEmpleado={agregarEmpleado}
        nuevaEmpleado={nuevoEmpleado}
        manejoCambioInput={(e) => setNuevoEmpleado({...nuevoEmpleado, [e.target.name]: e.target.value})}
      />

      <ModalEdicionEmpleado 
        show={mostrarEdicion} 
        onHide={() => setMostrarEdicion(false)}
        empleado={empleadoSeleccionado}
        actualizarEmpleado={actualizarEmpleado}
      />

      <NotificacionOperacion 
        mostrar={toast.mostrar} 
        mensaje={toast.mensaje} 
        tipo={toast.tipo} 
        onCerrar={() => setToast({...toast, mostrar: false})} 
      />
    </Container>
  );
};

export default Empleados;
