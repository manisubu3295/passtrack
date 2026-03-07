import { NextResponse } from 'next/server';
import { getLeads, getStorageMode } from '@/lib/leads';

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({
    storage: getStorageMode(),
    count: leads.length,
    leads,
  });
}
