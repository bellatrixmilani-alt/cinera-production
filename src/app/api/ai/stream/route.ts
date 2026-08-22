import { NextRequest } from 'next/server';
import { ai } from '@/lib/ai/client';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { messages, platform, creatorProfile } = await req.json();

    const targetPlatform = platform || 'YouTube';
    const userNiches = creatorProfile?.niches?.join(', ') || 'Storyteller & Filmmaker';
    const userStage = creatorProfile?.audienceTier || 'Nano/Growth Creator';

    const systemInstruction = `You are Cinera: an elite Creative Director and Director of Photography.
Creator: ${userNiches} | Stage: ${userStage} | Platform: ${targetPlatform}
Provide concrete, camera-specific instructions (lighting, focal lengths, hook psychology). Zero fluff.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          const duration = Date.now() - startTime;
          console.log(`[OBSERVABILITY] AI Stream finished in ${duration}ms`);
          controller.close();
        } catch (err) {
          console.error('[OBSERVABILITY] Stream chunk error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('[OBSERVABILITY] Stream initialization failure:', {
      error: error.message,
      durationMs: Date.now() - startTime,
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}