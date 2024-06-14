import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const generateToken = async (data) => {
  try {
    const token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: '1h' });
    console.log('Token generado exitosamente:', token);
    return token;
  } catch (error) {
    console.error('Error al generar el token:', error);
    return null;
  }
};

export const verifyToken = (token) => {
  try {
    console.log('Token recibido para verificar:', token);
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log('Token verificado exitosamente:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return false;
  }
};

export const setTokenCookie = (res, token, httpOnly = false) => {
  if (!token) {
    console.error('Intento de configurar una cookie con token nulo');
    return;
  }
  const serialized = serialize('token', token, {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1 hora en segundos
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
  console.log('Cookie configurada exitosamente. Cookie value:', serialized);
};

export const removeTokenCookie = (res) => {
  const serialized = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Expirar inmediatamente
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
  console.log('Cookie eliminada exitosamente.');
};

export const getTokenFromReq = (req) => {
  try {
    const { token } = parse(req.headers.cookie || '');
    console.log('Token recuperado de la solicitud:', token);
    return token;
  } catch (error) {
    console.error('Error al recuperar el token de la solicitud:', error);
    return null;
  }
};

export const getUserFromToken = (req) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) return null;

    const decoded = verifyToken(token);
    console.log('Usuario recuperado del token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
