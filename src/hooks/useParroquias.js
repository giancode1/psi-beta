import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchParroquias = (cantonId) => {
  const [parroquias, setParroquias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParroquias = async () => {
      if (cantonId) {
        try {
          const response = await axios.get(`/api/getParroquias?id=${cantonId}`);
          setParroquias(response.data.parroquias || []);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        setParroquias([]);
        setLoading(false);
      }
    };

    fetchParroquias();
  }, [cantonId]);

  return { parroquias, loading, error };
};

export default useFetchParroquias;
