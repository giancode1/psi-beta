// pages/api/paises
import axios from 'axios';

export default async function getOpcionesRegistro(req, res) {
    try {
        const response = await axios.get(`${process.env.API_NAME}?a=${process.env.AUTH_API_GET_OPCIONREG}&key=${process.env.KEY_DATE}`);

        //console.log('API response:', response.data); // Nota: `response.data` contiene los datos.

        if (!response.data) {
            return res.status(500).json({
                ok: false,
                msg: 'No data reaceived from the API'
            });
        }

        // Suponiendo que `response.data.data` es el arreglo que quieres enviar
        const opciones = response.data.data;

        console.log('Data received:', opciones);

        return res.status(200).json({
            ok: true,
            opciones,
        });

    } catch (error) {
        console.error('Error making API request:', error.message, error.response?.data);

        return res.status(500).json({
            ok: false,
            msg: 'Error when making the request'
        });
    }
}