import { NextRequest, NextResponse } from 'next/server';
import { isValidLeadPayload, LeadPayload, saveLead } from '@/lib/leads';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LeadPayload;

  if (!isValidLeadPayload(body)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await saveLead(body);

  return NextResponse.json({ ok: true });
}
