import type { ArchiveEntry } from "./types";

const STORAGE_KEY = "retrace-flower-archive";

export function getArchive(): ArchiveEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToArchive(entry: ArchiveEntry): void {
  try {
    const current = getArchive().filter((e) => e.id !== entry.id);
    const next = [entry, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장에 실패해도 화면은 그대로 보여주면 되므로 조용히 넘어갑니다.
  }
}

export function removeFromArchive(id: string): void {
  try {
    const next = getArchive().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // no-op
  }
}
