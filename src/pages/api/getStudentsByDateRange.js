const axios = require('axios');

export default async function getStudentsByDateRange(req, res) {
    const { fechainicio, fechafin } = req.body;
    console.log(`Petición recibida con fechas: ${fechainicio} - ${fechafin}`); // Muestra las fechas recibidas

    if (!fechainicio || !fechafin) {
        return res.status(404).json({
            ok: false,
            msg: 'Undefined Dates'
        });
    }

    try {
        const startTime = Date.now(); // Inicia el contador de tiempo
        const response = await axios.get(`${process.env.API_NAME}?a=${process.env.AUTH_API_DATE}&key=${process.env.KEY_DATE}&fechainicio=${fechainicio}&fechafin=${fechafin}`);
        const duration = Date.now() - startTime; // Calcula la duración de la petición

        // Muestra por consola la respuesta completa de la petición
        console.log('Respuesta completa de la petición:', response.data);

        // Verifica si la respuesta tiene datos
        if (!response.data || !response.data.data || response.data.data.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No se encontraron registros.' });
        }

        // Muestra por consola el tiempo de respuesta y las fechas recibidas
        console.log(`Tiempo de respuesta de la petición: ${duration} ms`);

        // Devuelve la respuesta al cliente
        return res.json({
            ok: true,
            students: response.data.data,
            duration: `${duration} ms`,
            receivedDates: { fechainicio, fechafin }
        });

    } catch (error) {
        console.error('Error al realizar la petición:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error when registering the event'
        });
    }
};
