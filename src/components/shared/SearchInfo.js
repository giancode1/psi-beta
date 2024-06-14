import React from 'react';
import { Card, CardBody, Input, Button } from '@nextui-org/react';
import { FaPlus, FaMinus, FaDownload } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import Swal from 'sweetalert2';

const SearchInfo = ({ inputs, setInputs, loading, handleSearch, inputLabel, handleDownload, isDownloadDisabled, showDownloadButton = true }) => {
  const handleInputChange = (index, event) => {
    const values = [...inputs];
    values[index].value = event.target.value;
    setInputs(values);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { value: '' }]);
  };

  const handleRemoveInput = () => {
    if (inputs.length > 1) {
      setInputs(inputs.slice(0, -1));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Debe haber al menos un campo de ${inputLabel.toLowerCase()}.`,
      });
    }
  };

  return (
    <Card className="p-4 my-4">
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Button onClick={handleAddInput} startContent={<FaPlus />} color='success' className='text-white font-semibold'>
            Añadir
          </Button>
          <Button onClick={handleRemoveInput} startContent={<FaMinus />} color='danger' className='text-white font-semibold'>
            Quitar
          </Button>
          <Button onClick={handleSearch} disabled={loading} startContent={<IoSearch />} color='primary' className='font-semibold'>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
          {showDownloadButton && (
            <Button onClick={handleDownload} disabled={isDownloadDisabled} startContent={<FaDownload />} color='warning' className='text-white font-semibold'>
              Descargar
            </Button>
          )}
        </div>
        {inputs.map((input, index) => (
          <div key={index} className="flex flex-col space-y-4 mb-4">
            <Input
              label={`${inputLabel} (${index + 1})`}
              placeholder={`Ingrese un ${inputLabel.toLowerCase()}`}
              value={input.value}
              onChange={event => handleInputChange(index, event)}
              fullWidth
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default SearchInfo;
