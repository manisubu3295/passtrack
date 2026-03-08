import { promises as fs } from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';
import {
  employeeCountOptions,
  primaryNeedOptions,
  type EmployeeCount,
  type PrimaryNeed,
} from '@/lib/lead-options';

export type LeadPayload = {
  name: string;
  company: string;
  workEmail: string;
  employeeCount: EmployeeCount;
  whatsapp?: string;
  primaryNeed: PrimaryNeed;
  source: string;
};

export type LeadRecord = LeadPayload & {
  timestamp: string;
};

export type LeadValidationResult = {
  valid: boolean;
  error?: string;
};

const dataDirectory = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDirectory, 'leads.json');

const sanitizeDatabaseUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.delete('channel_binding');
    return parsed.toString();
  } catch {
    return trimmed;
  }
};

const getDatabaseUrl = () => {
  const value =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    '';
  return sanitizeDatabaseUrl(value);
};

type GlobalWithLeadPool = typeof globalThis & {
  __leadPool?: Pool;
};

let leadsTableReadyPromise: Promise<void> | null = null;

const getLeadPool = () => {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null;
  }

  const globalScope = globalThis as GlobalWithLeadPool;

  if (!globalScope.__leadPool) {
    globalScope.__leadPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalScope.__leadPool;
};

const ensureLeadsTable = async (pool: Pool) => {
  if (!leadsTableReadyPromise) {
    leadsTableReadyPromise = pool
      .query(`
        CREATE TABLE IF NOT EXISTS leads (
          id BIGSERIAL PRIMARY KEY,
          timestamp TIMESTAMPTZ NOT NULL,
          name TEXT NOT NULL,
          company TEXT NOT NULL,
          work_email TEXT NOT NULL,
          employee_count TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          primary_need TEXT NOT NULL,
          source TEXT NOT NULL
        );
      `)
      .then(() => undefined)
      .catch((error) => {
        leadsTableReadyPromise = null;
        throw error;
      });
  }

  await leadsTableReadyPromise;
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

const validateLeadPayload = (payload: LeadPayload): LeadValidationResult => {
  if (payload.name.trim().length < 2) {
    return { valid: false, error: 'Full Name must be at least 2 characters.' };
  }

  if (payload.company.trim().length < 2) {
    return { valid: false, error: 'Company Name must be at least 2 characters.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.workEmail)) {
    return { valid: false, error: 'Please enter a valid Work Email.' };
  }

  if (!employeeCountOptions.includes(payload.employeeCount)) {
    return { valid: false, error: 'Please select a valid Company Size.' };
  }

  if (!primaryNeedOptions.includes(payload.primaryNeed)) {
    return { valid: false, error: 'Please select a valid Primary Need.' };
  }

  if (normalizeWhatsapp(payload.whatsapp) === null) {
    return {
      valid: false,
      error: 'WhatsApp number format is invalid. Use 90356479 or +6590356479.',
    };
  }

  if (!payload.source.trim()) {
    return { valid: false, error: 'Lead source is missing.' };
  }

  return { valid: true };
};

const toLeadRecord = (payload: LeadPayload): LeadRecord => ({
  name: payload.name.trim(),
  company: payload.company.trim(),
  workEmail: payload.workEmail.trim().toLowerCase(),
  employeeCount: payload.employeeCount,
  whatsapp: normalizeWhatsapp(payload.whatsapp) ?? '',
  primaryNeed: payload.primaryNeed,
  source: payload.source.trim(),
  timestamp: new Date().toISOString(),
});

const logStructuredError = (destination: string, error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(
    JSON.stringify({
      event: 'lead_delivery_failed',
      destination,
      message,
    })
  );
};

const sendToWebhook = async (lead: LeadRecord) => {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned HTTP ${response.status}`);
    }

    return true;
  } catch (error) {
    logStructuredError('webhook', error);
    return false;
  }
};

const buildLeadEmailText = (lead: LeadRecord) => {
  return [
    'New PassTrack early access lead',
    '',
    `Timestamp: ${lead.timestamp}`,
    `Full Name: ${lead.name}`,
    `Company Name: ${lead.company}`,
    `Work Email: ${lead.workEmail}`,
    `Company Size: ${lead.employeeCount}`,
    `WhatsApp: ${lead.whatsapp || '-'}`,
    `Primary Need: ${lead.primaryNeed}`,
    `Source: ${lead.source}`,
  ].join('\n');
};

const sendViaResend = async (lead: LeadRecord, toEmail: string) => {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return false;
  }

  const from = process.env.ADMIN_NOTIFICATION_FROM ?? 'PassTrack <onboarding@resend.dev>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject: `New PassTrack Lead • ${lead.company}`,
        text: buildLeadEmailText(lead),
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend returned HTTP ${response.status}`);
    }

    return true;
  } catch (error) {
    logStructuredError('email_resend', error);
    return false;
  }
};

