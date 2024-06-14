import multiparty from 'multiparty';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Desactiva el análisis del cuerpo de la solicitud de Next.js
    },
};

export default async function uploadDoc(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, msg: 'Method not allowed' });
    }

    console.log("Request received");

    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).json({ ok: false, msg: 'Error parsing form data' });
        }

        console.log("Fields received:", fields);
        console.log("Files received:", files);

        const { copiadigital, copiafisica, nombre, tipodocumento, observaciones, archivador, visibleestudiante, id } = fields;
        const archivo = files.archivo ? files.archivo[0] : null;

        if (!archivo) {
            console.error("No file uploaded");
            return res.status(400).json({ ok: false, msg: 'No file uploaded' });
        }

        const formData = new FormData();
        formData.append('a', process.env.AUTH_API_POST_DOC);
        formData.append('key', process.env.KEY_DATE);
        formData.append('copiadigital', copiadigital[0]);
        formData.append('copiafisica', copiafisica ? copiafisica[0] : ''); // Asegurar que siempre se envíe
        formData.append('nombre', nombre[0]);
        formData.append('tipodocumento', tipodocumento[0]);
        formData.append('observaciones', observaciones ? observaciones[0] : '');
        formData.append('archivador', archivador ? archivador[0] : '');
        formData.append('visibleestudiante', visibleestudiante ? visibleestudiante[0] : ''); // Asegurar que siempre se envíe
        formData.append('id', id[0]);
        formData.append('archivo', fs.createReadStream(archivo.path), archivo.originalFilename);

        // Imprimir los valores en formData (manualmente)
        console.log('FormData prepared:');
        console.log('a:', process.env.AUTH_API_POST_DOC);
        console.log('key:', process.env.KEY_DATE);
        console.log('copiadigital:', copiadigital[0]);
        console.log('copiafisica:', copiafisica ? copiafisica[0] : '');
        console.log('nombre:', nombre[0]);
        console.log('tipodocumento:', tipodocumento[0]);
        console.log('observaciones:', observaciones ? observaciones[0] : '');
        console.log('archivador:', archivador ? archivador[0] : '');
        console.log('visibleestudiante:', visibleestudiante ? visibleestudiante[0] : '');
        console.log('id:', id[0]);
        console.log('archivo:', archivo.originalFilename);

        try {
            const response = await axios.post(process.env.API_NAME, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            console.log("API response:", response.data);

            if (!response.data || response.data.result !== 'ok') {
                console.error("Failed API response", response.data);
                return res.status(500).json({ ok: false, msg: 'Failed API response', details: response.data });
            }

            return res.status(200).json({ ok: true, result: response.data });
        } catch (error) {
            console.error('Error when making the request:', error);
            return res.status(500).json({ ok: false, msg: 'Error when making the request', error: error.message });
        }
    });
}
