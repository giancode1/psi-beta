import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';  // Asegúrate de tener SweetAlert2 instalado

const useFetchStudentsPaosN = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStudents = async (selectedPaoId) => {
        if (!selectedPaoId) {
            Swal.fire({
                icon: 'info',
                title: 'Atención',
                text: 'Periodo no especificado.',
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get('/api/getStudentsPaoN', {
                params: { periodo: selectedPaoId },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.ok) {
                setStudents(response.data.students);
                console.log("La API para obtener estudiantes nuevos por PAO ha sido ejecutada exitosamente en el cliente.");
                // Opcional: Añadir confirmación de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Estudiantes cargados correctamente.',
                });
            } else {
                throw new Error(response.data.msg || 'Error al obtener los estudiantes.');
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || error.message || 'Error desconocido del servidor',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { students, isLoading, fetchStudents };
};

export default useFetchStudentsPaosN;
