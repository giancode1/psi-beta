import axios from 'axios';
import FormData from 'form-data';

export default async function updateAnalista(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, msg: 'Method not allowed' });
    }

    const { ide, idp } = req.body;
    if (!ide || !Array.isArray(ide) || ide.length === 0 || idp == null) {
        console.error('Invalid input data:', { ide, idp });
        return res.status(400).json({ ok: false, msg: 'Invalid input data' });
    }

    const apiKey = process.env.KEY_DATE;
    const apiName = process.env.API_NAME;
    const actionName = process.env.AUTH_API_POST_ANALISTA;

    const formData = new FormData();
    formData.append('a', actionName);
    formData.append('ide', `[${ide.join(',')}]`);
    formData.append('idp', idp);
    formData.append('key', apiKey);

    console.log('Sending request to API:', apiName);
    console.log('FormData:', { a: actionName, ide: `[${ide.join(',')}]`, idp, key: apiKey });

    try {
        const response = await axios.post(apiName, formData, {
            headers: { ...formData.getHeaders() },
        });

        console.log('API response:', response.data);
        if (!response.data || response.data.result !== 'ok') {
            console.error('API error response:', response.data);
            return res.status(500).json({ ok: false, msg: 'Failed API response', details: response.data });
        }
        return res.status(200).json({ ok: true, result: response.data });
    } catch (error) {
        console.error('Error making API request:', error.message, { request: formData });
        return res.status(500).json({ ok: false, msg: 'Error when making the request', error: error.message, requestBody: { ide, idp } });
    }
}