-- =============================================
-- TABLA: ventas
-- =============================================

CREATE TABLE IF NOT EXISTS public.ventas (
  id_venta bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_cliente bigint NOT NULL,
  id_empleado bigint NOT NULL,
  fecha_venta timestamp NOT NULL,
  metodo_pago text NOT NULL DEFAULT 'efectivo',
  total real NOT NULL DEFAULT 0,
  
  CONSTRAINT ventas_pkey PRIMARY KEY (id_venta),
  CONSTRAINT ventas_id_cliente_fkey FOREIGN KEY (id_cliente) 
    REFERENCES public.clientes(id_cliente) ON DELETE RESTRICT,
  CONSTRAINT ventas_id_empleado_fkey FOREIGN KEY (id_empleado) 
    REFERENCES public.empleados(id_empleado) ON DELETE RESTRICT
);

-- =============================================
-- TABLA: detalles_ventas
-- =============================================

CREATE TABLE IF NOT EXISTS public.detalles_ventas (
  id_detalle bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_venta bigint NOT NULL,
  id_producto bigint NOT NULL,
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario real NOT NULL CHECK (precio_unitario > 0),
  subtotal real NOT NULL,
  
  CONSTRAINT detalles_ventas_pkey PRIMARY KEY (id_detalle),
  CONSTRAINT detalles_ventas_id_venta_fkey FOREIGN KEY (id_venta) 
    REFERENCES public.ventas(id_venta) ON DELETE CASCADE,
  CONSTRAINT detalles_ventas_id_producto_fkey FOREIGN KEY (id_producto) 
    REFERENCES public.productos(id_producto) ON DELETE RESTRICT
);

-- Deshabilitar Seguridad de Nivel de Fila (RLS) para evitar error 403 Forbidden al insertar/consultar desde el frontend
ALTER TABLE IF EXISTS public.ventas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.detalles_ventas DISABLE ROW LEVEL SECURITY;
