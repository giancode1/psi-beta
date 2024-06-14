// pages/board/index.js

import React, { useState, useEffect, useRef } from "react";
import DateFilterCard from "../../../components/shared/DateFilterCard";
import { useFetchStudentsByDateRange } from "../../../hooks/useStudentsDate";
import { withRoleProtection } from "../../../utils/auth";
import General from "../../../components/charts/General";
import Inscritos from "../../../components/charts/Inscritos";
import Admitidos from "../../../components/charts/Admitidos";
import Matriculados from "../../../components/charts/Matriculados";
import { generateChartData } from "../../../utils/dataNuevos";
import { Button, Card } from "@nextui-org/react";

export const getServerSideProps = withRoleProtection(['rectorado' ,'ti']);

const MainNuevoFecha = () => {
  const { fetchStudents, loading, students } = useFetchStudentsByDateRange();
  const [chartData, setChartData] = useState({
    datoInscrito: [],
    genero: [],
    periodo: [],
    provincia: [],
    ciudad: [],
    carrera: [],
    inscritosPorProvincia: [],
    inscritosPorCiudad: [],
    inscritosPorGenero: [],
    inscritosPorCarrera: [],
    matriculadosPorProvincia: [],
    matriculadosPorCiudad: [],
    matriculadosPorGenero: [],
    matriculadosPorCarrera: [],
    admitidosPorProvincia: [],
    admitidosPorCiudad: [],
    admitidosPorGenero: [],
    admitidosPorCarrera: [],
  });
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);

  const generalRef = useRef(null);
  const inscritosRef = useRef(null);
  const admitidosRef = useRef(null);
  const matriculadosRef = useRef(null);

  const handleSearch = async () => {
    await fetchStudents(formattedStartDate, formattedEndDate);
  };

  useEffect(() => {
    if (students.length > 0) {
      const processedData = generateChartData(
        students,
        formattedStartDate,
        formattedEndDate
      );
      setChartData(processedData);
    }
  }, [students]);

  const scrollToSection = (sectionRef) => {
    const offset = 70; // Ajusta este valor según sea necesario
    const sectionPosition = sectionRef.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = sectionPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  return (
    <div className="grid p-fluid">
      <div className="col-12 xl:col-12">
        <DateFilterCard
          setFormattedStartDate={setFormattedStartDate}
          setFormattedEndDate={setFormattedEndDate}
          handleSearch={handleSearch}
          isLoading={loading}
        />
        <div className="mb-4 ml-2 space-x-4">
          <Button className="bg-[#0D4488] text-white " onClick={() => scrollToSection(inscritosRef)}>
            Inscritos
          </Button>
          <Button className="bg-[#0D4488] text-white " onClick={() => scrollToSection(admitidosRef)}>
            Admitidos
          </Button>
          <Button className="bg-[#0D4488] text-white " onClick={() => scrollToSection(matriculadosRef)}>
            Matriculados
          </Button>
        </div>
      </div>

      <div id="general" className="col-12 xl:col-12" ref={generalRef}>
        <General chartData={chartData} />
      </div>

      <div id="inscritos" className="col-12 xl:col-12" ref={inscritosRef}>
        <Inscritos chartData={chartData} />
      </div>

      <div id="admitidos" className="col-12 xl:col-12" ref={admitidosRef}>
        <Admitidos chartData={chartData} />
      </div>

      <div id="matriculados" className="col-12 xl:col-12" ref={matriculadosRef}>
        <Matriculados chartData={chartData} />
      </div>
    </div>
  );
};

export default MainNuevoFecha;
