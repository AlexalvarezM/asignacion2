import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import ModalQRProducto from "../components/productos/ModalQRProducto";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_producto: "",
    precio_dolar: "",
    stock: "",
    archivo: null,
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_producto: "",
    precio_dolar: "",
    stock: "",
    imagen_url: "",
    archivo: null,
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [productoQR, setProductoQR] = useState(null);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoAEditar({
      ...producto,
      archivo: null,
    });
    setMostrarModalEdicion(true);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoAEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoEdicion = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoAEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (textoBusqueda.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre_producto?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precio = prod.precio_producto?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias!fk_categoria_producto(nombre)")
        .order("id_producto", { ascending: true });
      if (error) throw error;
      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_producto ||
        !nuevoProducto.precio_dolar ||
        !nuevoProducto.stock ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios (nombre, categoría, precios, stock e imagen).",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      const urlImagen = urlData.publicUrl;

      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto || null,
          categoria_producto: parseInt(nuevoProducto.categoria_producto),
          precio_producto: parseFloat(nuevoProducto.precio_producto),
          precio_dolar: parseFloat(nuevoProducto.precio_dolar),
          stock: parseInt(nuevoProducto.stock),
          imagen_url: urlImagen,
        },
      ]);

      if (error) throw error;

      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        categoria_producto: "",
        precio_producto: "",
        precio_dolar: "",
        stock: "",
        archivo: null,
      });

      setToast({ mostrar: true, mensaje: "Producto registrado correctamente", tipo: "exito" });
      cargarProductos();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setToast({ mostrar: true, mensaje: "Error al registrar producto", tipo: "error" });
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoAEditar.nombre_producto ||
        !productoAEditar.categoria_producto ||
        !productoAEditar.precio_producto ||
        !productoAEditar.precio_dolar ||
        !productoAEditar.stock
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      let urlImagen = productoAEditar.imagen_url;

      if (productoAEditar.archivo) {
        const nombreArchivo = `${Date.now()}_${productoAEditar.archivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoAEditar.archivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);

        urlImagen = urlData.publicUrl;

        if (productoAEditar.imagen_url) {
          const nombreImagenVieja = productoAEditar.imagen_url.split("/").pop();
          await supabase.storage.from("imagenes_productos").remove([nombreImagenVieja]);
        }
      }

      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoAEditar.nombre_producto,
          descripcion_producto: productoAEditar.descripcion_producto || null,
          categoria_producto: parseInt(productoAEditar.categoria_producto),
          precio_producto: parseFloat(productoAEditar.precio_producto),
          precio_dolar: parseFloat(productoAEditar.precio_dolar),
          stock: parseInt(productoAEditar.stock),
          imagen_url: urlImagen,
        })
        .eq("id_producto", productoAEditar.id_producto);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Producto actualizado correctamente", tipo: "exito" });
      setMostrarModalEdicion(false);
      cargarProductos();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      setToast({ mostrar: true, mensaje: "Error al actualizar producto", tipo: "error" });
    }
  };

  const copiarProducto = async (producto) => {
    if (!producto) return;

    const texto = `ID: ${producto.id_producto}\nProducto: ${producto.nombre_producto}\nCategoría: ${producto.categorias?.nombre || 'Sin categoría'}\nPrecio: C$ ${parseFloat(producto.precio_producto || 0).toLocaleString()} / $ ${parseFloat(producto.precio_dolar || 0).toLocaleString()}\nStock: ${producto.stock}\nDescripción: ${producto.descripcion_producto || 'Sin descripción'}`;

    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Producto "${producto.nombre_producto}" copiado al portapapeles.`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al copiar:", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar al portapapeles",
        tipo: "error",
      });
    }
  };

  const generarQRImagen = (producto) => {
    const urlImagen = producto?.imagen_url || producto?.url_imagen;
    if (!urlImagen) {
      setToast({
        mostrar: true,
        mensaje: "Este producto no tiene imagen asociada",
        tipo: "advertencia"
      });
      return;
    }

    setProductoQR(producto);
    setMostrarModalQR(true);
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi bi-bag-heart-fill me-2"></i> Productos
          </h3>
        </Col>

        <Col xs={12} sm={5} md={5} lg={3} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi bi-plus"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Producto</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, descripción o precio..."
          />
        </Col>
      </Row>

      {/* Modales */}
      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoAEditar={productoAEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoEdicion={manejoCambioArchivoEdicion}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast((prev) => ({ ...prev, mostrar: false }))}
      />

      <ModalQRProducto
        mostrar={mostrarModalQR}
        onHide={() => setMostrarModalQR(false)}
        producto={productoQR}
      />

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : productosFiltrados.length === 0 ? (
        <Alert variant="info">No se encontraron productos.</Alert>
      ) : (
        <TarjetasProductos
          productos={productosFiltrados}
          abrirModalEdicion={abrirModalEdicion}
          onUpdate={cargarProductos}
          setToast={setToast}
          copiarProducto={copiarProducto}
          generarQRImagen={generarQRImagen}
        />
      )}
    </Container>
  );
};

export default Productos;
