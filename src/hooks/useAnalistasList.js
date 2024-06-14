import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';  // Asegúrate de tener SweetAlert2 instalado

const useFetchAnalistas = () => {
    const [analista, setAnalista] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalistas = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/getAnalistas');

                if (!response.data || !response.data.analista) {
                    throw new Error('No se recibieron datos válidos desde la API');
                }
    
                // Asumiendo que 'analista' es un array en la respuesta
                const data = response.data.analista.map(item => ({
                    id: item.id,  // Asume que cada 'item' tiene un 'id'
                    nombreCompleto: `${item.nombres} ${item.apellido1} ${item.apellido2}`  // Formato del nombre completo
                }));

                console.log('Processed data:', data); // Opcional, muestra la data procesada por consola
                setAnalista(data);
            } catch (error) {
                console.error("Error fetching analistas:", error);
                setError(error.message);  // Establece el mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message || 'Ocurrió un error inesperado al obtener los analistas.'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalistas();
    }, []);

    return { analista, isLoading, error };
};

export default useFetchAnalistas;
