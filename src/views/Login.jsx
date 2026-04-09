import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormularioLogin from '../components/login/FormularioLogin';
import { supabase } from '../database/supabaseconfig';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/'); 
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/'); 
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 76px)' }}>
      <FormularioLogin />
    </Container>
  );
};

export default Login;
