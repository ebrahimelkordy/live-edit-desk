import { connectDB } from '../lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, mimeType, dataBase64 } = req.body || {};
    if (!filename || !mimeType || !dataBase64) {
      return res.status(400).json({ error: 'Missing filename, mimeType, or dataBase64' });
    }

    // Connect to DB and store file document
    const db = await connectDB();
    const files = db.collection('files');
    const doc = {
      filename,
      mimeType,
      dataBase64,
      createdAt: new Date(),
    };
    const result = await files.insertOne(doc);
    const id = result.insertedId.toString();

    // Return a URL that can be used to download/view the file
    const url = `/api/file?id=${id}`;
    return res.status(200).json({ ok: true, id, url });
  } catch (error) {
    console.error('[API Upload] Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}