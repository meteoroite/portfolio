import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PROJECTS_DATA } from '../src/data/profileData';
import type { Project } from '../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'admin123';

  // GET /api/projects — list all
  if (req.method === 'GET') {
    return res.status(200).json(PROJECTS_DATA);
  }

  // POST/PUT/DELETE require admin
  const passkey = req.headers['x-admin-passkey'] || req.body?.passkey;
  if (passkey !== ADMIN_PASSKEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Note: On Vercel serverless, mutations are ephemeral (no persistent state).
  // These return success but won't survive cold starts. Use a database for persistence.
  if (req.method === 'POST') {
    const newProject: Project = req.body.project;
    if (!newProject?.title || !newProject?.shortDesc) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    newProject.id = newProject.id || `proj_${Date.now()}`;
    return res.status(200).json({ success: true, project: newProject });
  }

  if (req.method === 'PUT') {
    return res.status(200).json({ success: true, message: 'Project updated (ephemeral on serverless)' });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true, message: 'Project deleted (ephemeral on serverless)' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
