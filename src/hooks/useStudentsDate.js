// useFetchStudentsByDateRange.js

import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const useFetchStudentsByDateRange = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const fetchStudents = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: 'info',
        title: 'Atención',
        text: 'Por favor, seleccione ambas fechas: inicio y fin.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/getStudentsByDateRange', {
        fechainicio: startDate,
        fechafin: endDate,
      });

      if (response.data.ok) {
        setStudents(response.data.students || []); // Asegúrate de que students sea siempre un arreglo
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos se cargaron correctamente',
        });
      } else {
        setStudents([]); // Si no hay datos válidos, usa un arreglo vacío
        throw new Error('La petición no devolvió datos válidos.');
      }
    } catch (error) {
      setStudents([]); // Si hay un error, usa un arreglo vacío
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.msg || error.message || 'Error al buscar estudiantes.',
      });
    } finally {
      setLoading(false);
    }
  };

  return { fetchStudents, loading, students };
};
