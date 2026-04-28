import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { supabase } from '../../database/supabaseconfig';
import logo from '../../assets/logo.png';

const Encabezado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const usuario = session?.user;

  return (
    <Navbar expand="lg" className="profe-navbar sticky-top" collapseOnSelect>
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center profe-brand">
          <img src={logo} alt="Discosa Logo" width="30" height="30" className="me-2" />
          <span>Discosa</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-0 shadow-none">
          <i className="bi bi-list text-white" style={{ fontSize: '1.5rem' }}></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center profe-links">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"} eventKey="1">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/categorias" active={location.pathname === "/categorias"} eventKey="2">Categorías</Nav.Link>
            <Nav.Link as={Link} to="/productos" active={location.pathname === "/productos"} eventKey="3">Productos</Nav.Link>
            <Nav.Link 
              as="span" 
              className="text-white opacity-50" 
              style={{ cursor: 'default' }}
            >
              Catálogo
            </Nav.Link>
            {usuario && (
              <Nav.Link 
                onClick={cerrarSesion} 
                className="ms-lg-3 d-flex align-items-center text-white opacity-75 hover-opacity-100"
                style={{ cursor: 'pointer' }}
                title="Cerrar Sesión"
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: '1.4rem' }}></i>
              </Nav.Link>
            )}
            {!usuario && (
              <Nav.Link as={Link} to="/login" className="ms-lg-3" eventKey="5">
                <i className="bi bi-person-circle me-1"></i> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
