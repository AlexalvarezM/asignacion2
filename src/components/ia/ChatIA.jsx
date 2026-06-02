import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../database/supabaseconfig';
import './ChatIA.css';

const ChatIA = ({ mostrar, onCerrar }) => {
  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const finChatRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const contextoBaseDatos = `
  Sistema de ventas. 
  Tablas disponibles:
  - categorias (id_categoria, nombre_categoria, descripcion_categoria)
  - clientes (id_cliente, nombre_cliente, apellido_cliente, celular)
  - productos (id_producto, nombre_producto, descripcion_producto, categoria_producto, precio_venta, url_imagen)
  - ventas (id_venta, id_cliente, id_empleado, fecha_venta, metodo_pago, total)
  - detalles_ventas (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal)
  - empleados (id_empleado, nombre_empleado, apellido_empleado, email, celular, tipo_empleado)
  `;

  const enviarConsulta = async (consultaDirecta) => {
    const consultaActual = typeof consultaDirecta === 'string' ? consultaDirecta : entrada;
    if (!consultaActual.trim()) return;

    const mensajeUsuario = { tipo: 'usuario', contenido: consultaActual };
    setMensajes(prev => [...prev, mensajeUsuario]);
    setEntrada('');
    setCargando(true);

    try {
      const modelo = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      Eres un experto en PostgreSQL. Genera una consulta SQL válida.
      ${contextoBaseDatos}

      Reglas estrictas:
      - Comprende el lenguaje natural del usuario y corrige errores de redacción o gramática.
      - Solo devuelve consultas SELECT.
      - NO uses punto y coma (;) al final.
      - NO uses markdown, ni sql, ni explicaciones fuera del JSON.
      - Usa alias claros cuando hagas JOIN.
      - Devuelve SOLO el siguiente JSON, nada más:

      {
        "explicacion": "Explicación breve y clara",
        "consulta_sql": "SELECT ...",
        "columnas": ["columna1", "columna2"]
      }

      Consulta del usuario: "${consultaActual}"
      `;

      const resultado = await modelo.generateContent(prompt);
      const textoRaw = resultado.response.text().trim();

      // Extrae directamente el bloque de llaves JSON del texto devuelto por la IA
      const match = textoRaw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No se pudo extraer JSON de la IA");

      const respuestaIA = JSON.parse(match[0]);

      let sqlLimpio = respuestaIA.consulta_sql.trim();

      // Limpieza caracteres que puedan causar errores comunes
      sqlLimpio = sqlLimpio.replace(/;\s*$/, '');
      sqlLimpio = sqlLimpio.replace(/\)\s*\)/g, ')');
      sqlLimpio = sqlLimpio.replace(/,\s*\)/g, ')');

      const { data, error } = await supabase.rpc('ejecutar_consulta_segura', {
        query_sql: sqlLimpio
      });

      if (error) {
        console.error("Error Supabase:", error);
        throw new Error(`Error en SQL: ${error.message}`);
      }

      const datosExtraidos = data ? data.map(item => item.datos) : [];

      const mensajeRespuesta = {
        tipo: 'ia',
        explicacion: respuestaIA.explicacion || "Consulta ejecutada correctamente",
        columnas: datosExtraidos.length > 0 ? Object.keys(datosExtraidos[0]) : (respuestaIA.columnas || []),
        datos: datosExtraidos
      };

      setMensajes(prev => [...prev, mensajeRespuesta]);

    } catch (error) {
      console.error("Error completo:", error);
      setMensajes(prev => [...prev, {
        tipo: 'ia',
        explicacion: "No entendí bien tu consulta. Por favor, reformúlala de forma clara.",
        error: true
      }]);
    }

    setCargando(false);
  };

  const formatearValor = (valor, columna) => {
    const colLower = columna.toLowerCase();
    const esDinero = colLower.includes('total') || colLower.includes('precio') || colLower.includes('monto') || colLower.includes('subtotal') || colLower.includes('venta') || colLower.includes('facturado') || colLower.includes('comprado');
    const esConteo = colLower.includes('cantidad') || colLower.includes('suma') || colLower.includes('count') || colLower.includes('conteo') || colLower.includes('numero') || colLower.includes('número');

    if (valor === null || valor === undefined) {
      if (esDinero) return '$0.00';
      if (esConteo) return '0';
      return '-';
    }

    // Si es un número (o string numérico válido)
    if (typeof valor === 'number' || (typeof valor === 'string' && valor.trim() !== '' && !isNaN(Number(valor)))) {
      const num = Number(valor);
      if (esDinero) {
        return `$${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      if (esConteo) {
        return num.toLocaleString('es-ES', { maximumFractionDigits: 0 });
      }
      return num.toString();
    }

    return String(valor);
  };

  useEffect(() => {
    finChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  return (
    <Modal 
      show={mostrar} 
      onHide={onCerrar} 
      centered 
      backdropClassName="custom-chat-backdrop" 
      dialogClassName="custom-chat-dialog"
      backdrop="static"
    >
      {/* Cabecera superior personalizada */}
      <div className="custom-chat-header">
        <h3 className="custom-chat-title">Consultas Inteligentes</h3>
        <button className="custom-chat-close-btn" onClick={onCerrar} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="d-flex flex-column h-100">
        {/* Contenedor principal de mensajes */}
        <div className="custom-chat-messages-scroll pe-1">
          {mensajes.length === 0 && (
            <div className="custom-chat-welcome">
              <h4>¿Qué información necesitas?</h4>
              <p>Ejemplos:</p>
              
              <div className="custom-chat-suggestions">
                <button 
                  className="suggestion-pill-btn pill-btn-1" 
                  onClick={() => enviarConsulta('Ventas totales de este mes')}
                  disabled={cargando}
                >
                  <span className="pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </span>
                  Ventas totales de este mes
                </button>

                <button 
                  className="suggestion-pill-btn pill-btn-2" 
                  onClick={() => enviarConsulta('Los 10 productos más vendidos')}
                  disabled={cargando}
                >
                  <span className="pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6V9Z" />
                      <path d="M18 9H19.5a2.5 2.5 0 0 0 0-5H18V9Z" />
                      <path d="M12 22V17" />
                      <path d="M12 17C14.7614 17 17 14.7614 17 12V3H7V12C7 14.7614 9.23858 17 12 17Z" />
                      <path d="M8 22H16" />
                    </svg>
                  </span>
                  Los 10 productos más vendidos
                </button>

                <button 
                  className="suggestion-pill-btn pill-btn-3" 
                  onClick={() => enviarConsulta('Clientes que más han comprado')}
                  disabled={cargando}
                >
                  <span className="pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  Clientes que más han comprado
                </button>

                <button 
                  className="suggestion-pill-btn pill-btn-4" 
                  onClick={() => enviarConsulta('Ventas por empleado')}
                  disabled={cargando}
                >
                  <span className="pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 21v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2" />
                      <circle cx="8.5" cy="7" r="3" />
                      <path d="M18 16V10" />
                      <path d="M21 16V6" />
                      <path d="M18 16h4" />
                    </svg>
                  </span>
                  Ventas por empleado
                </button>
              </div>
            </div>
          )}

          {mensajes.map((msg, index) => (
            <div key={index} className={`msg-bubble ${msg.tipo === 'usuario' ? 'msg-bubble-user' : 'msg-bubble-ia'}`}>
              <div className={msg.tipo === 'usuario' ? 'msg-header-user' : 'msg-header-ia'}>
                {msg.tipo === 'usuario' ? (
                  'Tú'
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Asistente IA
                  </>
                )}
              </div>
              
              <div className="msg-content">
                {msg.tipo === 'usuario' ? (
                  <p className="mb-0">{msg.contenido}</p>
                ) : (
                  <p className="mb-0">{msg.explicacion}</p>
                )}
              </div>

              {msg.datos && msg.datos.length > 0 && (
                <div className="custom-table-wrapper">
                  <table className="custom-results-table">
                    <thead>
                      <tr>
                        {msg.columnas.map((col, i) => (
                          <th key={i}>{col.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.datos.map((fila, i) => (
                        <tr key={i}>
                          {msg.columnas.map((col, j) => (
                            <td key={j}>{formatearValor(fila[col], col)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {cargando && (
            <div className="custom-loading-spinner">
              <Spinner animation="border" size="sm" /> Procesando consulta...
            </div>
          )}
          <div ref={finChatRef} />
        </div>

        {/* Formulario de entrada inferior */}
        <div className="custom-chat-footer">
          <Form onSubmit={(e) => { e.preventDefault(); enviarConsulta(); }}>
            <div className="custom-input-group">
              <div className="custom-input-wrapper">
                <Form.Control
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  placeholder="Escribe tu consulta en lenguaje natural..."
                  disabled={cargando}
                  className="custom-chat-input"
                />
                <span className="ai-input-badge">IA</span>
              </div>
              <Button 
                onClick={() => enviarConsulta()} 
                disabled={cargando || !entrada.trim()}
                className="custom-send-btn"
              >
                Enviar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ChatIA;
