import {
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaUserCheck,
  FaUserPlus,
  FaTag,
  FaFolderOpen,
  FaFileWord
} from "react-icons/fa";

export const SIDENAV_ITEMS = [
  {
    title: "Estadística",
    roles: ["rectorado", "ti"],
    menuList: [
      {
        title: "Alumnos Nuevos Fecha",
        path: "/dashboard/estadistica/nuevosFecha",
        icon: <FaCalendarAlt size={20} />,
        roles: ["rectorado", "ti"],
      },
      {
        title: "Alumnos Nuevos Pao",
        path: "/dashboard/estadistica/nuevosPao",
        icon: <FaUserPlus size={20} />,
        roles: ["rectorado", "ti"],
      },
      {
        title: "Alumnos Totales Pao",
        path: "/dashboard/estadistica/totalesPao",
        icon: <FaChartBar size={20} />,
        roles: ["rectorado", "ti"],
      },
      {
        title: "Marketing",
        path: "/dashboard/estadistica/marketing",
        icon: <FaChartLine size={20} />,
        roles: ["rectorado", "marketing", "ti"],
      },
    ],
  },
  {
    title: "Admisiones",
    roles: ["supervisor","analista", "ti"],
    menuList: [
      {
        title: "Expediente",
        path: "/dashboard/admisiones/expediente",
        icon: <FaFolderOpen size={20} />,
        roles: ["supervisor","analista", "ti"],
      },
      {
        title: "Etiquetas",
        path: "/dashboard/admisiones/etiquetas",
        icon: <FaTag size={20} />,
        roles: ["supervisor", "analista", "ti"],
      },
      {
        title: "Legalizado",
        path: "/dashboard/admisiones/legalizado",
        icon: <FaUserCheck size={20} />,
        roles: ["supervisor","ti"],
      },
      {
        title: "Memorando",
        path: "/dashboard/admisiones/memorando",
        icon: <FaFileWord size={20} />,
        roles: ["supervisor", "ti"],
      },
    ],
  },
  {
    title: "AIC",
    roles: ["caces", "ti"], 
    menuList: [
      {
        title: "Index",
        path: "/dashboard/caces",
        icon: <FaFolderOpen size={20} />,
        roles: ["caces", "ti"],
      },
    ],
  },
];
