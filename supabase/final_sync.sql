-- ================================================================
-- SCRIPT DE UNIFICACIÓN FINAL - EJECUTAR EN SQL EDITOR DE SUPABASE
-- ================================================================

-- 1. LIMPIEZA INICIAL
-- Borramos las restricciones viejas para evitar conflictos al recrear
ALTER TABLE IF EXISTS public.empleados DROP CONSTRAINT IF EXISTS empleados_tipo_empleado_fkey;
DROP TABLE IF EXISTS public.permisos CASCADE;

-- 2. TABLA DE PERMISOS
CREATE TABLE public.permisos ( 
  id_permiso bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  rol character varying NOT NULL UNIQUE, 
  permisos jsonb NOT NULL DEFAULT '{}', 
  descripcion text 
); 

-- 3. INSERTAR ROLES Y PERMISOS TÉCNICOS
-- Nota: 'rol' siempre en minúsculas para coincidir con la lógica del frontend
INSERT INTO public.permisos (rol, descripcion, permisos) VALUES 
('administrador', 'Acceso total al sistema (Super Usuario)', 
'{
  "ver_inicio": true, "ver_categorias": true, "ver_productos": true, 
  "ver_clientes": true, "ver_empleados": true, "ver_catalogo": true, 
  "ver_permisos": true
}'::jsonb), 
('cajero', 'Cajero - Operaciones de venta', 
'{
  "ver_inicio": true, "ver_productos": true, "ver_clientes": true, 
  "ver_catalogo": true
}'::jsonb), 
('mesero', 'Mesero - Solo catálogo', 
'{
  "ver_inicio": true, "ver_catalogo": true
}'::jsonb),
('vendedor', 'Vendedor de piso', 
'{
  "ver_inicio": true, "ver_catalogo": true, "ver_clientes": true
}'::jsonb)
ON CONFLICT (rol) DO UPDATE SET permisos = EXCLUDED.permisos, descripcion = EXCLUDED.descripcion;

-- 4. RESTRUCTURAR Y NORMALIZAR TABLA EMPLEADOS
-- Asegurar que existan las columnas nuevas
ALTER TABLE public.empleados ADD COLUMN IF NOT EXISTS id_empleado bigint GENERATED ALWAYS AS IDENTITY;
ALTER TABLE public.empleados ADD COLUMN IF NOT EXISTS nombre_empleado character varying;
ALTER TABLE public.empleados ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.empleados ADD COLUMN IF NOT EXISTS tipo_empleado text;

-- Migrar datos de columnas legacy si existen
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='empleados' AND column_name='nombre') THEN
        UPDATE public.empleados SET nombre_empleado = COALESCE(nombre_empleado, nombre);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='empleados' AND column_name='apellido') THEN
        UPDATE public.empleados SET apellido_empleado = COALESCE(apellido_empleado, apellido);
    END IF;
END $$;

-- Rellenar datos obligatorios faltantes
UPDATE public.empleados SET nombre_empleado = 'Empleado ' || id_empleado WHERE nombre_empleado IS NULL OR nombre_empleado = '';
UPDATE public.empleados SET email = 'usuario' || id_empleado || '@restaurante.local' WHERE email IS NULL OR email = '';
UPDATE public.empleados SET tipo_empleado = LOWER(TRIM(COALESCE(tipo_empleado, 'mesero')));

-- Forzar que todos los empleados tengan un rol válido
UPDATE public.empleados SET tipo_empleado = 'mesero' WHERE tipo_empleado NOT IN (SELECT rol FROM public.permisos);

-- 5. APLICAR RESTRICCIONES DE INTEGRIDAD
-- Primary Key (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'empleados_pkey') THEN
        ALTER TABLE public.empleados ADD CONSTRAINT empleados_pkey PRIMARY KEY (id_empleado);
    END IF;
END $$;

-- Foreign Key para Roles
ALTER TABLE public.empleados 
ADD CONSTRAINT empleados_tipo_empleado_fkey 
FOREIGN KEY (tipo_empleado) REFERENCES public.permisos(rol);

-- 6. LIMPIEZA DE COLUMNAS ANTIGUAS (Opcional, pero recomendado para orden)
-- ALTER TABLE public.empleados DROP COLUMN IF EXISTS nombre;
-- ALTER TABLE public.empleados DROP COLUMN IF EXISTS apellido;
-- ALTER TABLE public.empleados DROP COLUMN IF EXISTS id;
