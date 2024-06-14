import axios from 'axios';
import FormData from 'form-data';

export default async function actualizarEstudiante(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, msg: 'Method not allowed' });
    }

    const { ide, identificador, paisresidencia, provinciaresidencia, cantonresidencia, parroquiaresidencia, calleprincipal, callesecuendaria, numeroresidencia, email, telefonomovil, periodo, sesion, opcionregistro } = req.body;

    // Imprimir los datos recibidos en la consola
    console.log('Datos recibidos:', req.body);

    const form = new FormData();
    form.append('a', process.env.AUTH_API_POST_INFOEST);
    form.append('key', process.env.KEY_DATE);
    
    if (ide) form.append('ide', ide);
    if (identificador) form.append('identificador', identificador);
    if (paisresidencia) form.append('paisresidencia', paisresidencia);
    if (provinciaresidencia) form.append('provinciaresidencia', provinciaresidencia);
    if (cantonresidencia) form.append('cantonresidencia', cantonresidencia);
    if (parroquiaresidencia) form.append('parroquiaresidencia', parroquiaresidencia);

    // No filtrar los valores vacíos para estos campos
    form.append('telefonomovil', telefonomovil);
    form.append('email', email);
    form.append('calleprincipal', calleprincipal);
    form.append('callesecuendaria', callesecuendaria);
    form.append('numeroresidencia', numeroresidencia);

    if (periodo) form.append('periodo', periodo);
    if (sesion) form.append('sesion', sesion);
    if (opcionregistro) form.append('opcionregistro', opcionregistro);

    try {
        const response = await axios.post(process.env.API_NAME, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (!response.data) {
            return res.status(500).json({ ok: false, msg: 'No data received from the API' });
        }

        return res.status(200).json({ ok: true, data: response.data });

    } catch (error) {
        console.error('Error making API request:', error.message, error.response?.data);

        return res.status(500).json({ ok: false, msg: 'Error when making the request' });
    }
}
