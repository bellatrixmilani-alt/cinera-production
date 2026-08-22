import { NextResponse } from 'next/server';
import { ai } from '@/lib/ai/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, prompt, platform, creatorProfile, creatorStyle } = body as {
      messages?: ChatMessage[];
      prompt?: string;
      platform?: string;
      creatorProfile?: {
        niches?: string[];
        audienceTier?: string;
      };
      creatorStyle?: string;
    };

    // Normalize messages array
    let normalizedMessages: ChatMessage[] = [];
    if (messages && Array.isArray(messages) && messages.length > 0) {
      normalizedMessages = messages.filter((m) => m.content && m.content.trim() !== '');
    } else if (prompt && prompt.trim()) {
      normalizedMessages = [{ role: 'user', content: prompt.trim() }];
    }

    if (normalizedMessages.length === 0) {
      return NextResponse.json({ error: 'Please enter a message or idea first.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing in .env.local' }, { status: 500 });
    }

    const targetPlatform = platform || 'YouTube';
    const userNiches = creatorProfile?.niches?.length
      ? creatorProfile.niches.join(', ')
      : (creatorStyle || 'Creator & Storyteller');
    const userStage = creatorProfile?.audienceTier || 'Nano/Growth Creator';

    // PLATFORM-SPECIFIC PSYCHOLOGY
    const platformInstructions: Record<string, string> = {
      YouTube: `
- Focus on: 0-5s cold open hooks, curiosity gaps, A/B thumbnail tension, mid-video retention payoff curves, and dynamic A/B roll transitions.
- Tone: Strategic, cinematic, pacing-obsessed.`,
      'TikTok/Reels': `
- Focus on: 0-2s visual pattern interrupts, trending audio soundbites, on-screen text hooks, loop-seamless endings, and punchy micro-scripts.
- Tone: Snappy, high-velocity, thumb-stopping.`,
      Podcast: `
- Focus on: Conversational narrative arcs, intimate microphone tone, unscripted debate questions, chapter titles, and 30-second audio teaser clips.
- Tone: Deep, inquisitive, flow-driven.`,
      'Brand/Ad': `
- Focus on: Problem-Agitation-Solution (PAS) hooks, authentic creator UGC feel, high-converting calls-to-action (CTA), and product benefit demonstrations without sounding like a boring commercial.
- Tone: Persuasive, punchy, high-conversion.`,
    };

    const activePlatformRules = platformInstructions[targetPlatform] || platformInstructions.YouTube;

    const systemInstruction = `
You are Cinera: an elite Creative Director, Content Strategist, and Co-Producer in a live session with a creator.

CREATOR IDENTITY MATRIX:
- Primary Niche(s): ${userNiches}
- Audience Stage: ${userStage}
- Target Platform: ${targetPlatform}

STRICT NICHE & STAGE ADAPTATION RULES:
1. Every hook angle, title suggestion, pacing note, and visual advice MUST be calibrated strictly for a creator in the "${userNiches}" arena.
2. If Gaming/Esports: Focus on stream pacing, moment-to-moment stakes, and gameplay narrative hooks.
3. If Tech/Coding: Focus on direct value teardowns, proof of concept, and macro close-ups.
4. If Lifestyle/Fitness/Food: Focus on sensory hooks, relatable friction, and aesthetic contrast.
5. Calibrate execution complexity to a ${userStage} (actionable steps with realistic resources).

PLATFORM PSYCHOLOGY:
${activePlatformRules}

YOUR STYLE:
1. Energetic, perceptive creative director vibe.
2. Direct, witty, grounded. No empty fluff words.
3. Offer 2-3 actionable angles, then ask the single next question that locks down the plan.
`;

   // Slice the last 8 messages from normalizedMessages to prevent token inflation
   const recentMessages = normalizedMessages.slice(-8);

   const contents = recentMessages.map((msg) => ({
     role: msg.role === 'user' ? 'user' : 'model',
     parts: [{ text: msg.content }],
   }));

   const response = await ai.models.generateContent({
     model: 'gemini-3.6-flash',
     contents: contents as any,
     config: {
       systemInstruction,
       maxOutputTokens: 1024,
       temperature: 0.7,
     },
   });

    const reply = response.text || "Let's explore that angle further.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Cinera Manager API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing creative dialogue.' },
      { status: 500 }
    );
  }
}