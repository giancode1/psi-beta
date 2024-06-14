// pages/index.js
import Login from './login/loginForm';
import { redirectToDashboard } from '../utils/auth';  // Asegúrate de que la ruta a la utilidad es correcta

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}

export async function getServerSideProps(context) {
  const result = redirectToDashboard(context);
  if (result) return result;
  
  return { props: {} }; // Continúa con la carga normal de la página si no hay redirección necesaria
}
