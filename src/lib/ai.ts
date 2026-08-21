import { CineraIdeaResponse } from '@/lib/ai/schemas';

interface RefineIdeaParams {
  prompt: string;
  platform: string;
  creatorName?: string;
  selectedOptionId?: string;
  conversationHistory?: { role: 'user' | 'cinera'; text: string }[];
}

export async function refineIdeaWithCinera({
  prompt,
  platform,
  creatorName,
  selectedOptionId,
  conversationHistory,
}: RefineIdeaParams): Promise<CineraIdeaResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch('/api/ai/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, platform, creatorName, selectedOptionId, conversationHistory }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Cinera took a bit long thinking. Let’s try once more.');
    }
    throw new Error(error.message || 'Something interrupted our brainstorm.');
  }
}