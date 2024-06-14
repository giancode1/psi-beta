import React, { useState, useEffect } from 'react';
import useStudentInfo from '../../../hooks/useStudentInfo';
import useGenerateMemo from '../../../hooks/useGenerateMemo';
import useUploadMemo from '../../../hooks/setMemo';
import useMemoID from '../../../hooks/useMemoID';
import Swal from 'sweetalert2';
import { Card, CardHeader, Pagination } from '@nextui-org/react';
import SearchInfo from '../../../components/shared/SearchInfo';
import MemoCards from '../../../components/shared/MemoCards';
import { withRoleProtection } from '../../../utils/auth';

export const getServerSideProps = withRoleProtection(['supervisor', 'ti']);

const Memorando = () => {
  const [expedientes, setExpedientes] = useState([{ value: '' }]);
  const { data, loading: studentLoading, fetchStudentInfo } = useStudentInfo();
  const { generateMemo, loading: memoLoading, error } = useGenerateMemo();
  const { confirmUpload, loading: uploadLoading } = useUploadMemo();
  const { maxNumeracion, fetchMaxNumeracion } = useMemoID();
  const [groupedDataRegular, setGroupedDataRegular] = useState({});
  const [groupedDataHomologacion, setGroupedDataHomologacion] = useState({});
  const [groupedDataHunim, setGroupedDataHunim] = useState({});
  const [groupedDataMaestria, setGroupedDataMaestria] = useState({});
  const [groupedDataProblemas, setGroupedDataProblemas] = useState({});
  const [codigo, setCodigo] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (data) {
      const groupedRegular = {};
      const groupedHomologacion = {};
      const groupedHunim = {};
      const groupedMaestria = {};
      const groupedProblemas = {};

      data.forEach(student => {
        const key = `${student.carrera}-${student.periodo}-${student.opcionregistro}`;
        if (!student.opcionregistro) {
          if (!groupedProblemas[key]) {
            groupedProblemas[key] = [];
          }
          groupedProblemas[key].push(student);
          return;
        }
        switch (student.opcionregistro) {
          case 'REGULAR':
            if (!groupedRegular[key]) {
              groupedRegular[key] = [];
            }
            groupedRegular[key].push(student);
            break;
          case 'HOMOLOGACIÓN POR EJERCICIO PROFESIONAL (VALIDANDO)':
          case 'RECONOCIMIENTOS DE ESTUDIOS (VALIDANDO)':
          case 'HOMOLOGACIÓN POR VALIDACION DE CONOCIMIENTOS (VALIDANDO)':
            if (!groupedHomologacion[key]) {
              groupedHomologacion[key] = [];
            }
            groupedHomologacion[key].push(student);
            break;
          case 'HUNIM-INT-ISTE':
          case 'HUNIM-EX':
          case 'HUNIM-PRO':
            if (!groupedHunim[key]) {
              groupedHunim[key] = [];
            }
            groupedHunim[key].push(student);
            break;
          case 'MAESTRIA TECNOLÓGICA':
            if (!groupedMaestria[key]) {
              groupedMaestria[key] = [];
            }
            groupedMaestria[key].push(student);
            break;
          default:
            if (!groupedProblemas[key]) {
              groupedProblemas[key] = [];
            }
            groupedProblemas[key].push(student);
            break;
        }
      });

      setGroupedDataRegular(groupedRegular);
      setGroupedDataHomologacion(groupedHomologacion);
      setGroupedDataHunim(groupedHunim);
      setGroupedDataMaestria(groupedMaestria);
      setGroupedDataProblemas(groupedProblemas);

      console.log('Datos agrupados para documento Regular:', groupedRegular);
      console.log('Datos agrupados para documento Homologacion:', groupedHomologacion);
      console.log('Datos agrupados para documento HUNIM:', groupedHunim);
      console.log('Datos agrupados para documento Maestría:', groupedMaestria);
      console.log('Datos agrupados para documento con Problemas:', groupedProblemas);
    } else {
      setGroupedDataRegular({});
      setGroupedDataHomologacion({});
      setGroupedDataHunim({});
      setGroupedDataMaestria({});
      setGroupedDataProblemas({});
    }
  }, [data]);

  useEffect(() => {
    if (maxNumeracion !== null) {
      const nuevoCodigo = maxNumeracion + 1;
      setCodigo(nuevoCodigo);
      console.log('Nuevo código asignado:', nuevoCodigo);
    }
  }, [maxNumeracion]);

  const handleSearch = async () => {
    const validExpedientes = expedientes.filter(i => i.value.trim() !== '');
    if (validExpedientes.length > 0) {
      await fetchMaxNumeracion();
      fetchStudentInfo(null, validExpedientes.map(e => e.value).join(','));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar al menos un expediente para buscar.',
      });
    }
  };

  const handleDownloadAndUpload = async (type, key) => {
    if (!codigo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe ingresar un código.',
      });
      return;
    }

    const dataToDownload = (() => {
      switch (type) {
        case 'REGULAR':
          return groupedDataRegular[key];
        case 'HOMOLOGACION':
          return groupedDataHomologacion[key];
        case 'HUNIM':
          return groupedDataHunim[key];
        case 'MAESTRIA':
          return groupedDataMaestria[key];
        case 'PROBLEMAS':
          return groupedDataProblemas[key];
        default:
          return [];
      }
    })();

    if (dataToDownload && dataToDownload.length > 0) {
      try {
        Swal.fire({
          title: 'Generando Memorando',
          text: 'Por favor espere...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        });

        await generateMemo(dataToDownload, type, codigo);
        if (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al generar el documento',
          });
        } else {
          setTimeout(async () => {
            try {
              await confirmUpload({
                nombre: `Memorando ${codigo}`,
                fecha: new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }),
                numeracion: codigo,
              });
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Archivo subido al SGA correctamente.',
              });
              removeCard(key, dataToDownload.map(d => d.identificador)); // Eliminar la tarjeta después de la carga exitosa
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al subir el archivo al SGA.',
              });
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Error generating document:', error);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay datos disponibles para descargar.',
      });
    }
  };

  const removeCard = (key, expedientesToRemove) => {
    setGroupedDataRegular(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setGroupedDataHomologacion(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setGroupedDataHunim(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setGroupedDataMaestria(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
    setGroupedDataProblemas(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });

    setExpedientes(prevState => {
      const newExpedientes = prevState.filter(exp => !expedientesToRemove.includes(exp.value));
      return newExpedientes.length > 0 ? newExpedientes : [{ value: '' }];
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <SearchInfo
          inputs={expedientes}
          setInputs={setExpedientes}
          loading={studentLoading || memoLoading}
          handleSearch={handleSearch}
          inputLabel="Expediente"
          showDownloadButton={false}
        />
      </div>
      <div className="md:col-span-1 flex flex-col gap-4 mr-4">
        <Card className="mt-4 p-4 border rounded shadow flex flex-col justify-between">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-2">Datos para el Memo</h2>
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={5}
              onChange={(page) => setPage(page)}
              classNames={{
                item: 'cursor-pointer px-3 py-1 rounded-full',
                active: 'bg-blue-500 text-white',
              }}
            />
          </CardHeader>
        </Card>
        {page === 1 && <MemoCards groupedData={groupedDataRegular} type='REGULAR' codigo={codigo} setCodigo={setCodigo} handleDownloadAndUpload={handleDownloadAndUpload} removeCard={removeCard} />}
        {page === 2 && <MemoCards groupedData={groupedDataHomologacion} type='HOMOLOGACION' codigo={codigo} setCodigo={setCodigo} handleDownloadAndUpload={handleDownloadAndUpload} removeCard={removeCard} />}
        {page === 3 && <MemoCards groupedData={groupedDataHunim} type='HUNIM' codigo={codigo} setCodigo={setCodigo} handleDownloadAndUpload={handleDownloadAndUpload} removeCard={removeCard} />}
        {page === 4 && <MemoCards groupedData={groupedDataMaestria} type='MAESTRIA' codigo={codigo} setCodigo={setCodigo} handleDownloadAndUpload={handleDownloadAndUpload} removeCard={removeCard} />}
        {page === 5 && <MemoCards groupedData={groupedDataProblemas} type='PROBLEMAS' codigo={codigo} setCodigo={setCodigo} handleDownloadAndUpload={handleDownloadAndUpload} removeCard={removeCard} />}
      </div>
    </div>
  );
};

export default Memorando;
