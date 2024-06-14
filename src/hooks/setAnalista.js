import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useUpdateAnalista = () => {
    const [isLoading, setIsLoading] = useState(false);

    const updateAnalista = async (ide, idp) => {
        setIsLoading(true);

        if (!ide || !Array.isArray(ide) || ide.length === 0 || idp == null) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Datos de entrada no válidos. Asegúrese de que los IDs de estudiantes y el analista estén proporcionados.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/postAnalista', { ide, idp });

            if (response.data.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Los datos han sido actualizados correctamente.',
                });
            } else {
                throw new Error(response.data.msg || 'Error al actualizar los datos.');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || error.message || 'Error desconocido del servidor.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { updateAnalista, isLoading };
};

export default useUpdateAnalista;
