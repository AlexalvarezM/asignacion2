-- ============================================= 
-- TABLA DE CLIENTES
-- ============================================= 

DO $$
BEGIN
    -- Crear la tabla si no existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') THEN
        CREATE TABLE public.clientes (
          id_cliente bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
          nombre_cliente character varying,
          apellido_cliente character varying,
          celular character varying,
          CONSTRAINT clientes_pkey PRIMARY KEY (id_cliente)
        );
    ELSE
        -- Renombrar columna 'nombre' a 'nombre_cliente' si existe la vieja y no la nueva
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='nombre') 
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='nombre_cliente') THEN
            ALTER TABLE public.clientes RENAME COLUMN nombre TO nombre_cliente;
        END IF;

        -- Renombrar columna 'apellido' a 'apellido_cliente' si existe la vieja y no la nueva
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='apellido') 
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='apellido_cliente') THEN
            ALTER TABLE public.clientes RENAME COLUMN apellido TO apellido_cliente;
        END IF;

        -- Asegurar que existan las columnas solicitadas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='nombre_cliente') THEN
            ALTER TABLE public.clientes ADD COLUMN nombre_cliente character varying;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='apellido_cliente') THEN
            ALTER TABLE public.clientes ADD COLUMN apellido_cliente character varying;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='celular') THEN
            ALTER TABLE public.clientes ADD COLUMN celular character varying;
        END IF;
    END IF;
END $$;
