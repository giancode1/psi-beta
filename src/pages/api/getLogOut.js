// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),  // Establece la fecha de expiración en el pasado
    path: '/',
  }));

  res.status(200).json({ success: true });
}
