-- =============================================
-- COLUMNA: celular en la tabla empleados
-- =============================================

ALTER TABLE public.empleados ADD COLUMN IF NOT EXISTS celular character varying;
