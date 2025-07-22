import { Entry } from '../types';

const STORAGE_KEY = 'reflection-timeline-entries';

export function saveEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadEntries(): Entry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt)
    }));
  } catch {
    return [];
  }
}

export function addEntry(entry: Entry): Entry[] {
  const entries = loadEntries();
  const newEntries = [entry, ...entries];
  saveEntries(newEntries);
  return newEntries;
}

export function deleteEntry(id: string): Entry[] {
  const entries = loadEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  saveEntries(filtered);
  return filtered;
}
export function getTodaysEntry(): Entry | null {
  const entries = loadEntries();
  const today = new Date().toISOString().split('T')[0];
  return entries.find(entry => entry.date === today) || null;
}

export function canCreateToday(): boolean {
  return getTodaysEntry() === null;
}