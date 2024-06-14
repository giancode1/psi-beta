import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const Matriculados = ({ chartData }) => {
  const {
    matriculadosPorProvincia = [],
    matriculadosPorCiudad = [],
    matriculadosPorGenero = [],
    matriculadosPorCarrera = [],
  } = chartData || {};

  return (
    <div className="grid p-fluid">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <Card className="flex flex-wrap mr-4">
            <CardHeader className="text-lg font-bold ml-2">
              {HEADER_MATRICULADOS} por Provincia
            </CardHeader>
            <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={matriculadosPorProvincia}
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
                    {matriculadosPorProvincia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
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
                    data={matriculadosPorGenero}
                    dataKey="numero"
                    nameKey="asesorprograma"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={20}
                    fill="#8884d8"
                    label={(props) => renderLabel(matriculadosPorGenero, 12, props)}
                  >
                    {matriculadosPorGenero.map((entry, index) => (
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

      <div className="col-12 xl:col-6 mb-4">
        <Card className="flex flex-wrap mr-4">
          <CardHeader className="text-lg font-bold ml-2">
            {HEADER_MATRICULADOS} por Ciudad
          </CardHeader>
          <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={matriculadosPorCiudad}
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
                  {matriculadosPorCiudad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="col-12 xl:col-6 mb-4">
        <Card className="flex flex-wrap mr-4">
          <CardHeader className="text-lg font-bold ml-2">
            {HEADER_MATRICULADOS} por Carrera
          </CardHeader>
          <CardBody style={{ width: '100%', overflowX: 'scroll' }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={matriculadosPorCarrera}
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
                  {matriculadosPorCarrera.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Matriculados;
