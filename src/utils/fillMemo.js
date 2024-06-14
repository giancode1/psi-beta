import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export async function fillMemo(data, templatePath, codigo) {
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const fecha = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const carreras = [...new Set(data.map(d => d.carrera))];
  const periodos = [...new Set(data.map(d => d.periodo))];
  const total = data.length;
  const expedientes = data.map(d => d.identificador).join(', ');

  const renderData = {
    codigo,
    fecha,
    carrera: carreras.length === 1 ? carreras[0] : carreras.join(', '),
    periodo: periodos.length === 1 ? periodos[0] : periodos.join(', '),
    opcionregistro: data[0].opcionregistro,
    total,
    expedientes,
  };

  doc.render(renderData);

  const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });

  return buffer;
}
