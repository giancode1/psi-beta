// pages/MainTotalPao.js

import React, { useState, useEffect } from 'react';
import PaoFilterCard from '../../../components/shared/PaoFilterCard';
import useFetchStudentsPaosT from '../../../hooks/useStudentsPaoT';
import MatriculadosWithScrollTop from '../../../components/charts/MatriculadosTotal';
import { generateChartDataMatriculados } from '../../../utils/dataTotales';
import { withRoleProtection } from '../../../utils/auth';

export const getServerSideProps = withRoleProtection(['rectorado', 'ti']);

const MainTotalPao = () => {
    const { students, isLoading: isLoadingStudents, fetchStudents } = useFetchStudentsPaosT();
    const [selectedPaoId, setSelectedPaoId] = useState(null);
    const [chartData, setChartData] = useState({});
    const [totalregisteredStudents, setTotalregisteredStudents] = useState(0);
    const [totalregisteredStudentsFinal, setTotalregisteredStudentsFinal] = useState(0);
    const [totalretiredStudentsPeriod, settotalretiredStudentsPeriod] = useState(0);

    const handlePaoSelect = async (paoId) => {
        setSelectedPaoId(paoId);
        if (paoId) {
            await fetchStudents(paoId);
        }
    };

    useEffect(() => {
        if (students.length > 0) {
            const data = generateChartDataMatriculados(students);
            setChartData(data);

            const filteredStudents = students.filter(student => student.carrera !== 'FORMACION CONTINUA' && student.periodo !== "PERIDO DE PRUEBA");
            const totalregisteredStudents = filteredStudents.filter(student => student.matriculado).length;
            const totalretiredStudentsPeriod = filteredStudents.filter(student => student.retiradoperiodo).length;
            const totalregisteredStudentsFinal = totalregisteredStudents - totalretiredStudentsPeriod;

            setTotalregisteredStudents(totalregisteredStudents);
            settotalretiredStudentsPeriod(totalretiredStudentsPeriod);
            setTotalregisteredStudentsFinal(totalregisteredStudentsFinal);
        }
    }, [students]);

    return (
        <div className="grid p-fluid">
            <div className='col-12 xl:col-12'>
                <PaoFilterCard onPaoSelect={handlePaoSelect} />
            </div>
                <MatriculadosWithScrollTop 
                    chartData={chartData} 
                    totalregisteredStudents={totalregisteredStudents}
                    totalretiredStudentsPeriod={totalretiredStudentsPeriod}
                    totalregisteredStudentsFinal={totalregisteredStudentsFinal}
                />
        </div>
    );
};

export default MainTotalPao;
