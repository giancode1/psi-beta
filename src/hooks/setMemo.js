import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useUploadMemo = () => {
  const [loading, setLoading] = useState(false);

  const confirmUpload = async (formData) => {
    setLoading(true);

    try {
      const response = await axios.post('/api/postMemo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Archivo subido al SGA correctamente.',
        });
        setLoading(false);
        return true;
      } else {
        throw new Error(response.data.msg || 'Error al subir el memo');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al subir el memo',
      });
      setLoading(false);
      return false;
    }
  };

  return { confirmUpload, loading };
};

export default useUploadMemo;
