import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import TablaVentas from "../components/ventas/TablaVentas";
import TarjetaVenta from "../components/ventas/TarjetaVenta";
import FormularioVenta from "../components/ventas/FormularioVenta";

const Ventas = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [moneda, setMoneda] = useState("cordoba");
  const [detalles, setDetalles] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Cargar datos
  const cargarDatosAuxiliares = async () => {
    try {
      const [c, e, p] = await Promise.all([
        supabase.from("clientes").select("*"),
        supabase.from("empleados").select("*"),
        supabase.from("productos").select("*")
      ]);
      setClientes(c.data || []);
      setEmpleados(e.data || []);
      setProductos(p.data || []);
    } catch (err) {
      console.error("Error cargando auxiliares:", err);
    }
  };

  const cargarVentas = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("ventas")
        .select(`
          *,
          clientes (nombre_cliente, apellido_cliente),
          empleados (nombre_empleado, apellido_empleado),
          detalles_ventas (*, productos (nombre_producto, precio_dolar))
        `)
        .order("fecha_venta", { ascending: false });

      if (error) {
        console.error("Error al cargar ventas:", error);
        setToast({ mostrar: true, mensaje: "Error al cargar ventas", tipo: "error" });
        return;
      }
      setVentas(data || []);
    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar ventas", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVentas();
    cargarDatosAuxiliares();
  }, []);

  // Precargar formulario al editar
  useEffect(() => {
    if (ventaAEditar) {
      const cliente = clientes.find(c => c.id_cliente === ventaAEditar.id_cliente);
      const empleado = empleados.find(e => e.id_empleado === ventaAEditar.id_empleado);

      setClienteSeleccionado(cliente || null);
      setEmpleadoSeleccionado(empleado || null);
      setMetodoPago(ventaAEditar.metodo_pago || "efectivo");
      setMoneda(ventaAEditar.moneda || "cordoba");

      if (ventaAEditar.detalles_ventas?.length > 0) {
        const detallesFormateados = ventaAEditar.detalles_ventas.map(d => ({
          id_producto: d.id_producto,
          nombre_producto: d.productos?.nombre_producto || "Producto",
          precio: d.precio_unitario,
          precio_dolar: d.productos?.precio_dolar || 0,
          cantidad: d.cantidad
        }));
        setDetalles(detallesFormateados);
      } else {
        setDetalles([]);
      }
    }
  }, [ventaAEditar, clientes, empleados]);

  // Calcular total
  useEffect(() => {
    const total = detalles.reduce((sum, det) => {
      const precioSeleccionado = moneda === "dolar" ? (det.precio_dolar || 0) : det.precio;
      return sum + (det.cantidad * precioSeleccionado);
    }, 0);
    setTotalGeneral(total);
  }, [detalles, moneda]);

  // Búsqueda
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setVentasFiltradas(ventas);
    } else {
      const textoLower = textoBusqueda.toLowerCase();
      const filtradas = ventas.filter(v =>
        `${v.clientes?.nombre_cliente || ''} ${v.clientes?.apellido_cliente || ''}`.toLowerCase().includes(textoLower) ||
        v.empleados?.nombre_empleado?.toLowerCase().includes(textoLower)
      );
      setVentasFiltradas(filtradas);
    }
  }, [textoBusqueda, ventas]);

  const abrirNuevaVenta = () => {
    resetFormulario();
    setMostrarFormulario(true);
  };

  const abrirEdicion = (venta) => {
    setVentaAEditar(venta);
    setMostrarFormulario(true);
  };

  const resetFormulario = () => {
    setClienteSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setMetodoPago("efectivo");
    setMoneda("cordoba");
    setDetalles([]);
    setVentaAEditar(null);
  };

  const agregarDetalle = (producto, cantidad) => {
    if (!producto || !cantidad) return;
    setDetalles(prev => {
      const existe = prev.find(d => d.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(d =>
          d.id_producto === producto.id_producto ? { ...d, cantidad: d.cantidad + cantidad } : d
        );
      }
      return [...prev, {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        precio: producto.precio_producto,
        precio_dolar: producto.precio_dolar || 0,
        cantidad
      }];
    });
  };

  const eliminarDetalle = (id_producto) => {
    setDetalles(prev => prev.filter(d => d.id_producto !== id_producto));
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setDetalles(prev => prev.map(d =>
      d.id_producto === id_producto ? { ...d, cantidad: nuevaCantidad } : d
    ));
  };

  const guardarVenta = async () => {
    if (!clienteSeleccionado || !empleadoSeleccionado || detalles.length === 0) {
      setToast({ mostrar: true, mensaje: "Faltan datos obligatorios", tipo: "advertencia" });
      return;
    }

    try {
      if (ventaAEditar) {
        // === ACTUALIZAR ===
        
        // 1. Restablecer el stock anterior
        const { data: oldDetalles } = await supabase
          .from("detalles_ventas")
          .select("id_producto, cantidad")
          .eq("id_venta", ventaAEditar.id_venta);

        if (oldDetalles) {
          for (const od of oldDetalles) {
            const { data: prodData } = await supabase
              .from("productos")
              .select("stock")
              .eq("id_producto", od.id_producto)
              .single();
            if (prodData) {
              await supabase
                .from("productos")
                .update({ stock: (prodData.stock || 0) + od.cantidad })
                .eq("id_producto", od.id_producto);
            }
          }
        }

        // 2. Actualizar venta
        const { error: updateError } = await supabase.from("ventas").update({
          id_cliente: clienteSeleccionado.id_cliente,
          id_empleado: empleadoSeleccionado.id_empleado,
          metodo_pago: metodoPago,
          moneda: moneda,
          total: totalGeneral
        }).eq("id_venta", ventaAEditar.id_venta);

        if (updateError) throw updateError;

        // 3. Borrar detalles anteriores
        const { error: deleteError } = await supabase.from("detalles_ventas").delete().eq("id_venta", ventaAEditar.id_venta);
        if (deleteError) throw deleteError;

        // 4. Insertar detalles nuevos
        const detallesInsert = detalles.map(d => ({
          id_venta: ventaAEditar.id_venta,
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: moneda === "dolar" ? (d.precio_dolar || 0) : d.precio,
          subtotal: d.cantidad * (moneda === "dolar" ? (d.precio_dolar || 0) : d.precio)
        }));

        const { error: insertDetError } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (insertDetError) throw insertDetError;

        // 5. Restar nuevo stock
        for (const d of detalles) {
          const { data: prodData } = await supabase
            .from("productos")
            .select("stock")
            .eq("id_producto", d.id_producto)
            .single();
          if (prodData) {
            const nuevoStock = Math.max(0, (prodData.stock || 0) - d.cantidad);
            await supabase
              .from("productos")
              .update({ stock: nuevoStock })
              .eq("id_producto", d.id_producto);
          }
        }

        setToast({ mostrar: true, mensaje: "Venta actualizada exitosamente", tipo: "exito" });
      } else {
        // === NUEVA VENTA ===
        const nicaNow = () => new Date().toLocaleString("sv", { timeZone: "America/Managua" }).replace(" ", "T");

        // 1. Insertar venta
        const { data: ventaData, error: insertVentaError } = await supabase
          .from("ventas")
          .insert([{
            id_cliente: clienteSeleccionado.id_cliente,
            id_empleado: empleadoSeleccionado.id_empleado,
            fecha_venta: nicaNow(),
            metodo_pago: metodoPago,
            moneda: moneda,
            total: totalGeneral
          }])
          .select()
          .single();

        if (insertVentaError) throw insertVentaError;
        if (!ventaData) throw new Error("No se pudo obtener la información de la venta creada");

        // 2. Insertar detalles
        const detallesInsert = detalles.map(d => ({
          id_venta: ventaData.id_venta,
          id_producto: d.id_producto,
          cantidad: d.cantidad,
          precio_unitario: moneda === "dolar" ? (d.precio_dolar || 0) : d.precio,
          subtotal: d.cantidad * (moneda === "dolar" ? (d.precio_dolar || 0) : d.precio)
        }));

        const { error: insertDetError } = await supabase.from("detalles_ventas").insert(detallesInsert);
        if (insertDetError) throw insertDetError;

        // 3. Restar stock
        for (const d of detalles) {
          const { data: prodData } = await supabase
            .from("productos")
            .select("stock")
            .eq("id_producto", d.id_producto)
            .single();
          if (prodData) {
            const nuevoStock = Math.max(0, (prodData.stock || 0) - d.cantidad);
            await supabase
              .from("productos")
              .update({ stock: nuevoStock })
              .eq("id_producto", d.id_producto);
          }
        }

        setToast({ mostrar: true, mensaje: "Venta registrada exitosamente", tipo: "exito" });
      }

      resetFormulario();
      setMostrarFormulario(false);
      await cargarVentas();

    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: err.message || "Error al guardar la venta", tipo: "error" });
    }
  };

  const manejarBusqueda = (e) => setTextoBusqueda(e.target.value);

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={8} lg={8}>
          <h3 className="mb-0">
            <i className="bi bi-receipt-cutoff me-2"></i> Ventas
          </h3>
        </Col>
        <Col xs={4} lg={4} className="text-end">
          <Button onClick={abrirNuevaVenta} size="md">
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Venta</span>
          </Button>
        </Col>
      </Row>
      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por cliente o empleado..."
          />
        </Col>
      </Row>

      {cargando ? (
        <Row className="text-center my-5">
          <Spinner animation="border" variant="success" size="lg" />
          <p className="mt-3 text-muted">Cargando ventas...</p>
        </Row>
      ) : (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaVenta ventas={ventasPaginadas} abrirEdicion={abrirEdicion} />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaVentas ventas={ventasPaginadas} abrirEdicion={abrirEdicion} />
          </Col>
        </Row>
      )}

      {ventasFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={ventasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <FormularioVenta
        mostrar={mostrarFormulario}
        setMostrar={setMostrarFormulario}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        clienteSeleccionado={clienteSeleccionado}
        setClienteSeleccionado={setClienteSeleccionado}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        moneda={moneda}
        setMoneda={setMoneda}
        detalles={detalles}
        totalGeneral={totalGeneral}
        agregarDetalle={agregarDetalle}
        eliminarDetalle={eliminarDetalle}
        actualizarCantidad={actualizarCantidad}
        guardarVenta={guardarVenta}
        ventaAEditar={ventaAEditar}
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

export default Ventas;
