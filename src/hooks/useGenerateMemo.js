import { useState } from 'react';
import axios from 'axios';

const useGenerateMemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMemo = async (data, type, codigo) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/generateMemo', { data, type, codigo }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Memorando_${codigo}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error generating document', error);
      setError('Error generating document');
    } finally {
      setLoading(false);
    }
  };

  return { generateMemo, loading, error };
};

export default useGenerateMemo;
