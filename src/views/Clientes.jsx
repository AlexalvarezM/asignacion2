import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaClientes from "../components/clientes/TablaClientes";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    celular: ""
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    const res = clientes.filter(cli => 
      cli.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cli.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      cli.celular.includes(busqueda)
    );
    setFiltrados(res);
    setPaginaActual(1);
  }, [busqueda, clientes]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });
      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarCliente = async () => {
    try {
      const { error } = await supabase.from("clientes").insert([nuevoCliente]);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Cliente registrado con éxito", tipo: "exito" });
      setMostrarRegistro(false);
      setNuevoCliente({ nombre: "", apellido: "", celular: "" });
      cargarClientes();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al registrar cliente", tipo: "error" });
    }
  };

  const actualizarCliente = async (datos) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .update(datos)
        .eq("id_cliente", clienteSeleccionado.id_cliente);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Cliente actualizado con éxito", tipo: "exito" });
      setMostrarEdicion(false);
      cargarClientes();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al actualizar cliente", tipo: "error" });
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este cliente?")) return;
    try {
      const { error } = await supabase.from("clientes").delete().eq("id_cliente", id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: "Cliente eliminado", tipo: "exito" });
      cargarClientes();
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error al eliminar cliente", tipo: "error" });
    }
  };

  const clientesPaginados = filtrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3><i className="bi bi-person-badge-fill me-2"></i> Gestión de Clientes</h3>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarRegistro(true)} variant="primary">
            <i className="bi bi-plus-lg me-2"></i>Nuevo Cliente
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
          <TablaClientes 
            clientes={clientesPaginados} 
            abrirModalEdicion={(cli) => { setClienteSeleccionado(cli); setMostrarEdicion(true); }}
            abrirModalEliminacion={(cli) => eliminarCliente(cli.id_cliente)}
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

      <ModalRegistroCliente 
        show={mostrarRegistro} 
        onHide={() => setMostrarRegistro(false)}
        agregarCliente={agregarCliente}
        nuevaCliente={nuevoCliente}
        manejoCambioInput={(e) => setNuevoCliente({...nuevoCliente, [e.target.name]: e.target.value})}
      />

      <ModalEdicionCliente 
        show={mostrarEdicion} 
        onHide={() => setMostrarEdicion(false)}
        cliente={clienteSeleccionado}
        actualizarCliente={actualizarCliente}
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

export default Clientes;
