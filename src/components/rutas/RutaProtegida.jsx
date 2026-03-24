import { Navigate, Outlet } from 'react-router-dom';

const RutaProtegida = () => {
  const token = localStorage.getItem('usuario'); // o usa Supabase

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default RutaProtegida;