import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

export type LeadPayload = {
  name: string;
  company: string;
  email: string;
  employees: string;
  whatsapp?: string;
};

export type LeadRecord = LeadPayload & {
  createdAt: string;
};

const normalizeWhatsapp = (raw?: string) => {
  const value = raw?.trim() ?? '';

  if (!value) {
    return '';
  }

  const compact = value.replace(/[\s()-]/g, '');

  if (/^\d{8}$/.test(compact)) {
    return `+65${compact}`;
  }

  if (/^65\d{8}$/.test(compact)) {
    return `+${compact}`;
  }

  if (/^\+\d{8,15}$/.test(compact)) {
    return compact;
  }

  if (/^\d{8,15}$/.test(compact)) {
    return `+${compact}`;
  }

  return null;
};

const dataDirectory = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDirectory, 'leads.json');

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  pgInitDone?: boolean;
};

const getPool = () => {
  if (!databaseUrl) {
    return null;
  }

  if (!globalForDb.pgPool) {
    globalForDb.pgPool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  return globalForDb.pgPool;
};

const ensureTable = async () => {
  const pool = getPool();

  if (!pool || globalForDb.pgInitDone) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      employees TEXT NOT NULL,
      whatsapp TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query('ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp TEXT;');

  globalForDb.pgInitDone = true;
};

export const isValidLeadPayload = (payload: LeadPayload) => {
  return getLeadValidationError(payload) === null;
};

export const getLeadValidationError = (payload: LeadPayload): string | null => {
  if (payload.name.trim().length <= 1) {
    return 'Name must be at least 2 characters.';
  }

  if (payload.company.trim().length <= 1) {
    return 'Company must be at least 2 characters.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return 'Please enter a valid work email address.';
  }

  const employeesNum = Number(payload.employees);
  if (!Number.isFinite(employeesNum) || employeesNum <= 0) {
    return 'Number of employees must be greater than 0.';
  }

  if (normalizeWhatsapp(payload.whatsapp) === null) {
    return 'WhatsApp number format is invalid. Use 90356479 or +6590356479.';
  }

  return null;
};

const toRecord = (payload: LeadPayload): LeadRecord => ({
  name: payload.name.trim(),
  company: payload.company.trim(),
  email: payload.email.trim().toLowerCase(),
  employees: payload.employees,
  whatsapp: normalizeWhatsapp(payload.whatsapp) ?? '',
  createdAt: new Date().toISOString(),
});

const readFileLeads = async (): Promise<LeadRecord[]> => {
  try {
    const content = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(content) as LeadRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeFileLead = async (newLead: LeadRecord) => {
  await fs.mkdir(dataDirectory, { recursive: true });
  const existing = await readFileLeads();
  existing.push(newLead);
  await fs.writeFile(dataFile, JSON.stringify(existing, null, 2), 'utf8');
};

export const saveLead = async (payload: LeadPayload) => {
  const newLead = toRecord(payload);
  const pool = getPool();

  let persisted = false;

  if (pool) {
    try {
      await ensureTable();
      await pool.query(
        'INSERT INTO leads (name, company, email, employees, whatsapp, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          newLead.name,
          newLead.company,
          newLead.email,
          newLead.employees,
          newLead.whatsapp,
          newLead.createdAt,
        ]
      );
      persisted = true;
    } catch (error) {
      console.error('Postgres write failed.', error);
    }
  }

  const shouldAttemptFile = !persisted || process.env.NODE_ENV !== 'production';

  if (shouldAttemptFile) {
    try {
      await writeFileLead(newLead);
      persisted = true;
    } catch (error) {
      console.error('File write failed for lead backup.', error);

      if (!persisted) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(
            'Lead storage is not configured for production. Set DATABASE_URL for persistent storage.'
          );
        }

        throw error;
      }
    }
  }

  if (!persisted) {
    throw new Error('Lead could not be saved to any storage backend.');
  }
};

export const getLeads = async (): Promise<LeadRecord[]> => {
  const pool = getPool();

  if (pool) {
    try {
      await ensureTable();
      const result = await pool.query<{
        name: string;
        company: string;
        email: string;
        employees: string;
        whatsapp: string | null;
        created_at: string;
      }>(
        'SELECT name, company, email, employees, whatsapp, created_at FROM leads ORDER BY created_at DESC'
      );

      return result.rows.map((row) => ({
        name: row.name,
        company: row.company,
        email: row.email,
        employees: row.employees,
        whatsapp: row.whatsapp ?? '',
        createdAt: new Date(row.created_at).toISOString(),
      }));
    } catch (error) {
      console.error('Postgres read failed. Falling back to file storage.', error);
    }
  }

  const leads = await readFileLeads();
  return leads.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
};

export const getStorageMode = () => (databaseUrl ? 'postgres + file-backup' : 'file');
