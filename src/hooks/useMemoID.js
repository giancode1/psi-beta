// hooks/useMemoID.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const useMemoID = () => {
  const [maxNumeracion, setMaxNumeracion] = useState(null);

  const fetchMaxNumeracion = async () => {
    try {
      const response = await axios.get('/api/getMemoID');
      const data = response.data.data;

      const numeraciones = data.map(doc => parseInt(doc.numeracion, 10)).filter(Number.isFinite);
      if (numeraciones.length > 0) {
        const maxNum = Math.max(...numeraciones);
        setMaxNumeracion(maxNum);
        console.log('Max numeracion fetched:', maxNum); // Log the fetched max numeracion
      } else {
        setMaxNumeracion(0); // Set a default value if no valid numeracion is found
      }
    } catch (error) {
      console.error('Error fetching max numeracion:', error);
    }
  };

  useEffect(() => {
    fetchMaxNumeracion();
  }, []);

  return { maxNumeracion, fetchMaxNumeracion };
};

export default useMemoID;
