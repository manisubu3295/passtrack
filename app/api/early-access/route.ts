import { NextRequest, NextResponse } from 'next/server';
import { getLeadValidationError, LeadPayload, saveLead } from '@/lib/leads';

export async function POST(request: NextRequest) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const validationError = getLeadValidationError(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await saveLead(body);
  } catch (error) {
    console.error('Lead submission failed.', error);
    const reason = error instanceof Error ? error.message : 'Unknown error.';
    return NextResponse.json({ error: `Unable to save lead: ${reason}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
