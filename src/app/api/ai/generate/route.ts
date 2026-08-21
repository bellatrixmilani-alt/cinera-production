import { NextResponse } from 'next/server';
import { ai } from '@/lib/ai/client';
import { CINERA_CREATIVE_CONSTITUTION } from '@/lib/ai/constitution';
import { CineraIdeaResponse } from '@/lib/ai/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, platform, creatorName } = body as {
      prompt: string;
      platform?: string;
      creatorName?: string;
    };

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Please enter a raw thought or story premise first.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
${CINERA_CREATIVE_CONSTITUTION}

CREATOR CONTEXT:
- Creator: ${creatorName || 'Creative Director'}
- Target Platform: ${platform || 'YouTube'}
- Raw Observation / Premise: "${prompt.trim()}"

TASK:
Co-create with the creator. Turn this premise into an elevated, unexpected, ironic-chic visual narrative.

Return ONLY a valid JSON object matching this schema:
{
  "creative_encouragement": "Playful, warm, hype reaction using 'we' (e.g. 'Wait, I am obsessed with this angle...')",
  "common_cliche_warning": "Witty callout of saturated tropes or feed noise to avoid",
  "refined_concept": {
    "logline": "A sharp, unforgettable 1-2 sentence logline",
    "story_hook": "The opening verbal and visual moment that grabs curiosity immediately",
    "unconventional_narrative_angle": "The counter-intuitive story subversion that turns the premise upside down",
    "emotional_core": "The vulnerable, grounding human truth driving the piece",
    "pacing_and_tone": "The rhythm and mood of the story progression"
  }
}
`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text?.trim() || '{}';

    // Strip markdown code fences if returned by the model
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed: CineraIdeaResponse = JSON.parse(rawText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Cinera AI Brain Error:', error);
    return NextResponse.json(
      { error: error.message || 'Creative reasoning pipeline encountered an issue.' },
      { status: 500 }
    );
  }
}