// utils/asesoresDataGenerator.js

const obtenerAliasAsesor = (asesor) => {
    const mapeoAlias = {
        "OFERTA_ACADEMICA  TECNICO1": "CARDENAS GRANDA MARTHA JACKELINE",
        "OFERTA_ACADEMICA  TECNICO2": "SANTANA DE SOLÍS RAISA INDIRA DE LAS MERCEDES",
        "OFERTA_ACADEMICA  TECNICO3": "RAMOS RAMOS FREDDY GUALBERTO",
        "OFERTA_ACADEMICA  TECNICO4": "MAZO ARROYAVE JULIED VANESA",
        "OFERTA_ACADEMICA  TECNICO5": "LOPEZ LOAIZA JOHANNA DANIELA",
        "OFERTA_ACADEMICA  TECNICO6": "SALVADOR CHIRIBOGA RONNY EDUARDO",
        "OFERTA_ACADEMICA  TECNICO7": "MARCALLA TIL ÁNGEL MATÍAS",
        "OFERTA_ACADEMICA  TECNICO8": "ALVAREZ ALVAREZ MICHELLE ESTEFANÍA",
        "OFERTA_ACADEMICA  TECNICO9": "GARCES HIDALGO JORGE LUIS",
        "OFERTA_ACADEMICA  TECNICO10": "BONILLA JURADO RICHARD ANTONIO",
        "OFERTA_ACADEMICA  TECNICO11": "FRANCO ORTEGA DANIELA MERCEDES",
        "OFERTA_ACADEMICA  TECNICO12": "VELOZ LASCANO LIZBETH MELIZA",
        "OFERTA_ACADEMICA  TECNICO13": "MONTESDEOCA PEÑA EDDY SANTIAGO",
        "OFERTA_ACADEMICA  TECNICO14": "SALTOS MONTERO ANTONIO JOSE",
        "OFERTA_ACADEMICA  TECNICO15": "DOMINGUEZ ECHEVERRIA TATIANA CAROLINA",
        "OFERTA_ACADEMICA  TECNICO16": "LLANGARI PAUCAR PEDRO ALBERTO",
        "OFERTA_ACADEMICA  TECNICO17": "VERA TIXI PAOLA ISABEL",
        "OFERTA_ACADEMICA  TECNICO18": "PIN ROMERO FERNANDA MISHELLE",
        "OFERTA_ACADEMICA  TECNICO19": "ROJAS MONTENEGRO KELLY JOHANNA",
        "OFERTA_ACADEMICA  TECNICO20": "BONILLA AGUILAR LISSETTE JAZMÍN",
        "OFERTA_ACADEMICA  TECNICO21": "PRADO CHAMORRO THALIA KATHERINE",
        "OFERTA_ACADEMICA  TECNICO22": "PUMA DELGADO MARIA GABRIELA",
        "OFERTA_ACADEMICA  TECNICO23": "AYOVÍ TORRES MÓNICA ALEXANDRA",
        "OFERTA_ACADEMICA  TECNICO24": "CRIOLLO URCO AMANDA CAROLINA",
        "OFERTA_ACADEMICA  TECNICO25": "MORÁN MOSQUERA MARÍA SOLEDAD",
        "OFERTA_ACADEMICA  TECNICO26": "TUAREZ ESCOBAR NICOLE SOLANGE",
        "OFERTA_ACADEMICA  TECNICO27": "JACHO  MARÍA BELÉN",
        "OFERTA_ACADEMICA  TECNICO28": "DOMINGUEZ DAVILA CAROLINA",
        "OFERTA_ACADEMICA  TECNICO29": "GUEVARA LOPEZ SOFIA MARGARITA"
        //otros alias
    };
    const alias = mapeoAlias[asesor] || asesor;
    return alias;
};

const groupByDataTypeTest = (datos) => {
    const estadisticas = {};
    const totales = { inscritos: 0, homologacion: 0, salud: 0, regular: 0, maestria: 0 };

    datos.forEach((objeto) => {
        let asesor = objeto.asesoradmision;
        let alias = obtenerAliasAsesor(asesor);
        const sesion = objeto.sesion;
        if (!asesor) {
            asesor = "INSCRITO POR TI";
            alias = "INSCRITO POR TI";
        }
        if (alias === "INSCRITO POR TI") return;

        const clave = alias;
        if (!estadisticas[clave]) {
            estadisticas[clave] = {
                nombre: asesor,
                alias: clave,
                numeroRepetidos: 0,
                validando: 0,
                salud: 0,
                regular: 0,
                maestria: 0,
            };
        }
        estadisticas[clave].numeroRepetidos++;
        if (sesion.includes("VALIDANDO") || sesion.includes("HOMOLOGACIÓN")) {
            estadisticas[clave].validando++;
            totales.homologacion++;
        } else if (sesion.includes("SALUD")) {
            estadisticas[clave].salud++;
            totales.salud++;
        } else if (sesion.includes("REGULAR")) {
            estadisticas[clave].regular++;
            totales.regular++;
        } else if (sesion.includes("MT")) {
            estadisticas[clave].maestria++;
            totales.maestria++;
        }
        totales.inscritos = totales.homologacion + totales.salud + totales.regular + totales.maestria;
    });

    const estadisticasArray = Object.values(estadisticas);
    estadisticasArray.sort((a, b) => b.numeroRepetidos - a.numeroRepetidos);
    return { estadisticasArray, totales };
};

export const generateAsesoresData = (students) => {
    return groupByDataTypeTest(students);
};
