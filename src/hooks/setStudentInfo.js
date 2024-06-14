import axios from 'axios';
import Swal from 'sweetalert2';

const useUpdateStudent = () => {
  const updateStudent = async (formValues) => {
    console.log("Datos a enviar:", formValues);

    // Filtrar los valores vacíos para los campos específicos
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => {
        if (['telefonomovil', 'email', 'calleprincipal', 'callesecuendaria', 'numeroresidencia'].includes(key)) {
          return true;
        }
        return value !== '';
      })
    );

    console.log("Datos filtrados a enviar:", filteredFormValues);

    const { isConfirmed } = await Swal.fire({
      title: 'Confirmar actualización',
      text: "¿Estás seguro de que deseas actualizar los datos del estudiante?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      try {
        const response = await axios.post('/api/postEditar', filteredFormValues);
        Swal.fire('Éxito', 'Estudiante actualizado correctamente', 'success');
        return response.data;
      } catch (error) {
        Swal.fire('Error', 'Hubo un error al actualizar el estudiante', 'error');
        throw error;
      }
    }
  };

  return { updateStudent };
};

export default useUpdateStudent;
