import React from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@nextui-org/react';
import { FaDownload } from 'react-icons/fa6';

const MemoCards = ({ groupedData, type, codigo, setCodigo, handleDownloadAndUpload, removeCard }) => {
  return Object.keys(groupedData).map((key, index) => {
    const students = groupedData[key];
    const firstStudent = students[0];
    const total = students.length;
    const expedientes = students.map(d => d.identificador).join(', ');

    return (
      <Card key={index} className="mt-4 p-4 border rounded shadow flex flex-col justify-between">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-2">{`${type} - ${firstStudent.carrera} - ${firstStudent.periodo} - ${firstStudent.opcionregistro}`}</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Código"
            value={codigo}
            readOnly
            fullWidth
          />
          <Input
            label="Fecha"
            value={new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            readOnly
            fullWidth
          />
          <Input
            label="Carrera"
            value={firstStudent.carrera}
            readOnly
            fullWidth
          />
          <Input
            label="Periodo"
            value={firstStudent.periodo}
            readOnly
            fullWidth
          />
          <Input
            label="Opción de Registro"
            value={firstStudent.opcionregistro}
            readOnly
            fullWidth
          />
          <Input
            label="Total de Expedientes"
            value={total.toString()}
            readOnly
            fullWidth
          />
          <Input
            label="Identificadores de Expedientes"
            value={expedientes}
            readOnly
            fullWidth
          />
          <div className="flex justify-between gap-4">
            <Button
              onClick={async () => {
                const success = await handleDownloadAndUpload(type, key);
                if (success) {
                  removeCard(key, students.map(s => s.identificador)); // Eliminar la tarjeta y expedientes asociados
                }
              }}
              startContent={<FaDownload />}
              color='warning'
              className='mt-4 text-white font-semibold'
            >
              Descargar Memo {type}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  });
};

export default MemoCards;
