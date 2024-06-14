import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Divider } from '@nextui-org/react';
import Swal from 'sweetalert2';
import ISTE from '../../../../public/images/ISTE.png';
import Image from 'next/image';
import useStudentInfo from '../../../hooks/useStudentInfo';
import PDFGenerator from '../../../utils/generatePDF';
import { withRoleProtection } from '../../../utils/auth';
import SearchInfo from '../../../components/shared/SearchInfo';

export const getServerSideProps = withRoleProtection(['supervisor', 'analista', 'ti']);

const Etiquetas = () => {
  const [identificaciones, setIdentificaciones] = useState([{ value: '' }]);
  const { data, loading, fetchStudentInfo } = useStudentInfo();
  const [labelsData, setLabelsData] = useState([{ code: '', name: '' }]);
  const [showLabels, setShowLabels] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pdfRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      const profileCount = data.length;
      console.log(`Número de perfiles para la identificación ${identificaciones[currentIndex].value}: ${profileCount}`);

      const cedulas = data.map(profile => profile.cedula);
      const uniqueCedulas = new Set(cedulas);

      console.log(`Cédulas únicas: ${Array.from(uniqueCedulas)}`);
      console.log(`Número de cédulas únicas: ${uniqueCedulas.size}`);

      if (profileCount > 1) {
        const identificacionErronea = identificaciones[currentIndex].value;
        console.log(`Error: Se encontró más de un perfil con el mismo número de cédula: ${identificacionErronea}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Se encontró más de un perfil con el mismo número de cédula: ${identificacionErronea}.`,
        });
        return;
      }

      const newLabels = data.map(profile => ({
        code: profile.identificador || ' - ',
        name: profile.inscrito
      }));

      setLabelsData(prevLabelsData => {
        const updatedLabels = [...prevLabelsData];
        updatedLabels[currentIndex] = newLabels[0];
        return updatedLabels;
      });

      if (currentIndex < identificaciones.length - 1) {
        setCurrentIndex(currentIndex + 1);
        fetchStudentInfo(identificaciones[currentIndex + 1].value, null);
      } else {
        setShowLabels(true);
      }
    }
  }, [data]);

  const handleSearch = () => {
    const validIdentificaciones = identificaciones.filter(i => i.value.trim() !== '');
    if (validIdentificaciones.length > 0) {
      setLabelsData(Array(validIdentificaciones.length).fill({ code: '', name: '' }));
      setCurrentIndex(0);
      setShowLabels(false);
      fetchStudentInfo(validIdentificaciones[0].value, null);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar al menos una identificación para buscar.',
      });
    }
  };

  const handleDownload = () => {
    if (pdfRef.current) {
      pdfRef.current.generatePDF();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SearchInfo
        inputs={identificaciones} 
        setInputs={setIdentificaciones} 
        loading={loading} 
        handleSearch={handleSearch} 
        inputLabel="Cédula" 
        handleDownload={handleDownload}
        isDownloadDisabled={labelsData.length === 0}
      />
      <div className="grid grid-cols-1 gap-4">
        {labelsData.map((item, index) => (
          <Card key={index} className="p-4 my-4 mr-4">
            <CardBody>
              <div className="mb-4 border p-4">
                <div style={{ position: 'relative', border: '1px solid black', padding: '10px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Image src={ISTE} alt="Logo" width={200} height={50} />
                    <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '10px 0' }}>{item.code}</div>
                    <Divider style={{ width: '80%', height: '10px', backgroundColor: '#203764'}} />
                    <div style={{ fontSize: '2em', fontWeight: 'bold', alignItems:'center' }}>{item.name}</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <PDFGenerator ref={pdfRef} data={labelsData} />
      </div>
    </div>
  );
};

export default Etiquetas;
