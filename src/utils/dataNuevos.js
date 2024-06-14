// utils/chartDataGenerator.js

export const formatDate = (inputDate) => {
  const dateObj = new Date(inputDate);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const groupByDataType = (valueKey, datos) => {
  const resultado = {};
  for (const dato of datos) {
    const asesorprograma = dato[valueKey];
    const carrera = dato['carrera'];
    if (carrera === 'FORMACION CONTINUA') continue;
    if (!resultado[asesorprograma]) resultado[asesorprograma] = 1;
    else resultado[asesorprograma]++;
  }

  const labelVoid = valueKey === "genero" ? "NA" : "INSCRITO POR TI";
  const resultadoFinal = Object.entries(resultado).map(([asesorprograma, numero]) => ({
    asesorprograma: !!asesorprograma ? asesorprograma : labelVoid,
    numero
  }));

  resultadoFinal.sort((a, b) => b.numero - a.numero);
  return resultadoFinal;
};

const setGroupDataVariables = (inscribedStudents, admittedStudents, registeredStudents, outsideProcessStudents) => {
  return {
    prospectoPorProvincia: groupByDataType('provinciares', inscribedStudents),
    matriculadoPorProvincia: groupByDataType('provinciares', registeredStudents),
    admitidoPorProvincia: groupByDataType('provinciares', admittedStudents),
    fueraDeProcesoPorProvincia: groupByDataType('provinciares', outsideProcessStudents),
    prospectoPorCiudad: groupByDataType('cantones', inscribedStudents),
    matriculadoPorCiudad: groupByDataType('cantones', registeredStudents),
    admitidoPorCiudad: groupByDataType('cantones', admittedStudents),
    fueraDeProcesoPorCiudad: groupByDataType('cantones', outsideProcessStudents),
    prospectoPorGenero: groupByDataType('genero', inscribedStudents),
    matriculadoPorGenero: groupByDataType('genero', registeredStudents),
    admitidoPorGenero: groupByDataType('genero', admittedStudents),
    fueraDeProcesoPorGenero: groupByDataType('genero', outsideProcessStudents),
    prospectoPorCarrera: groupByDataType('carrera', inscribedStudents),
    matriculadoPorCarrera: groupByDataType('carrera', registeredStudents),
    admitidoPorCarrera: groupByDataType('carrera', admittedStudents),
    fueraDeProcesoPorCarrera: groupByDataType('carrera', outsideProcessStudents),
  };
};

export const generateChartData = (students, calendarInitValue, calendarFinalValue, selectedPeriod = "TODOS") => {
  const fechainicio = formatDate(calendarInitValue);
  const fechafin = formatDate(calendarFinalValue);

  let filteredStudents = students.filter(student => 
    student.carrera !== 'FORMACION CONTINUA' && student.periodo !== "PERIDO DE PRUEBA"
  );

  if (selectedPeriod !== "TODOS") {
    filteredStudents = filteredStudents.filter(student => student.periodo === selectedPeriod);
  }

  const inscribedStudents = filteredStudents.filter(student => !student.matriculado && !student.habilitadomatricula);
  const admittedStudents = filteredStudents.filter(student => !student.matriculado && student.habilitadomatricula);
  const registeredStudents = filteredStudents.filter(student => student.matriculado && student.habilitadomatricula);
  const outsideProcessStudents = filteredStudents.filter(student => student.matriculado && !student.habilitadomatricula);

  const chartData = {
    datoInscrito: [
      { total: inscribedStudents.length, label: 'Inscrito' },
      { total: admittedStudents.length, label: 'Admitido' },
      { total: registeredStudents.length, label: 'Matriculado' },
      { total: outsideProcessStudents.length, label: 'Fuera del proceso' }
    ],
    periodo: groupByDataType('periodo', filteredStudents),
    provincia: groupByDataType('provinciares', filteredStudents),
    ciudad: groupByDataType('cantones', filteredStudents),
    genero: groupByDataType('genero', filteredStudents),
    carrera: groupByDataType('carrera', filteredStudents),
    matriculado: groupByDataType('matriculado', filteredStudents),
    ...setGroupDataVariables(inscribedStudents, admittedStudents, registeredStudents, outsideProcessStudents),
    inscritosPorProvincia: groupByDataType('provinciares', inscribedStudents),
    inscritosPorCiudad: groupByDataType('cantones', inscribedStudents),
    inscritosPorGenero: groupByDataType('genero', inscribedStudents),
    inscritosPorCarrera: groupByDataType('carrera', inscribedStudents),
    matriculadosPorProvincia: groupByDataType('provinciares', registeredStudents),
    matriculadosPorCiudad: groupByDataType('cantones', registeredStudents),
    matriculadosPorGenero: groupByDataType('genero', registeredStudents),
    matriculadosPorCarrera: groupByDataType('carrera', registeredStudents),
    admitidosPorProvincia: groupByDataType('provinciares', admittedStudents),
    admitidosPorCiudad: groupByDataType('cantones', admittedStudents),
    admitidosPorGenero: groupByDataType('genero', admittedStudents),
    admitidosPorCarrera: groupByDataType('carrera', admittedStudents),
  };

  return chartData;
};
