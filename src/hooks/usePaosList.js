import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';  // Asegúrate de tener SweetAlert2 instalado

const useFetchPaos = () => {
  const [paos, setPaos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initially true
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaos = async () => {
      try {
        const response = await fetch('/api/getPaos');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error fetching PAOs');
        }

        const data = await response.json();
        if (!data.paos) {
          throw new Error('No PAOs data found'); // Additional error check for data format
        }

        // Filtrar PAOs con matriculas, inscritos o retirados en 0
        const excludedPaos = data.paos.filter(pao => pao.matriculas === 0 || pao.inscritos === 0 || pao.retirados === 0);
        const filteredPaos = data.paos.filter(pao => pao.matriculas !== 0 && pao.inscritos !== 0 && pao.retirados !== 0);

        // Mostrar PAOs excluidos en la consola
        console.log("PAOs excluidos (con matriculas, inscritos o retirados en 0):", excludedPaos);

        setPaos(filteredPaos); // Establecer PAOs filtrados
      } catch (error) {
        console.error('Error fetching PAOs:', error);
        setError(error.toString());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.toString() || 'Ocurrió un error inesperado al obtener los PAOs.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaos();
  }, []);

  return { paos, isLoading, error };
};

export default useFetchPaos;
