import { supabase } from '@/lib/supabase/client';

export interface SparkItem {
  id: string;
  title?: string;
  text?: string;
  content?: string;
  platform?: 'YouTube' | 'TikTok/Reels' | 'Podcast' | 'Brand/Ad' | 'General' | string;
  type?: 'Concept' | 'Shot List' | 'Hook' | 'General';
  createdAt: number;
}

// 🔒 User-scoped storage key
async function getSparksStorageKey(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';
  return `cinera_sparks_vault_${userId}`;
}

export async function getSparks(): Promise<SparkItem[]> {
  if (typeof window === 'undefined') return [];
  const key = await getSparksStorageKey();
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing sparks', e);
    return [];
  }
}

export async function saveSpark(
  content: string,
  platform: string = 'YouTube',
  type: 'Concept' | 'Shot List' | 'Hook' = 'Concept'
): Promise<SparkItem> {
  const existing = await getSparks();
  const title = content.slice(0, 42).replace(/[\n#*]/g, '') + (content.length > 42 ? '...' : '');

  const newSpark: SparkItem = {
    id: Date.now().toString(),
    title,
    content,
    text: content,
    platform,
    type: content.includes('Shot List') ? 'Shot List' : type,
    createdAt: Date.now(),
  };

  const updated = [newSpark, ...existing];
  if (typeof window !== 'undefined') {
    const key = await getSparksStorageKey();
    localStorage.setItem(key, JSON.stringify(updated));
  }
  return newSpark;
}

export async function deleteSpark(id: string): Promise<void> {
  const existing = await getSparks();
  const updated = existing.filter((s) => s.id !== id);
  if (typeof window !== 'undefined') {
    const key = await getSparksStorageKey();
    localStorage.setItem(key, JSON.stringify(updated));
  }
}