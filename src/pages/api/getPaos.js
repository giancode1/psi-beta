// pages/api/paos.js
import axios from 'axios';

export default async function getPaos(req, res) {
    try {
        const response = await axios.get(`${process.env.API_NAME}?a=${process.env.AUTH_API_PAOLIST}&key=${process.env.API_KEY}`);

        //console.log('API response:', response.data); // Nota: `response.data` contiene los datos.

        if (!response.data) {
            return res.status(500).json({
                ok: false,
                msg: 'No data received from the API'
            });
        }

        // Suponiendo que `response.data.data` es el arreglo que quieres enviar
        const paos = response.data.data;

        //console.log('Data received:', paos);

        return res.status(200).json({
            ok: true,
            paos,
        });

    } catch (error) {
        console.error('Error making API request:', error.message, error.response?.data);

        return res.status(500).json({
            ok: false,
            msg: 'Error when making the request'
        });
    }
}
