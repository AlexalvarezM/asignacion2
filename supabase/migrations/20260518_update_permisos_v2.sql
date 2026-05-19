-- ============================================= 
-- TABLA DE PERMISOS 
-- ============================================= 

-- 1. Crear o actualizar la tabla (si ya existe) 
DROP TABLE IF EXISTS public.permisos CASCADE; 

CREATE TABLE public.permisos ( 
  id_permiso bigint GENERATED ALWAYS AS IDENTITY NOT NULL, 
  rol character varying NOT NULL UNIQUE, 
  permisos jsonb NOT NULL DEFAULT '{}', 
  descripcion text, 
  CONSTRAINT permisos_pkey PRIMARY KEY (id_permiso) 
); 

-- 2. Insertar los roles con permisos según tus vistas 
INSERT INTO public.permisos (rol, descripcion, permisos) VALUES 

('administrador', 'Acceso total al sistema (Super Usuario)', 
'{ 
  "ver_inicio": true, 
  "ver_categorias": true, 
  "ver_productos": true, 
  "ver_clientes": true, 
  "ver_empleados": true, 
  "ver_ventas": true, 
  "ver_catalogo": true, 
  "ver_permisos": true, 
  "ver_reportes": true,
  "administrar_sistema": true
}'::jsonb), 

('cajero', 'Cajero - Ventas y operaciones básicas', 
'{ 
  "ver_inicio": true, 
  "ver_productos": true, 
  "ver_clientes": true, 
  "ver_ventas": true, 
  "ver_catalogo": true 
}'::jsonb), 

('mesero', 'Mesero - Acceso limitado a inicio y catálogo', 
'{ 
  "ver_inicio": true, 
  "ver_catalogo": true 
}'::jsonb) 

ON CONFLICT (rol) DO UPDATE 
SET 
  permisos = EXCLUDED.permisos, 
  descripcion = EXCLUDED.descripcion; 

-- 3. Asegurar que la llave foránea en empleados apunte a esta nueva tabla
ALTER TABLE public.empleados DROP CONSTRAINT IF EXISTS empleados_tipo_empleado_fkey;
ALTER TABLE public.empleados 
ADD CONSTRAINT empleados_tipo_empleado_fkey 
FOREIGN KEY (tipo_empleado) REFERENCES public.permisos(rol);
