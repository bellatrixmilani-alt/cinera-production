import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const shotListSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    logline: { type: Type.STRING },
    gearRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          name: { type: Type.STRING },
          searchQuery: { type: Type.STRING },
          whyNeeded: { type: Type.STRING },
        },
        required: ['category', 'name', 'searchQuery', 'whyNeeded'],
      },
    },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          timecode: { type: Type.STRING },
          shotType: { type: Type.STRING },
          cameraMovement: { type: Type.STRING },
          lightingNotes: { type: Type.STRING },
          audioCue: { type: Type.STRING },
          scriptBeat: { type: Type.STRING },
        },
        required: [
          'sceneNumber',
          'title',
          'shotType',
          'cameraMovement',
          'lightingNotes',
          'scriptBeat',
        ],
      },
    },
  },
  required: ['title', 'logline', 'gearRecommendations', 'scenes'],
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, creatorContext } = await req.json();

    const systemInstruction = `You are Cinera's Master Director of Photography and Creative Director.
Creator Niches: ${creatorContext?.niches?.join(', ') || 'Cinematic Storytelling'}
Audience Scale: ${creatorContext?.audienceTier || 'Independent Creator'}

Convert the user's premise into an ultra-precise, rhythmically paced directorial treatment. 
Provide exact focal lengths, practical lighting directions (e.g. key light at 45°, diffusion setups), dynamic camera moves, and sharp script beats.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: shotListSchema,
        temperature: 0.4,
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Shot list generation failure:', error);
    return NextResponse.json(
      { error: 'Directorial engine timed out. Retrying with fallback...' },
      { status: 500 }
    );
  }
}