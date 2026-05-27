-- =============================================
-- COLUMNA: precio_dolar en la tabla productos
-- =============================================

ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS precio_dolar real;
