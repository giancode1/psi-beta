// pages/api/cantones.js
import axios from 'axios';

export default async function getCantones(req, res) {
    const { id } = req.query; // Obtener el ID de la provincia de los parámetros de la solicitud

    if (!id) {
        return res.status(400).json({
            ok: false,
            msg: 'Province ID is required'
        });
    }

    try {
        const response = await axios.get(`${process.env.API_NAME}?a=${process.env.AUTH_API_GET_CANTON}&key=${process.env.KEY_DATE}&id=${id}`);

        if (!response.data) {
            return res.status(500).json({
                ok: false,
                msg: 'No data received from the API'
            });
        }

        const cantones = response.data.data;

        return res.status(200).json({
            ok: true,
            cantones,
        });

    } catch (error) {
        console.error('Error making API request:', error.message, error.response?.data);

        return res.status(500).json({
            ok: false,
            msg: 'Error when making the request'
        });
    }
}
