// hooks/useStudentInfo.js
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useStudentInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudentInfo = async (identificacion, expedientes) => {
    setLoading(true);
    let allProfiles = [];

    const validateProfiles = (profiles, param) => {
      if (!profiles || profiles.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se encontraron perfiles con el ${param}.`,
        });
        setData(null);
        setLoading(false);
        return false;
      }

      if (profiles.length > 1) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Se encontró más de un perfil con el mismo ${param}.`,
        });
        setData(null);
        setLoading(false);
        return false;
      }

      return true;
    };

    try {
      if (identificacion) {
        const response = await axios.get(`/api/getInfo?identificacion=${identificacion}`);
        const profiles = response.data.info;

        if (!validateProfiles(profiles, `identificación ${identificacion}`)) return;
        allProfiles = profiles;
      } else if (expedientes) {
        const expedientesArray = expedientes.split(',');
        for (const expediente of expedientesArray) {
          const response = await axios.get(`/api/getInfo?expediente=${expediente.trim()}`);
          const profiles = response.data.info;

          if (!validateProfiles(profiles, `expediente ${expediente.trim()}`)) return;
          allProfiles = [...allProfiles, ...profiles];
        }
      }

      console.log('Data received from fetchStudentInfo:', allProfiles);
      setData(allProfiles);
    } catch (error) {
      console.error('Error fetching student info:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.msg || 'Error al recuperar los datos',
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetchStudentInfo };
};

export default useStudentInfo;
