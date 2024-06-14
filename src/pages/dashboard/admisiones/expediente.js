import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useFetchStudentsByDateRange } from '../../../hooks/useStudentsDate';
import DateFilterCard from '../../../components/shared/DateFilterCard';
import FilterOptions from '../../../components/shared/FilterOptions';
import AnalistaDropdown from '../../../components/shared/Analista';
import MatriculaStatusDropdown from '../../../components/shared/Matricula';
import DocumentsForm from '../../../components/shared/DocumentsForm';
import EditForm from '../../../components/shared/EditForm';
import { withRoleProtection } from '../../../utils/auth';
import Swal from 'sweetalert2';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import {useUser} from '../../../context/UserContext'

export const getServerSideProps = withRoleProtection(['supervisor', 'analista', 'ti']);

export default function Expediente() {
  const {userRole} = useUser(); // Obtener el rol del usuario del contexto
  const { fetchStudents, loading, students } = useFetchStudentsByDateRange();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(new Map());
  const [selectAll, setSelectAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [carreraFilter, setCarreraFilter] = useState(new Set());
  const [periodoFilter, setPeriodoFilter] = useState(new Set());
  const [modalidadFilter, setModalidadFilter] = useState(new Set());
  const [analistaFilter, setAnalistaFilter] = useState(new Set());
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);
  const [page, setPage] = useState(1); // Asegura que la paginación comience en la página 1
  const rowsPerPage = 100;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const allStudentDetails = new Map(students.map(student => [student.id, student.identificador]));
    if (selectAll) {
      setSelectedStudents(new Set(allStudentDetails.keys()));
      setSelectedStudentDetails(allStudentDetails);
    } else {
      setSelectedStudents(new Set());
      setSelectedStudentDetails(new Map());
    }
  }, [selectAll, students]);

  useEffect(() => {
    const filtered = students.filter(student => {
      const matchesSearch = student.inscrito.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCarrera = carreraFilter.size === 0 || carreraFilter.has(student.carrera);
      const matchesPeriodo = periodoFilter.size === 0 || periodoFilter.has(student.periodo);
      const matchesModalidad = modalidadFilter.size === 0 || modalidadFilter.has(student.modalidad);
      const matchesAnalista = analistaFilter.size === 0 || analistaFilter.has(student.asesorprograma);
      return matchesSearch && matchesCarrera && matchesPeriodo && matchesModalidad && matchesAnalista;
    });
    setFilteredStudents(filtered);
  }, [students, searchValue, carreraFilter, periodoFilter, modalidadFilter, analistaFilter]);

  const handleSearch = () => {
    if (formattedStartDate && formattedEndDate) {
      fetchStudents(formattedStartDate, formattedEndDate);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Atención',
        text: 'Por favor, seleccione ambas fechas: inicio y fin.',
      });
    }
  };

  const handleSelectAll = () => {
    setSelectAll(prev => !prev);
  };

  const handleCheckboxChange = (studentId, identificador) => {
    const updatedSelection = new Set(selectedStudents);
    const updatedDetails = new Map(selectedStudentDetails);
    if (updatedSelection.has(studentId)) {
      updatedSelection.delete(studentId);
      updatedDetails.delete(studentId);
    } else {
      updatedSelection.add(studentId);
      updatedDetails.set(studentId, identificador);
    }
    setSelectedStudents(updatedSelection);
    setSelectedStudentDetails(updatedDetails);
    console.log("ID seleccionado:", studentId);
    console.log("Identificador seleccionado:", identificador);
    console.log("Todos los IDs seleccionados:", Array.from(updatedSelection));
    console.log("Todos los identificadores seleccionados:", Array.from(updatedDetails.entries()));
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

  const handleDocumentsClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="col-12 xl:col-12">
      <DateFilterCard
        setFormattedStartDate={setFormattedStartDate}
        setFormattedEndDate={setFormattedEndDate}
        handleSearch={handleSearch}
        isLoading={loading}
      />

      <Card className="flex flex-col items-center justify-center my-4 mr-4 p-4">
        <div className="flex justify-between w-full mb-4">
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
          />
          <div className="flex space-x-2 ml-2">
          {userRole === 'supervisor' && (
              <>
                <AnalistaDropdown studentIds={Array.from(selectedStudents)} />
                <MatriculaStatusDropdown studentIds={Array.from(selectedStudents)} />
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
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
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>PAO</TableColumn>
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>Modalidad</TableColumn>
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>Analista</TableColumn>
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>Habilitado<br />Matricula</TableColumn>
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>Expediente</TableColumn>
              <TableColumn className="text-center" style={{ textAlign: 'center' }}>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedItems.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>
                    <Input
                      className="h-10 w-10"
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleCheckboxChange(student.id, student.identificador)}
                    />
                  </TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.inscrito}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.carrera}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.periodo}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.modalidad}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.asesorprograma || 'S/A'}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.habilitadomatricula ? 'Si' : 'No'}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>{student.identificador || 'S/A'}</TableCell>
                  <TableCell className="text-center" style={{ textAlign: 'center' }}>
                    <Dropdown>
                      <DropdownTrigger>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <HiOutlineDotsVertical size={24} />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Acciones">
                        <DropdownItem key="documents" textValue="Añadir Documentos" onClick={() => handleDocumentsClick(student)} startContent={<IoDocumentTextOutline />} >
                          Documentos
                        </DropdownItem>
                        <DropdownItem key="edit" textValue="Editar Estudiante" onClick={() => handleEditClick(student)} startContent={<CiEdit />} >
                          Editar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page} // El valor del estado 'page' es 1 por defecto
            total={totalPages}
            onChange={(page) => setPage(page)}
            classNames={{
              item: 'cursor-pointer px-3 py-1 rounded-full', // Estilo básico para los ítems
              active: 'bg-blue-500 text-white', // Estilo para el ítem activo
            }}
          />
        </div>
        {loading && <div>Cargando estudiantes...</div>}
        {isModalOpen && selectedStudent && (
          <DocumentsForm studentId={selectedStudent.id} identificador={selectedStudent.identificador} onClose={handleCloseModal} />
        )}
        {isEditModalOpen && selectedStudent && (
          <EditForm student={selectedStudent} onClose={handleCloseEditModal} />
        )}
      </Card>
    </div>
  );
}
