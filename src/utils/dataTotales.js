// utils/dataGeneratorMatriculados.js

const groupByDataType = (valueKey, datos) => {
    const resultado = {};
    for (const dato of datos) {
        const key = dato[valueKey];
        const carrera = dato['carrera'];
        if (carrera === 'FORMACION CONTINUA') continue;
        if (!resultado[key]) resultado[key] = 1;
        else resultado[key]++;
    }

    const labelVoid = valueKey === "genero" ? "NA" : "INSCRITO POR TI";
    const resultadoFinal = Object.entries(resultado).map(([key, numero]) => ({
        asesorprograma: key || labelVoid,
        numero
    }));

    resultadoFinal.sort((a, b) => b.numero - a.numero);
    return resultadoFinal;
};

export const generateChartDataMatriculados = (students) => {
    const filteredStudents = students.filter(student => student.carrera !== 'FORMACION CONTINUA' && student.periodo !== "PERIDO DE PRUEBA");

    const inscribedStudents = filteredStudents.filter(student => !student.matriculado && !student.habilitadomatricula);
    const admittedStudents = filteredStudents.filter(student => !student.matriculado && student.habilitadomatricula);
    const registeredStudents = filteredStudents.filter(student => student.matriculado && !student.retiradoperiodo);

    return {
        matriculadoPorProvincia: groupByDataType('provinciares', registeredStudents),
        matriculadoPorCiudad: groupByDataType('cantones', registeredStudents),
        matriculadoPorGenero: groupByDataType('genero', registeredStudents),
        matriculadoPorCarrera: groupByDataType('carrera', registeredStudents),
    };
};
