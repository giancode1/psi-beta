import multiparty from 'multiparty';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadMemo(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Method not allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ ok: false, msg: 'Error parsing form data' });
    }

    const { nombre, fecha, numeracion } = fields;
    const archivoPath = path.join(process.cwd(), 'public', 'cache', `Memorando_${numeracion[0]}.docx`);

    if (!fs.existsSync(archivoPath)) {
      console.error("No file found at path:", archivoPath);
      return res.status(400).json({ ok: false, msg: 'Archivo no generado o no encontrado' });
    }

    const formData = new FormData();
    formData.append('nombre', nombre[0]);
    formData.append('tipocategoriadocumento', '5');
    formData.append('fecha', fecha[0]);
    formData.append('a', process.env.AUTH_API_POST_MEMO);
    formData.append('key', process.env.KEY_DATE);
    formData.append('numeracion', numeracion[0]);
    formData.append('archivo', fs.createReadStream(archivoPath), `Memorando_${numeracion[0]}.docx`);

    try {
      const response = await axios.post(process.env.API_NAME, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      if (!response.data || response.data.result !== 'ok') {
        console.error("Failed API response", response.data);
        return res.status(500).json({ ok: false, msg: 'Failed API response', details: response.data });
      }

      // Eliminar el archivo después de la carga exitosa
      fs.unlinkSync(archivoPath);

      return res.status(200).json({ ok: true, result: response.data });
    } catch (error) {
      console.error('Error when making the request:', error);
      return res.status(500).json({ ok: false, msg: 'Error when making the request', error: error.message });
    }
  });
}
