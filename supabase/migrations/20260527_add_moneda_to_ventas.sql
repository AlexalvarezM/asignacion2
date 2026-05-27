-- =============================================
-- COLUMNA: moneda en la tabla ventas
-- =============================================

ALTER TABLE public.ventas ADD COLUMN IF NOT EXISTS moneda text NOT NULL DEFAULT 'cordoba';
