// pages/api/updateHabilitarMatricula.js
import axios from 'axios';
import FormData from 'form-data';

export default async function updateHabilitarMatricula(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, msg: 'Method not allowed' });
    }

    const { ide, estado } = req.body;
    if (!ide || !Array.isArray(ide) || ide.length === 0 || estado == null) {
        console.error('Invalid input data:', { ide, estado });
        return res.status(400).json({ ok: false, msg: 'Invalid input data' });
    }

    const apiKey = process.env.KEY_DATE;
    const apiName = process.env.API_NAME;
    const actionName = process.env.AUTH_API_POST_MATRICULA;

    const formData = new FormData();
    formData.append('a', actionName);
    formData.append('ide', `[${ide.join(',')}]`);
    formData.append('estado', estado);
    formData.append('key', apiKey);

    console.log('Sending request to API:', apiName);
    console.log('FormData:', { a: actionName, ide: `[${ide.join(',')}]`, estado, key: apiKey });

    try {
        const response = await axios.post(apiName, formData, {
          headers: { ...formData.getHeaders() },
        });
      
        if (!response.data || response.data.result === 'bad') {
          console.error('API error response:', response.data);
          return res.status(500).json({ ok: false, msg: 'Failed API response', details: response.data });
        }
        return res.status(200).json({ ok: true, result: response.data });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error making API request:', error.message, error.response.data, { request: formData });
          return res.status(500).json({ ok: false, msg: 'Error calling API', details: error.response.data });
        } else {
          console.error('Unexpected error:', error.message, { request: formData });
          return res.status(500).json({ ok: false, msg: 'Internal server error' });
        }
      }
}
