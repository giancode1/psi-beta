import fs from 'fs';
import path from 'path';
import { fillMemo } from '../../utils/fillMemo';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { data, type, codigo } = req.body;
  const templatePath = type === 'REGULAR'
    ? path.join(process.cwd(), 'public', 'archives', 'Formato_Regular.docx')
    : path.join(process.cwd(), 'public', 'archives', 'Formato_Homologacion.docx');
  const outputPath = path.join(process.cwd(), 'public', 'cache', `Memorando_${codigo}.docx`);

  try {
    const buffer = await fillMemo(data, templatePath, codigo);

    // Write the file to the cache directory
    fs.writeFileSync(outputPath, buffer);

    // Send the file as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=Memorando_${codigo}.docx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: 'Error generating document' });
  }
}
