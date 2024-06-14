import axios from 'axios';
import qs from 'qs';
import { generateToken, setTokenCookie } from '../../utils/token';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ result: "error", error: 'Faltan credenciales' });
  }

  try {
    const whitelistResponse = await axios.get(process.env.NEXT_PUBLIC_WHITELIST_URL);
    if (!whitelistResponse.data) {
      throw new Error('No se pudo cargar la lista blanca');
    }

    const userType = Object.keys(whitelistResponse.data).find(role => whitelistResponse.data[role].includes(user));
    if (!userType) {
      return res.status(403).json({ result: "error", error: 'Usuario no autorizado en la lista blanca' });
    }

    const API_URL = process.env.API_NAME;
    const data = qs.stringify({ key: process.env.API_KEY, a: process.env.AUTH_LOGIN, user, pass });
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    const loginResponse = await axios.post(API_URL, data, config);

    if (loginResponse.data.result !== 'ok' || loginResponse.data.error) {
      return res.status(401).json({ result: "error", error: 'Credenciales incorrectas' });
    }

    const tokenData = { emailint: loginResponse.data.emailint, role: userType };
    const token = await generateToken(tokenData);
    setTokenCookie(res, token, false); // Configurando httpOnly como false para accesibilidad del cliente
    console.log("Token generado y cookie establecida con éxito:", tokenData);
    return res.status(200).json({ result: "ok", data: loginResponse.data, role: userType });

  } catch (error) {
    return res.status(500).json({ result: "error", error: 'Error interno del servidor' });
  }
}
