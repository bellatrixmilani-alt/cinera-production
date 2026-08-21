import { supabase } from '@/lib/supabase/client';

export async function getScopedKey(baseKey: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'guest';
  return `cinera_${baseKey}_${userId}`;
}

export async function getScopedItem<T>(baseKey: string, fallback: T): Promise<T> {
  if (typeof window === 'undefined') return fallback;
  const key = await getScopedKey(baseKey);
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setScopedItem<T>(baseKey: string, value: T): Promise<void> {
  if (typeof window === 'undefined') return;
  const key = await getScopedKey(baseKey);
  localStorage.setItem(key, JSON.stringify(value));
}

export async function removeScopedItem(baseKey: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const key = await getScopedKey(baseKey);
  localStorage.removeItem(key);
}