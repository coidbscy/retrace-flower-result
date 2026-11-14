"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FlowerImage from "@/components/FlowerImage";
import { getArchive, getFlowerCounts, getGardenSummary, removeFromArchive } from "@/lib/archive";
import { FLOWER_LIST, getFlower } from "@/lib/flowers";
import type { ArchiveEntry } from "@/lib/types";

export default function ArchivePage() {
  const [entries, setEntries] = useState<ArchiveEntry[] | null>(null);

  useEffect(() => {
    // localStorage는 브라우저에만 있으므로 마운트 후에 읽어옵니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getArchive());
  }, []);

  function handleDelete(id: string) {
    removeFromArchive(id);
    setEntries(getArchive());
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px 64px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        보관함
      </h1>

      {entries !== null && <FlowerGarden entries={entries} />}

      {entries === null && (
        <p style={{ textAlign: "center", color: "var(--color-ink-soft)" }}>
          불러오는 중이에요...
        </p>
      )}

      {entries !== null && entries.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--color-ink-soft)" }}>
          아직 보관된 결과가 없어요.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {entries?.map((entry) => {
          const flower = getFlower(entry.flower);
          const date = new Date(entry.createdAt);
          return (
            <div
              key={entry.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "var(--color-paper)",
                border: "1px solid var(--color-line)",
                borderRadius: 20,
                padding: "14px 16px",
              }}
            >
              <Link
                href={`/r/${entry.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flex: 1,
                  textDecoration: "none",
                  color: "var(--color-ink)",
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <FlowerImage flower={flower} size={56} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{flower.name}</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    {date.toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(entry.id)}
                aria-label="삭제"
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--color-ink-soft)",
                  fontSize: 14,
                  cursor: "pointer",
                  padding: 8,
                }}
              >
                삭제
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/** 6종 꽃을 한눈에 보여주는 요약. 아직 못 만난 꽃은 흐리게, 만난 꽃은 몇 번 만났는지 배지로 표시합니다. */
function FlowerGarden({ entries }: { entries: ArchiveEntry[] }) {
  const counts = getFlowerCounts(entries);
  const collectedCount = FLOWER_LIST.filter((f) => counts[f.id] > 0).length;
  const gardenSummary = getGardenSummary(entries);

  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid var(--color-line)",
        borderRadius: 20,
        padding: "18px 16px",
        marginBottom: 24,
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        나의 꽃밭
      </p>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--color-ink-soft)" }}>
        지금까지 {collectedCount} / {FLOWER_LIST.length}가지 꽃을 만났어요.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}
      >
        {FLOWER_LIST.map((flower) => {
          const count = counts[flower.id];
          return (
            <div key={flower.id} style={{ textAlign: "center" }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  filter: count > 0 ? "none" : "grayscale(1)",
                  opacity: count > 0 ? 1 : 0.35,
                }}
              >
                <FlowerImage flower={flower} size={56} />
                {count > 1 && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      background: "var(--color-yellow)",
                      color: "var(--color-ink)",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 6px",
                      border: "1px solid var(--color-paper)",
                    }}
                  >
                    ×{count}
                  </span>
                )}
              </div>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 12,
                  color: "var(--color-ink-soft)",
                }}
              >
                {flower.name}
              </p>
            </div>
          );
        })}
      </div>

      {gardenSummary && (
        <p
          style={{
            margin: "16px 0 0",
            paddingTop: 14,
            borderTop: "1px solid var(--color-line)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--color-ink)",
          }}
        >
          {gardenSummary}
        </p>
      )}
    </div>
  );
}