const sendViaSmtp = async (lead: LeadRecord, toEmail: string) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return false;
  }

  const smtpPort = Number(port);
  if (!Number.isFinite(smtpPort)) {
    logStructuredError('email_smtp', new Error('SMTP_PORT is invalid.'));
    return false;
  }

  const from = process.env.ADMIN_NOTIFICATION_FROM ?? process.env.SMTP_FROM ?? user;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `New PassTrack Lead • ${lead.company}`,
      text: buildLeadEmailText(lead),
    });

    return true;
  } catch (error) {
    logStructuredError('email_smtp', error);
    return false;
  }
};

const sendLeadEmail = async (lead: LeadRecord) => {
  const toEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!toEmail) {
    return false;
  }

  const resendDelivered = await sendViaResend(lead, toEmail);
  if (resendDelivered) {
    return true;
  }

  return sendViaSmtp(lead, toEmail);
};

const saveLeadToDatabase = async (lead: LeadRecord) => {
  const pool = getLeadPool();
  if (!pool) {
    return false;
  }

  try {
    await ensureLeadsTable(pool);
    await pool.query(
      `
        INSERT INTO leads (
          timestamp,
          name,
          company,
          work_email,
          employee_count,
          whatsapp,
          primary_need,
          source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        lead.timestamp,
        lead.name,
        lead.company,
        lead.workEmail,
        lead.employeeCount,
        lead.whatsapp || '',
        lead.primaryNeed,
        lead.source,
      ]
    );
    return true;
  } catch (error) {
    logStructuredError('database', error);
    return false;
  }
};

const saveLeadLocallyForDevelopment = async (lead: LeadRecord) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  await fs.mkdir(dataDirectory, { recursive: true });

  let existing: LeadRecord[] = [];
  try {
    const content = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(content) as LeadRecord[];
    existing = Array.isArray(parsed) ? parsed : [];
  } catch {
    existing = [];
  }

  existing.push(lead);
  await fs.writeFile(dataFile, JSON.stringify(existing, null, 2), 'utf8');
};

export const submitLead = async (payload: LeadPayload) => {
  const validation = validateLeadPayload(payload);
  if (!validation.valid) {
    return { ok: false, status: 400 as const, error: validation.error ?? 'Invalid payload.' };
  }

  const lead = toLeadRecord(payload);

  const [webhookSuccess, emailSuccess, databaseSuccess] = await Promise.all([
    sendToWebhook(lead),
    sendLeadEmail(lead),
    saveLeadToDatabase(lead),
  ]);

  if (webhookSuccess || emailSuccess || databaseSuccess) {
    try {
      await saveLeadLocallyForDevelopment(lead);
    } catch (error) {
      logStructuredError('local_dev_backup', error);
    }

    return { ok: true, status: 200 as const };
  }

  return {
    ok: false,
    status: 500 as const,
    error:
      'Lead delivery failed. Configure DATABASE_URL (or POSTGRES_URL) and/or LEAD_WEBHOOK_URL and/or ADMIN_NOTIFICATION_EMAIL with RESEND_API_KEY or SMTP settings.',
  };
};

export const getLeads = async (): Promise<LeadRecord[]> => {
  const pool = getLeadPool();

  if (pool) {
    try {
      await ensureLeadsTable(pool);
      const result = await pool.query<{
        timestamp: Date;
        name: string;
        company: string;
        work_email: string;
        employee_count: string;
        whatsapp: string;
        primary_need: string;
        source: string;
      }>(
        `
          SELECT
            timestamp,
            name,
            company,
            work_email,
            employee_count,
            whatsapp,
            primary_need,
            source
          FROM leads
          ORDER BY timestamp DESC;
        `
      );

      return result.rows.map((row) => ({
        timestamp: row.timestamp.toISOString(),
        name: row.name,
        company: row.company,
        workEmail: row.work_email,
        employeeCount: row.employee_count as EmployeeCount,
        whatsapp: row.whatsapp,
        primaryNeed: row.primary_need as PrimaryNeed,
        source: row.source,
      }));
    } catch (error) {
      logStructuredError('database_read', error);
      if (process.env.NODE_ENV === 'production') {
        return [];
      }
    }
  }

  try {
    const content = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(content) as LeadRecord[];
    const leads = Array.isArray(parsed) ? parsed : [];
    return leads.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  } catch {
    return [];
  }
};

export const getStorageMode = () =>
  getDatabaseUrl()
    ? 'postgres (neon) + optional webhook/email'
    : process.env.NODE_ENV === 'production'
      ? 'email/webhook destinations'
      : 'local-file (dev) + destinations';
