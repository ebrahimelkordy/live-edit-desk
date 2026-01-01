import { connectDB } from '../lib/db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const id = req.query?.id || req.query?.ID || req.query?.fileId;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const db = await connectDB();
    const files = db.collection('files');
    const doc = await files.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { filename, mimeType, dataBase64 } = doc;
    const buffer = Buffer.from(dataBase64, 'base64');

    res.setHeader('Content-Type', mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'file'}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('[API File] Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}