import React, { useState, useEffect } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import DateFilterCard from "../../../components/shared/DateFilterCard";
import PaoFilterCard from "../../../components/shared/PaoFilterCard";
import { useFetchStudentsByDateRange } from "../../../hooks/useStudentsDate";
import useFetchStudentsPaosN from "../../../hooks/useStudentsPaoN";
import { generateAsesoresData } from "../../../utils/dataAsesores";
import { withRoleProtection } from "../../../utils/auth";

export const getServerSideProps = withRoleProtection(['rectorado','ti']);

const MarketingTable = () => {
  const { fetchStudents: fetchStudentsByDate, loading: loadingByDate, students: studentsByDate } = useFetchStudentsByDateRange();
  const { fetchStudents: fetchStudentsByPao, isLoading: loadingByPao, students: studentsByPao } = useFetchStudentsPaosN();

  const [asesoraDataByDate, setAsesoraDataByDate] = useState([]);
  const [totalesFechaByDate, setTotalesFechaByDate] = useState({});
  const [asesoraDataByPao, setAsesoraDataByPao] = useState([]);
  const [totalesFechaByPao, setTotalesFechaByPao] = useState({});
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);

  const [sortDescriptorByDate, setSortDescriptorByDate] = useState({
    column: null,
    direction: "ascending",
  });

  const [sortDescriptorByPao, setSortDescriptorByPao] = useState({
    column: null,
    direction: "ascending",
  });

  const handleSearchByDate = async () => {
    await fetchStudentsByDate(formattedStartDate, formattedEndDate);
  };

  const handlePaoSelect = async (paoId) => {
    await fetchStudentsByPao(paoId);
  };

  useEffect(() => {
    if (studentsByDate.length > 0) {
      const { estadisticasArray, totales } = generateAsesoresData(studentsByDate);
      setAsesoraDataByDate(estadisticasArray);
      setTotalesFechaByDate(totales);
    }
  }, [studentsByDate]);

  useEffect(() => {
    if (studentsByPao.length > 0) {
      const { estadisticasArray, totales } = generateAsesoresData(studentsByPao);
      setAsesoraDataByPao(estadisticasArray);
      setTotalesFechaByPao(totales);
    }
  }, [studentsByPao]);

  const sortedData = (data, sortDescriptor) => {
    if (!sortDescriptor.column) return data;
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  };

  const sortedAsesoraDataByDate = sortedData(asesoraDataByDate, sortDescriptorByDate);
  const sortedAsesoraDataByPao = sortedData(asesoraDataByPao, sortDescriptorByPao);

  const columns = [
    { key: "alias", label: "Nombre" },
    { key: "numeroRepetidos", label: "Inscritos" },
    { key: "validando", label: "Homologación" },
    { key: "salud", label: "Salud" },
    { key: "regular", label: "Regular" },
    { key: "maestria", label: "Maestrías" },
  ];

  return (
    <div className="grid p-fluid">
      <div className="col-12 xl:col-12">
        <DateFilterCard
          setFormattedStartDate={setFormattedStartDate}
          setFormattedEndDate={setFormattedEndDate}
          handleSearch={handleSearchByDate}
          isLoading={loadingByDate}
        />
      </div>

      <div className="col-12 xl:col-12 card">
        <Card className="p-4 mb-4 mr-4">
          <div className="w-full xl:w-auto mb-2 xl:col-6">
            <div>
              <p><strong>Total Inscritos:</strong> {totalesFechaByDate.inscritos}</p>
            </div>
            <div>
              <p><strong>Total Homologación:</strong> {totalesFechaByDate.homologacion}</p>
            </div>
            <div>
              <p><strong>Total Salud:</strong> {totalesFechaByDate.salud}</p>
            </div>
            <div>
              <p><strong>Total Regular:</strong> {totalesFechaByDate.regular}</p>
            </div>
            <div>
              <p><strong>Total Maestrías:</strong> {totalesFechaByDate.maestria}</p>
            </div>
          </div>
        </Card>
        <Table
          aria-label="Asesores de oferta académica"
          css={{ height: "auto", minWidth: "100%" }}
          sortDescriptor={sortDescriptorByDate}
          onSortChange={setSortDescriptorByDate}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} allowsSorting>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {sortedAsesoraDataByDate.map((asesor, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{asesor[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="col-12 xl:col-12 card">
        <PaoFilterCard headerText="Seleccione un PAO Vigente" onPaoSelect={handlePaoSelect} />
        <Card className="p-4 mb-4 mr-4">
          <div className="w-full xl:w-auto mb-2 xl:col-6">
            <div>
              <p><strong>Total Inscritos:</strong> {totalesFechaByPao.inscritos}</p>
            </div>
            <div>
              <p><strong>Total Homologación:</strong> {totalesFechaByPao.homologacion}</p>
            </div>
            <div>
              <p><strong>Total Salud:</strong> {totalesFechaByPao.salud}</p>
            </div>
            <div>
              <p><strong>Total Regular:</strong> {totalesFechaByPao.regular}</p>
            </div>
            <div>
              <p><strong>Total Maestrías:</strong> {totalesFechaByPao.maestria}</p>
            </div>
          </div>
        </Card>
        <Table
          aria-label="Asesores de oferta académica"
          css={{ height: "auto", minWidth: "100%" }}
          sortDescriptor={sortDescriptorByPao}
          onSortChange={setSortDescriptorByPao}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} allowsSorting>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {sortedAsesoraDataByPao.map((asesor, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{asesor[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarketingTable;
