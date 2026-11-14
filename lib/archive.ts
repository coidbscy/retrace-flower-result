import { FLOWER_IDS, type FlowerId } from "./flowers";
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

/** 꽃마다 지금까지 몇 번 만났는지. 아직 못 만난 꽃도 0으로 포함해서 돌려줍니다. */
export function getFlowerCounts(entries: ArchiveEntry[]): Record<FlowerId, number> {
  const counts = Object.fromEntries(FLOWER_IDS.map((id) => [id, 0])) as Record<FlowerId, number>;
  for (const entry of entries) {
    counts[entry.flower] = (counts[entry.flower] ?? 0) + 1;
  }
  return counts;
}

export function removeFromArchive(id: string): void {
  try {
    const next = getArchive().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // no-op
  }
}
