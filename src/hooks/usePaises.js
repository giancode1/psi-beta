import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchPaises = () => {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await axios.get('/api/getPaises');
        setPaises(response.data.paises);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaises();
  }, []);

  return { paises, loading, error };
};

export default useFetchPaises;
