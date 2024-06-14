import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination } from '@nextui-org/react';
import useFetchStudentsPaosT from '../../../hooks/useStudentsPaoT';
import PaoFilterCard from "../../../components/shared/PaoFilterCard";
import FilterOptions from '../../../components/shared/FilterOptions';
import { withRoleProtection } from '../../../utils/auth';
import Swal from 'sweetalert2';
import LegalizadoStatusDropdown from '../../../components/shared/Legalizado';

export const getServerSideProps = withRoleProtection(['supervisor', 'ti']);

export default function Legalizado() {
  const { students, isLoading: isLoadingStudents, fetchStudents } = useFetchStudentsPaosT();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(new Map());
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPaoId, setSelectedPaoId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 100;

  const [carreraFilter, setCarreraFilter] = useState(new Set());
  const [periodoFilter, setPeriodoFilter] = useState(new Set());
  const [modalidadFilter, setModalidadFilter] = useState(new Set());
  const [analistaFilter, setAnalistaFilter] = useState(new Set());

  useEffect(() => {
    if (students && students.length > 0) {
      const filtered = students.filter(student => {
        const matchesSearch = student.inscrito.toLowerCase().includes(searchValue.toLowerCase());
        const matchesCarrera = carreraFilter.size === 0 || carreraFilter.has(student.carrera);
        const matchesPeriodo = periodoFilter.size === 0 || periodoFilter.has(student.periodo);
        const matchesModalidad = modalidadFilter.size === 0 || modalidadFilter.has(student.modalidad);
        const matchesAnalista = analistaFilter.size === 0 || analistaFilter.has(student.asesorprograma);
        return matchesSearch && matchesCarrera && matchesPeriodo && matchesModalidad && matchesAnalista;
      });
      setFilteredStudents(filtered);
    }
  }, [students, searchValue, carreraFilter, periodoFilter, modalidadFilter, analistaFilter]);

  useEffect(() => {
    const allStudentDetails = new Map(students.map(student => [student.idmatricula, student]));
    if (selectAll) {
      setSelectedStudents(new Set(allStudentDetails.keys()));
      setSelectedStudentDetails(allStudentDetails);
      console.log("Detalles seleccionados:", Array.from(allStudentDetails.entries()));
    } else {
      setSelectedStudents(new Set());
      setSelectedStudentDetails(new Map());
      console.log("Detalles seleccionados:");
    }
  }, [selectAll, students]);

  const handlePaoSelect = async (paoId) => {
    setSelectedPaoId(paoId);
    if (paoId) {
      await fetchStudents(paoId);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Atención',
        text: 'Por favor, seleccione un PAO.',
      });
    }
  };

  const handleSelectAll = () => {
    setSelectAll(prev => !prev);
  };

  const handleCheckboxChange = (studentId, student) => {
    const updatedSelection = new Set(selectedStudents);
    const updatedDetails = new Map(selectedStudentDetails);
    if (updatedSelection.has(studentId)) {
      updatedSelection.delete(studentId);
      updatedDetails.delete(studentId);
    } else {
      updatedSelection.add(studentId);
      updatedDetails.set(studentId, student);
    }
    setSelectedStudents(updatedSelection);
    setSelectedStudentDetails(updatedDetails);
    console.log("ID matricula seleccionado:", studentId);
    console.log("Detalles seleccionados:", student);
    console.log("Todos los IDs seleccionados:", Array.from(updatedSelection));
    console.log("Todos los detalles seleccionados:", Array.from(updatedDetails.entries()));
  };

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudents.slice(start, end);
  }, [page, filteredStudents]);

  const uniqueCarreras = [...new Set(students.map(student => student.carrera))];
  const uniquePeriodos = [...new Set(students.map(student => student.periodo))];
  const uniqueModalidades = [...new Set(students.map(student => student.modalidad))];
  const uniqueAnalistas = [...new Set(students.map(student => student.asesorprograma))];

  return (
    <div className="col-12 xl:col-12">
      <PaoFilterCard onPaoSelect={handlePaoSelect} />
      <Card className="flex flex-col my-4 mr-4 p-4">
        <div className='flex justify-between w-full mb-4' >
        <FilterOptions
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          carreraFilter={carreraFilter}
          setCarreraFilter={setCarreraFilter}
          periodoFilter={periodoFilter}
          setPeriodoFilter={setPeriodoFilter}
          modalidadFilter={modalidadFilter}
          setModalidadFilter={setModalidadFilter}
          analistaFilter={analistaFilter}
          setAnalistaFilter={setAnalistaFilter}
          uniqueCarreras={uniqueCarreras}
          uniquePeriodos={uniquePeriodos}
          uniqueModalidades={uniqueModalidades}
          uniqueAnalistas={uniqueAnalistas}
          showPaoFilter={false}
        />
          <div className='flex space-x-2 ml-2'>
            <LegalizadoStatusDropdown studentIds={Array.from(selectedStudents)} selectedStudentDetails={selectedStudentDetails} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>
              {/*<Input
                className="h-10 w-10"
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />*/}
            </TableColumn>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>Nombre Completo</TableColumn>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>Carrera</TableColumn>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>Modalidad</TableColumn>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>Analista</TableColumn>
            <TableColumn className="text-center" style={{ textAlign: 'center' }}>Legalizado</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedItems.map(student => (
              <TableRow key={student.id}>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>
                  <Input
                    className="h-10 w-10"
                    type="checkbox"
                    checked={selectedStudents.has(student.idmatricula)}
                    onChange={() => handleCheckboxChange(student.idmatricula, student)}
                  />
                </TableCell>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.inscrito}</TableCell>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.carrera}</TableCell>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.modalidad}</TableCell>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.asesorprograma || 'S/A'}</TableCell>
                <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.legalizado ? 'Si' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            classNames={{
              item: 'cursor-pointer px-3 py-1 rounded-full', // Estilo básico para los ítems
              active: 'bg-blue-500 text-white', // Estilo para el ítem activo
            }}
          />
        </div>
        {isLoadingStudents && <div>Cargando estudiantes...</div>}
      </Card>
    </div>
  );
}
