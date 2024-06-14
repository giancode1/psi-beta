import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useFetchSesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const response = await fetch('/api/getSesiones');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error fetching sesiones');
        }
        const data = await response.json();
        if (!data.sesiones) {
          throw new Error('No sesiones data found');
        }
        setSesiones(data.sesiones);
      } catch (error) {
        console.error('Error fetching sesiones:', error);
        setError(error.toString());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.toString() || 'Ocurrió un error inesperado al obtener las sesiones.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSesiones();
  }, []);

  return { sesiones, isLoading, error };
};

export default useFetchSesiones;
