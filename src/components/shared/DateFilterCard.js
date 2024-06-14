import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, DatePicker } from "@nextui-org/react";
import { IoIosSearch } from 'react-icons/io';

const DateFilterCard = ({ setFormattedStartDate, setFormattedEndDate, handleSearch}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    if (date && date.year && date.month && date.day) {
      const day = date.day.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const year = date.year.toString();
      const formattedDate = `${day}/${month}/${year}`;
      
      console.log("Fecha de inicio seleccionada:", date);
      console.log("Fecha de inicio formateada:", formattedDate);
      
      setStartDate(date);
      setFormattedStartDate(formattedDate);
    } else {
      console.error("Fecha de inicio inválida:", date);
    }
  };

  const handleEndDateChange = (date) => {
    if (date && date.year && date.month && date.day) {
      const day = date.day.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const year = date.year.toString();
      const formattedDate = `${day}/${month}/${year}`;
      
      console.log("Fecha de fin seleccionada:", date);
      console.log("Fecha de fin formateada:", formattedDate);
      
      setEndDate(date);
      setFormattedEndDate(formattedDate);
    } else {
      console.error("Fecha de fin inválida:", date);
    }
  };

  return (
    <Card className="my-4 mr-4 p-2">
      <CardHeader className='text-2xl font-bold text-gray-800'>
        Seleccione un Rango de Fecha
      </CardHeader>
      <CardBody>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <DatePicker
            label="Fecha de inicio"
            placeholder="Seleccione la fecha de inicio"
            value={startDate}
            onChange={handleStartDateChange}
            className="flex-1"
          />
          <DatePicker
            label="Fecha fin"
            placeholder="Seleccione la fecha de fin"
            value={endDate}
            onChange={handleEndDateChange}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            startContent={<IoIosSearch />}
            className="bg-[#0D4488] text-white font-semibold"
          >
            Buscar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DateFilterCard;
