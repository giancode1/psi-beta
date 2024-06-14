import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useFetchOpcionesRegistro = () => {
  const [opciones, setOpciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch('/api/getOpcionesRegistro');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error fetching opciones de registro');
        }
        const data = await response.json();
        if (!data.opciones) {
          throw new Error('No opciones data found');
        }
        setOpciones(data.opciones);
      } catch (error) {
        console.error('Error fetching opciones:', error);
        setError(error.toString());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.toString() || 'Ocurrió un error inesperado al obtener las opciones de registro.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpciones();
  }, []);

  return { opciones, isLoading, error };
};

export default useFetchOpcionesRegistro;
