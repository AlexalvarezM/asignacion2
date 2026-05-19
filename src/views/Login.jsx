import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import FormularioLogin from "../components/login/FormularioLogin"; 
import AnoAI from "../components/login/AnoAI";
import { useAuth } from "../context/AuthContext"; 

const Login = () => { 
  const [usuario, setUsuario] = useState(""); 
  const [contrasena, setContrasena] = useState(""); 
  const [error, setError] = useState(null); 
  const [cargando, setCargando] = useState(false); 

  const navegar = useNavigate(); 
  const { login } = useAuth(); 

  const iniciarSesion = async () => { 
    if (!usuario || !contrasena) { 
      setError("Por favor ingresa usuario y contraseña"); 
      return; 
    } 

    setCargando(true); 
    setError(null); 

    try { 
      await login(usuario, contrasena); 
      navegar("/"); 
    } catch (err) { 
      console.error(err); 
      if (err.message === "Invalid login credentials") {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally { 
      setCargando(false); 
    } 
  }; 

  useEffect(() => { 
    const usuarioGuardado = localStorage.getItem("usuario-supabase"); 
    if (usuarioGuardado) { 
      navegar("/"); 
    } 
  }, [navegar]); 

  const estiloContenedor = { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    overflow: "hidden", 
    padding: "20px", 
  }; 

  return ( 
    <div style={estiloContenedor}> 
      <AnoAI />
      <div style={{ position: "relative", zIndex: 1 }}>
        <FormularioLogin 
          usuario={usuario} 
          contrasena={contrasena} 
          error={error} 
          setUsuario={setUsuario} 
          setContrasena={setContrasena} 
          iniciarSesion={iniciarSesion} 
          cargando={cargando} 
        /> 
      </div>
    </div> 
  ); 
}; 

export default Login; 
