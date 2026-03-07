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
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  const employeesNum = Number(payload.employees);
  const whatsapp = payload.whatsapp?.trim() ?? '';
  const validWhatsapp = whatsapp.length === 0 || /^[+\d\s()-]{7,20}$/.test(whatsapp);

  return (
    payload.name.trim().length > 1 &&
    payload.company.trim().length > 1 &&
    validEmail &&
    Number.isFinite(employeesNum) &&
    employeesNum > 0 &&
    validWhatsapp
  );
};

const toRecord = (payload: LeadPayload): LeadRecord => ({
  name: payload.name.trim(),
  company: payload.company.trim(),
  email: payload.email.trim().toLowerCase(),
  employees: payload.employees,
  whatsapp: payload.whatsapp?.trim() ?? '',
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

  await writeFileLead(newLead);

  if (pool) {
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
  }
};

export const getLeads = async (): Promise<LeadRecord[]> => {
  const pool = getPool();

  if (pool) {
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
  }

  const leads = await readFileLeads();
  return leads.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
};

export const getStorageMode = () => (databaseUrl ? 'postgres + file-backup' : 'file');
