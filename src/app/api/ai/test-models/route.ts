import { NextResponse } from 'next/server';
import { ai } from '@/lib/ai/client';

export async function GET() {
  try {
    // If using the official @google/genai SDK:
    const modelsResponse = await (ai.models as any).list?.() || [];
    return NextResponse.json({ success: true, models: modelsResponse });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}