import { DIVERSE_GARDEN_SUMMARY, FLOWER_IDS, getFlower, type FlowerId } from "./flowers";
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

/** 지금까지 쌓인 꽃들을 바탕으로 한 위로의 말 한두 문장. 가장 많이 나온 꽃이 뚜렷하면
 *  그 꽃의 gardenSummary를, 아직 다양하게만 나왔다면 공통 문구를 돌려줍니다.
 *  결과가 1개 이하면(쌓인 패턴이라 할 게 없어) null을 돌려줍니다. */
export function getGardenSummary(entries: ArchiveEntry[]): string | null {
  if (entries.length < 2) return null;

  const counts = getFlowerCounts(entries);
  const maxCount = Math.max(...FLOWER_IDS.map((id) => counts[id]));
  const topFlowers = FLOWER_IDS.filter((id) => counts[id] === maxCount);

  if (maxCount >= 2 && topFlowers.length === 1) {
    return getFlower(topFlowers[0]).gardenSummary;
  }
  return DIVERSE_GARDEN_SUMMARY;
}

export function removeFromArchive(id: string): void {
  try {
    const next = getArchive().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // no-op
  }
}
