// pages/api/getInfo.js
import axios from 'axios';

export default async function getInfo(req, res) {
    const { identificacion, expediente } = req.query;

    if (!identificacion && !expediente) {
        console.log('No identificacion or expediente provided');
        return res.status(400).json({
            ok: false,
            msg: 'Por favor, proporcione una identificación o expediente.'
        });
    }

    if (identificacion && expediente) {
        console.log('Both identificacion and expediente provided');
        return res.status(400).json({
            ok: false,
            msg: 'Only one of Identificación or Expediente should be provided'
        });
    }

    const param = identificacion ? `identificacion=${identificacion}` : `expediente=${expediente}`;
    const apiUrl = `${process.env.API_NAME}?a=${process.env.AUTH_API_GET_INFO}&key=${process.env.KEY_DATE}&${param}`;

    try {
        console.log('Requesting API:', apiUrl);
        const response = await axios.get(apiUrl);

        if (!response.data) {
            console.log('No data received from API');
            return res.status(500).json({
                ok: false,
                msg: 'No data received from the API'
            });
        }

        // Suponiendo que `response.data.data` es el objeto que quieres enviar
        const info = response.data.data;
        console.log('Data received from API:', info);

        return res.status(200).json({
            ok: true,
            info,
        });

    } catch (error) {
        console.error('Error making API request:', error.message, error.response?.data);

        return res.status(500).json({
            ok: false,
            msg: 'Error when making the request'
        });
    }
}
