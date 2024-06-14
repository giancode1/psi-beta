const axios = require('axios');

const getStudentsPaosN = async (req, res) => {
    try {
        const { periodo } = req.query;
    
        if (!periodo) {
            console.log("El periodo no está definido.");
            return res.status(400).json({
                ok: false,
                msg: 'El periodo no está especificado en la consulta.'
            });
        }

        const apiURL = `${process.env.API_NAME}?a=${process.env.AUTH_API_PAON}&key=${process.env.API_KEY}&periodo=${periodo}`;
        const { data } = await axios.get(apiURL);

        if (!data || !data.data || data.data.length === 0) {
            console.log("No se encontraron registros para el periodo especificado.");
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron registros.'
            });
        }

        console.log(data)
        console.log("La API para obtener estudiantes nuevos por PAO ha sido ejecutada exitosamente.");
        return res.status(200).json({
            ok: true,
            students: data.data,
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor.'
        });
    }
};

export default getStudentsPaosN;
