export interface SparkItem {
    id: number;
    text: string;
    date: string;
    platform?: string;
  }
  
  export function saveSpark(text: string, platform?: string): SparkItem[] {
    if (typeof window === 'undefined') return [];
  
    const existingRaw = localStorage.getItem('cinera_recent_sparks');
    const existingSparks: SparkItem[] = existingRaw ? JSON.parse(existingRaw) : [
      { id: 1, text: 'A travel vignette shot entirely at 6 AM.', date: '2 days ago' },
      { id: 2, text: 'Capturing ocean reflections through train glass.', date: 'Yesterday' },
    ];
  
    const newSpark: SparkItem = {
      id: Date.now(),
      text: text.trim(),
      date: 'Just now',
      platform,
    };
  
    const updated = [newSpark, ...existingSparks];
    localStorage.setItem('cinera_recent_sparks', JSON.stringify(updated));
    return updated;
  }
  
  export function getSparks(): SparkItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('cinera_recent_sparks');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 1, text: 'A travel vignette shot entirely at 6 AM.', date: '2 days ago' },
      { id: 2, text: 'Capturing ocean reflections through train glass.', date: 'Yesterday' },
    ];
  }