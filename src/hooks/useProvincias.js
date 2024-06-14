import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchProvincias = () => {
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get(`/api/getProvincias`);
        setProvincias(response.data.provincias || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvincias();
  }, []);

  return { provincias, loading, error };
};

export default useFetchProvincias;
