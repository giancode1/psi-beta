import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useGetDocList = () => {
    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDocs = async () => {
        setIsLoading(true);
        setError('');

        try {
            console.log('Fetching documents list...');
            const response = await axios.get('/api/getDocList');

            if (response.data.ok) {
                setDocs(response.data.paos);
                console.log('Documents list fetched successfully:', response.data.paos);
            } else {
                throw new Error(response.data.msg || 'Error al obtener la lista de documentos.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg || error.message || 'Error desconocido del servidor.';
            setError(errorMessage);
            console.error('Error fetching documents list:', errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    return { docs, isLoading, error, fetchDocs };
};

export default useGetDocList;
