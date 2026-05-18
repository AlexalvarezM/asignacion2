-- Migración segura para la tabla empleados
-- Esta migración adapta el esquema legacy al nuevo esquema y asegura la integridad de los datos.

DO $$
BEGIN
  -- 1. Crear la tabla si no existe
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'empleados'
  ) THEN
    CREATE TABLE public.empleados (
      id_empleado bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
      nombre_empleado character varying NOT NULL,
      apellido_empleado character varying,
      email text NOT NULL,
      celular character varying,
      pin character varying,
      tipo_empleado text NOT NULL DEFAULT 'mesero'::text,
      CONSTRAINT empleados_pkey PRIMARY KEY (id_empleado),
      CONSTRAINT empleados_email_key UNIQUE (email)
    );
    RETURN;
  END IF;
END $$;

-- 2. Asegurar que todas las columnas nuevas existan si la tabla ya existía
ALTER TABLE public.empleados
  ADD COLUMN IF NOT EXISTS nombre_empleado character varying,
  ADD COLUMN IF NOT EXISTS apellido_empleado character varying,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS celular character varying,
  ADD COLUMN IF NOT EXISTS pin character varying,
  ADD COLUMN IF NOT EXISTS tipo_empleado text;

-- 3. Migrar datos de columnas legacy a columnas nuevas
DO $$
BEGIN
  -- Copiar 'nombre' -> 'nombre_empleado'
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'empleados' AND column_name = 'nombre') THEN
    UPDATE public.empleados 
    SET nombre_empleado = COALESCE(NULLIF(BTRIM(nombre_empleado), ''), NULLIF(BTRIM(nombre), ''))
    WHERE nombre_empleado IS NULL OR BTRIM(nombre_empleado) = '';
  END IF;

  -- Copiar 'apellido' -> 'apellido_empleado'
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'empleados' AND column_name = 'apellido') THEN
    UPDATE public.empleados 
    SET apellido_empleado = COALESCE(NULLIF(BTRIM(apellido_empleado), ''), NULLIF(BTRIM(apellido), ''))
    WHERE apellido_empleado IS NULL OR BTRIM(apellido_empleado) = '';
  END IF;

  -- Copiar 'pin_acceso' -> 'pin'
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'empleados' AND column_name = 'pin_acceso') THEN
    UPDATE public.empleados 
    SET pin = COALESCE(NULLIF(BTRIM(pin), ''), NULLIF(BTRIM(pin_acceso), ''))
    WHERE pin IS NULL OR BTRIM(pin) = '';
  END IF;
END $$;

-- 4. Reforzar datos para evitar fallos en restricciones NOT NULL
-- Relleno para tipo_empleado
UPDATE public.empleados
SET tipo_empleado = COALESCE(NULLIF(BTRIM(tipo_empleado), ''), 'mesero');

-- Relleno para nombre_empleado (mencionado por el usuario)
UPDATE public.empleados
SET nombre_empleado = 'Empleado ' || id_empleado
WHERE nombre_empleado IS NULL OR BTRIM(nombre_empleado) = '';

-- Relleno para email (necesario para la restricción UNIQUE y NOT NULL)
UPDATE public.empleados
SET email = 'empleado-' || id_empleado || '@restaurante.local'
WHERE email IS NULL OR BTRIM(email) = '';

-- 5. Manejar duplicados de email antes de aplicar el UNIQUE
WITH emails_duplicados AS (
  SELECT
    id_empleado,
    ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY id_empleado) AS repeticion
  FROM public.empleados
)
UPDATE public.empleados AS e
SET email = 'empleado-' || e.id_empleado || '-dup@restaurante.local'
FROM emails_duplicados d
WHERE e.id_empleado = d.id_empleado
  AND d.repeticion > 1;

-- 6. Aplicar restricciones finales
ALTER TABLE public.empleados
  ALTER COLUMN nombre_empleado SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN tipo_empleado SET DEFAULT 'mesero'::text,
  ALTER COLUMN tipo_empleado SET NOT NULL;

-- Asegurar Primary Key
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'empleados_pkey' AND conrelid = 'public.empleados'::regclass) THEN
    ALTER TABLE public.empleados ADD CONSTRAINT empleados_pkey PRIMARY KEY (id_empleado);
  END IF;
END $$;

-- Asegurar Unique Email
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'empleados_email_key' AND conrelid = 'public.empleados'::regclass) THEN
    ALTER TABLE public.empleados ADD CONSTRAINT empleados_email_key UNIQUE (email);
  END IF;
END $$;

-- 7. Limpieza: Eliminar columnas legacy
ALTER TABLE public.empleados
  DROP COLUMN IF EXISTS nombre,
  DROP COLUMN IF EXISTS apellido,
  DROP COLUMN IF EXISTS pin_acceso,
  DROP COLUMN IF EXISTS fecha_creacion;
