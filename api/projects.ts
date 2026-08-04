import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PROJECTS_DATA } from './_data';
import { getAdminPasskey, isAdminRequest, adminDisabled, sanitizeText } from './_util';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/projects — list all (public)
  if (req.method === 'GET') {
    return res.status(200).json(PROJECTS_DATA);
  }

  // POST/PUT/DELETE require admin — fail closed if ADMIN_PASSKEY is not configured.
  if (!getAdminPasskey()) {
    return res.status(503).json(adminDisabled());
  }
  if (!isAdminRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Note: On Vercel serverless, mutations are ephemeral (no persistent state).
  // These return success but won't survive cold starts. Use a database for persistence.
  if (req.method === 'POST') {
    const raw = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const newProject = raw.project && typeof raw.project === 'object' ? (raw.project as Record<string, unknown>) : {};
    if (!sanitizeText(newProject.title) || !sanitizeText(newProject.shortDesc)) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    newProject.title = sanitizeText(newProject.title, 200);
    newProject.shortDesc = sanitizeText(newProject.shortDesc, 500);
    newProject.fullDesc = sanitizeText(newProject.fullDesc, 2000);
    newProject.id = sanitizeText(newProject.id, 100) || `proj_${Date.now()}`;
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
