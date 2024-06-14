import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function useUpdateLegalizado() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updateLegalizado = async (ide, estado) => {
    setIsLoading(true);
    setError(null);
    setResult(null);  // Resetear el resultado anterior

    if (!ide || !Array.isArray(ide) || ide.length === 0 || estado == null) {
      const errorMsg = "Datos de entrada no válidos. Asegúrese de que los IDs de estudiantes y el estado estén proporcionados.";
      setError(errorMsg);
      Swal.fire('Error!', errorMsg, 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/postLegalizado', { ide, estado });
      if (response.data && response.data.ok) {
        setResult(response.data);
        Swal.fire('Actualizado!', 'El estado de legalización ha sido actualizado correctamente.', 'success');
        setIsLoading(false);
      } else {
        throw new Error("Failed response from the API");
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.msg : error.message;
      setError(errorMsg || "An error occurred while updating the legalizado.");
      Swal.fire('Error!', errorMsg, 'error');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    result,
    updateLegalizado
  };
}

export default useUpdateLegalizado;
