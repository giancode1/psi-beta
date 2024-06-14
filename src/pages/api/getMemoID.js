// pages/api/getMemoID.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${process.env.API_NAME}?a=${process.env.AUTH_API_GET_MEMO_ID}&key=${process.env.KEY_DATE}&id=5`);
    const data = response.data;

    if (data.result === 'ok') {
      res.status(200).json(data);
    } else {
      res.status(500).json({ error: 'Error fetching document list' });
    }
  } catch (error) {
    console.error('Error fetching document list:', error);
    res.status(500).json({ error: 'Error fetching document list' });
  }
}
