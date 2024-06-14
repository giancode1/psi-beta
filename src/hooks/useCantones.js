import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchCantones = (provinciaId) => {
  const [cantones, setCantones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (provinciaId) {
      const fetchCantones = async () => {
        try {
          const response = await axios.get(`/api/getCantones?id=${provinciaId}`);
          setCantones(response.data.cantones);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCantones();
    } else {
      setCantones([]);
      setLoading(false);
    }
  }, [provinciaId]);

  return { cantones, loading, error };
};

export default useFetchCantones;
