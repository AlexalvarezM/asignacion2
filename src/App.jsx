import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Encabezado from './components/navegacion/Encabezado';
import RutaProtegida from './components/rutas/RutaProtegida';

// Vistas
import Inicio from './views/Inicio';
import Login from './views/Login';
import Productos from './views/Productos';
import Categorias from './views/Categorias';
import Catalogo from './views/Catalogo';
import Pagina404 from './views/Pagina404';

function App() {
  return (
    <Router>
      <Encabezado />   {/* Se muestra en todas las páginas */}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Rutas protegidas */}
        <Route element={<RutaProtegida />}>
          <Route path="/productos" element={<Productos />} />
          <Route path="/categorias" element={<Categorias />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}

export default App;