import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Encabezado = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Paso 7: Manejo de sesión (versión recomendada sin warning)
  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = localStorage.getItem('usuario');
      if (sesion) {
        try {
          const usuarioParseado = JSON.parse(sesion);
          setUsuario(usuarioParseado);
        } catch (error) {
          console.error("Error al parsear usuario:", error);
          localStorage.removeItem('usuario');
        }
      }
    };

    cargarUsuario();
  }, []);   // Dependencia vacía

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  // Paso 8: Variable y condiciones para el menú
  const esAdmin = usuario?.rol === 'admin';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 30px',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #ddd'
    }}>
      <img 
        src={logo} 
        alt="Logo" 
        style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
      />

      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>

        {usuario ? (
          <>
            <Link to="/productos">Productos</Link>
            {esAdmin && <Link to="/categorias">Categorías</Link>}
            <button 
              onClick={cerrarSesion}
              style={{ 
                padding: '10px 18px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </nav>
    </header>
  );
};

export default Encabezado;