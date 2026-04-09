import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificacionOperacion = ({ mostrar, mensaje, tipo, onCerrar }) => {
  const [visible, setVisible] = useState(mostrar);

  useEffect(() => {
    setVisible(mostrar);
  }, [mostrar]);

  const fechaLocal = () => {
    const f = new Date();
    return `${f.getHours()}:${String(f.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <ToastContainer position="top-end" className="p-4" style={{ zIndex: 9999 }}>
      <Toast
        onClose={() => {
          setVisible(false);
          onCerrar();
        }}
        show={visible}
        delay={4000}
        autohide
        className="border-0 shadow-xl overflow-hidden glass"
        style={{ borderRadius: '24px', minWidth: '320px' }}
      >
        <div className={`position-absolute top-0 start-0 h-100 w-2 bg-${tipo === 'exito' ? 'primary' : tipo === 'advertencia' ? 'warning' : 'accent'}`}></div>
        <Toast.Header className="bg-transparent border-0 px-4 pt-4">
          <div className={`bg-${tipo === 'exito' ? 'primary' : tipo === 'advertencia' ? 'warning' : 'accent'}-light text-${tipo === 'exito' ? 'primary' : tipo === 'advertencia' ? 'warning' : 'accent'} rounded-circle p-2 me-3 d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
            <i className={`bi bi-${tipo === 'exito' ? 'check2-circle' : tipo === 'advertencia' ? 'exclamation-triangle' : 'x-circle-fill'} fs-5`}></i>
          </div>
          <strong className="me-auto fw-extrabold text-main">{tipo === 'exito' ? 'ÉXITO' : tipo === 'advertencia' ? 'AVISO' : 'ERROR'}</strong>
          <small className="text-muted fw-bold">{fechaLocal()}</small>
        </Toast.Header>
        <Toast.Body className="px-4 pb-4 pt-2 text-muted fw-medium fs-6">
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default NotificacionOperacion;
