import axios from 'axios';

const getStudentsPaosT = async (req, res) => {
    try {
        const { periodo } = req.query;
    
        if (!periodo) {
            return res.status(400).json({
                ok: false,
                msg: 'El periodo no está especificado en la consulta.'
            });
        }

        const apiURL = `${process.env.API_NAME}?a=${process.env.AUTH_API_PAOT}&key=${process.env.API_KEY}&periodo=${periodo}`;
        const { data } = await axios.get(apiURL);

        if (!data || !data.data || data.data.length === 0) {
            console.log("No se encontraron registros.");
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron registros para el periodo especificado.'
            });
        }
        console.log(data)
        console.log("La API para obtener estudiantes totales por PAO ha sido ejecutada exitosamente.");
        return res.status(200).json({
            ok: true,
            students: data.data,
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({
            ok: false,
            msg: error.message || 'Error interno del servidor.'
        });
    }
};

export default getStudentsPaosT;
