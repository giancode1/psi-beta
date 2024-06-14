// src/components/shared/TableOptions.js

import React from 'react';
import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";

const FilterOptions = ({
  searchValue,
  setSearchValue,
  carreraFilter,
  setCarreraFilter,
  periodoFilter,
  setPeriodoFilter,
  modalidadFilter,
  setModalidadFilter,
  analistaFilter,
  setAnalistaFilter,
  uniqueCarreras,
  uniquePeriodos,
  uniqueModalidades,
  uniqueAnalistas,
  showPaoFilter=true,
}) => {
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="flex justify-between w-full mb-4">
      <Input
        clearable
        underlined
        placeholder="Buscar por nombre"
        value={searchValue}
        onChange={handleSearchChange}
        startContent={<IoIosSearch />}
        className="flex-grow mr-4"
      />
      <div className="flex items-center space-x-4">
        <Dropdown>
          <DropdownTrigger>
            <Button flat endContent={<IoIosArrowDown />} className='bg-white text-black shadow-lg border-gray-300 hover:bg-[#005BC4] hover:text-white hover:font-semibold'>Carrera</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filtrar por Carrera"
            closeOnSelect={false}
            selectedKeys={carreraFilter}
            selectionMode="multiple"
            onSelectionChange={setCarreraFilter}
            className="max-h-48 overflow-y-auto"
          >
            {uniqueCarreras && uniqueCarreras.map(carrera => (
              <DropdownItem key={carrera}>{carrera}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {showPaoFilter && (
          <Dropdown>
            <DropdownTrigger>
              <Button flat endContent={<IoIosArrowDown />} className='bg-white text-black shadow-lg border-gray-300 hover:bg-[#005BC4] hover:text-white hover:font-semibold'>PAO</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por PAO"
              closeOnSelect={false}
              selectedKeys={periodoFilter}
              selectionMode="multiple"
              onSelectionChange={setPeriodoFilter}
              className="max-h-48 overflow-y-auto"
            >
              {uniquePeriodos && uniquePeriodos.map(periodo => (
                <DropdownItem key={periodo}>{periodo}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button flat endContent={<IoIosArrowDown />} className='bg-white text-black shadow-lg border-gray-300 hover:bg-[#005BC4] hover:text-white hover:font-semibold'>Modalidad</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filtrar por Modalidad"
            closeOnSelect={false}
            selectedKeys={modalidadFilter}
            selectionMode="multiple"
            onSelectionChange={setModalidadFilter}
            className="max-h-48 overflow-y-auto"
          >
            {uniqueModalidades && uniqueModalidades.map(modalidad => (
              <DropdownItem key={modalidad}>{modalidad}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button flat endContent={<IoIosArrowDown />} className='bg-white text-black shadow-lg border-gray-300 hover:bg-[#005BC4] hover:text-white hover:font-semibold'>Analista</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filtrar por Analista"
            closeOnSelect={false}
            selectedKeys={analistaFilter}
            selectionMode="multiple"
            onSelectionChange={setAnalistaFilter}
            className="max-h-48 overflow-y-auto"
          >
            {uniqueAnalistas && uniqueAnalistas.map(analista => (
              <DropdownItem key={analista}>{analista ? analista : 'S/A'}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default FilterOptions;
