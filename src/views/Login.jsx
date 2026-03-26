import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioLogin from '../components/login/FormularioLogin';
import { supabase } from '../database/supabaseconfig';

const Login = () => {
  const navigate = useNavigate();

  // Paso 7: useEffect para validar si ya hay sesión activa
  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/'); // Redirige al inicio si ya está logueado
      }
    });

    // Escuchar cambios de autenticación en tiempo real
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/'); // Redirige cuando se loguea correctamente
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="login-container">
      <FormularioLogin />
    </div>
  );
};

export default Login;