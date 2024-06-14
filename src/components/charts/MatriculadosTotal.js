// components/charts/MatriculadosWithScrollTop.js

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ScrollTop } from 'primereact/scrolltop';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const BAR_COLOR = "#326fd1";
const HEADER_MATRICULADOS = "Cantidad de Matriculados";

const xAxisTickProps = {
    angle: -40,
    textAnchor: "end",
    verticalAnchor: "end",
    dy: 5,
    fontSize: 12,
};

const axisLineStyle = {
    stroke: "#666",
    strokeWidth: 2,
};

const tickLineStyle = {
    stroke: "#ccc",
    strokeWidth: 1,
};

const renderLabel = (data, value, { cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#5B5B5B"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={value}
            fontWeight="bold"
        >
            {`${data[index].asesorprograma}: ${data[index].numero}`}
        </text>
    );
};

const MatriculadosWithScrollTop = ({ chartData, totalregisteredStudents, totalretiredStudentsPeriod, totalregisteredStudentsFinal }) => {
    const {
        matriculadoPorProvincia = [],
        matriculadoPorCiudad = [],
        matriculadoPorGenero = [],
        matriculadoPorCarrera = [],
    } = chartData;

    const [visibleDetails, setVisibleDetails] = useState({
        provincia: false,
        ciudad: false,
        carrera: false
    });

    const toggleVisibility = (section) => {
        setVisibleDetails(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    return (
        <div className="grid p-fluid">
            <Card className='p-4 mb-4 mr-4'>
                <div className="w-full xl:w-auto mb-2 xl:col-6">
                    <div>
                        <p><strong>Total de estudiantes:</strong> {totalregisteredStudents}</p>
                    </div>
                    <div>
                        <p><strong>Total de estudiantes retirados:</strong> {totalretiredStudentsPeriod}</p>
                    </div>
                    <div>
                        <p><strong>Total de estudiantes matriculados:</strong> {totalregisteredStudentsFinal}</p>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1">
                    <Card className="flex flex-wrap mr-4">
                        <CardHeader className="text-lg font-bold ml-2">
                            {HEADER_MATRICULADOS} por Provincia
                        </CardHeader>
                        <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={matriculadoPorProvincia}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 95 }}
                                >
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#d0e1fd" />
                                    <XAxis dataKey="asesorprograma" interval={0} tick={xAxisTickProps} axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                    <YAxis axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                    <Tooltip labelStyle={{ color: "blue" }} />
                                    <Bar
                                        dataKey="numero"
                                        label={{
                                            position: "top",
                                            fontSize: 14
                                        }}
                                    >
                                        {matriculadoPorProvincia.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                    <Button auto onClick={() => toggleVisibility('provincia')} className='bg-[#203764] text-white font-semibold'
                        style={{ width: 'auto' }}>
                        {visibleDetails.provincia ? 'Ocultar totales por Provincia' : 'Mostrar totales por Provincia'}
                    </Button>
                    {visibleDetails.provincia && (
                        <div className="total-by-province px-4 py-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {matriculadoPorProvincia.map((provincia) => (
                                <div key={provincia.asesorprograma} className="mb-1">
                                    <strong className="font-semibold">{provincia.asesorprograma}:</strong> {provincia.numero}
                                </div>
                            ))}
                            {matriculadoPorProvincia.length > 10 && (
                                <ScrollTop target=".total-by-province" threshold={100} icon="pi pi-arrow-up" behavior="smooth" className="custom-scrolltop" />
                            )}
                        </div>
                    )}
                </div>

                <div className="col-span-1">
                    <Card className="flex flex-wrap mr-4">
                        <CardHeader className="text-lg font-bold ml-2">
                            {HEADER_MATRICULADOS} por Género
                        </CardHeader>
                        <CardBody>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={matriculadoPorGenero}
                                        dataKey="numero"
                                        nameKey="asesorprograma"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        innerRadius={20}
                                        fill="#8884d8"
                                        label={(props) => renderLabel(matriculadoPorGenero, 12, props)}
                                    >
                                        {matriculadoPorGenero.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip labelStyle={{ color: "blue" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <div className="col-12 xl:col-12 mb-4">
                <Card className="flex flex-wrap mr-4">
                    <CardHeader className="text-lg font-bold ml-2">
                        {HEADER_MATRICULADOS} por Ciudad
                    </CardHeader>
                    <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={matriculadoPorCiudad}
                                margin={{ top: 20, right: 30, left: 20, bottom: 95 }}
                            >
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#d0e1fd" />
                                <XAxis dataKey="asesorprograma" interval={0} tick={xAxisTickProps} axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                <YAxis axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                <Tooltip labelStyle={{ color: "blue" }} />
                                <Bar
                                    dataKey="numero"
                                    label={{
                                        position: "top",
                                        fontSize: 14
                                    }}
                                >
                                    {matriculadoPorCiudad.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Button auto onClick={() => toggleVisibility('ciudad')} className='bg-[#203764] text-white font-semibold'
                    style={{ width: 'auto' }}>
                    {visibleDetails.ciudad ? 'Ocultar totales por Ciudad' : 'Mostrar totales por Ciudad'}
                </Button>
                {visibleDetails.ciudad && (
                    <div className="total-by-city px-4 py-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {matriculadoPorCiudad.map((ciudad) => (
                            <div key={ciudad.asesorprograma} className="mb-1">
                                <strong className="font-semibold">{ciudad.asesorprograma}:</strong> {ciudad.numero}
                            </div>
                        ))}
                        {matriculadoPorCiudad.length > 10 && (
                            <ScrollTop target=".total-by-city" threshold={100} icon="pi pi-arrow-up" behavior="smooth" className="custom-scrolltop" />
                        )}
                    </div>
                )}
            </div>

            <div className="col-12 xl:col-12 mb-4">
                <Card className="flex flex-wrap mr-4">
                    <CardHeader className="text-lg font-bold ml-2">
                        {HEADER_MATRICULADOS} por Carrera
                    </CardHeader>
                    <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={matriculadoPorCarrera}
                                margin={{ top: 20, right: 30, left: 20, bottom: 95 }}
                            >
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#d0e1fd" />
                                <XAxis dataKey="asesorprograma" interval={0} tick={xAxisTickProps} axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                <YAxis axisLine={axisLineStyle} tickLine={tickLineStyle} />
                                <Tooltip labelStyle={{ color: "blue" }} />
                                <Bar
                                    dataKey="numero"
                                    label={{
                                        position: "top",
                                        fontSize: 14
                                    }}
                                >
                                    {matriculadoPorCarrera.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
                <Button auto onClick={() => toggleVisibility('carrera')} className="bg-[#203764] text-white font-semibold"
                    style={{ width: 'auto' }}>
                    {visibleDetails.carrera ? 'Ocultar totales por Carrera' : 'Mostrar totales por Carrera'}
                </Button>
                {visibleDetails.carrera && (
                    <div className="total-by-carrer px-4 py-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {matriculadoPorCarrera.map((carrera) => (
                            <div key={carrera.asesorprograma} className="mb-1">
                                <strong className="font-semibold">{carrera.asesorprograma}:</strong> {carrera.numero}
                            </div>
                        ))}
                        {matriculadoPorCarrera.length > 10 && (
                            <ScrollTop target=".total-by-carrer" threshold={100} icon="pi pi-arrow-up" behavior="smooth" className="custom-scrolltop" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatriculadosWithScrollTop;
