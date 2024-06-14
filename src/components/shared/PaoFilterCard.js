import React, { useState } from 'react';
import { Card, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, CardHeader, CardBody } from '@nextui-org/react';
import useFetchPaos from '../../hooks/usePaosList';
import { redirectToLogin } from '../../utils/auth';
import { IoIosSearch } from 'react-icons/io';
import Swal from 'sweetalert2';

export async function getServerSideProps(context) {
  const result = redirectToLogin(context);
  if (result) return result;
  return { props: {} };
}

const PaoFilterCard = ({ headerText, onPaoSelect }) => {
  const { paos, isLoading: isLoadingPaos, error: errorPaos } = useFetchPaos();
  const [selectedPao, setSelectedPao] = useState(null);

  const handleSelectionChange = (keys) => {
    const selectedKey = keys.values().next().value;
    const selectedPao = paos.find(pao => pao.id.toString() === selectedKey);
    setSelectedPao(selectedPao);
    console.log("Selected PAO ID:", selectedKey);
    // No llamar a onPaoSelect aquí, solo actualizar el estado
  };

  const handleSearchClick = () => {
    if (selectedPao && onPaoSelect) {
      onPaoSelect(selectedPao.id);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Atención',
        text: 'Por favor, seleccione un PAO antes de buscar.',
      });
    }
  };

  return (
    <Card className='flex flex-wrap my-4 mr-4 p-2'>
      <CardHeader className='text-2xl font-bold text-gray-800'>
        Seleccione un PAO Vigente
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap items-center space-x-4">
          <Dropdown>
            <DropdownTrigger>
              <Button flat disabled={isLoadingPaos} css={{ width: '100%' }} className='bg-white text-black shadow-lg border-gray-300 hover:bg-[#005BC4] hover:text-white hover:font-semibold' >
                {selectedPao ? selectedPao.nombre : "Seleccionar PAO"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="PAO Selector"
              selectionMode="single"
              selectedKeys={selectedPao ? [selectedPao.id.toString()] : []}
              onSelectionChange={(keys) => handleSelectionChange(keys)}
              className="max-h-60 overflow-y-auto"
            >
              {paos.map(pao => (
                <DropdownItem key={pao.id.toString()}>{pao.nombre}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <div>
            <Button onPress={handleSearchClick} disabled={!selectedPao} startContent={<IoIosSearch />} className='bg-[#0D4488] text-white font-semibold'>
              Buscar
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PaoFilterCard;
