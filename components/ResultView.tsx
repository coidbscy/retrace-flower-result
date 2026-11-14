"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BudLoading from "@/components/BudLoading";
import FlowerImage from "@/components/FlowerImage";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { addToArchive, getArchive } from "@/lib/archive";
import { FLOWER_IDS, getFlower } from "@/lib/flowers";
import type { ResultRecord } from "@/lib/types";

type Status = "loading" | "analyzing" | "ready" | "notfound" | "error";

interface CollectionInfo {
  repeatCount: number;
  justCompletedSet: boolean;
}

export default function ResultView({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [record, setRecord] = useState<ResultRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | null>(null);
  const savedToArchive = useRef(false);

  async function loadAndAnalyze() {
    setStatus("loading");

    const resultRes = await fetch(`/api/result/${id}`).catch(() => null);
    if (!resultRes || !resultRes.ok) {
      setStatus("notfound");
      return;
    }
    const data: ResultRecord = await resultRes.json();

    if (data.analysis) {
      setRecord(data);
      setStatus("ready");
      return;
    }

    setRecord(data);
    setStatus("analyzing");

    const analyzeRes = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => null);

    if (!analyzeRes || !analyzeRes.ok) {
      const body = await analyzeRes?.json().catch(() => null);
      setErrorMessage(body?.error ?? "잠시 후 다시 시도해주세요.");
      setStatus("error");
      return;
    }

    const { analysis } = await analyzeRes.json();
    setRecord((prev) => (prev ? { ...prev, analysis } : prev));
    setStatus("ready");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAndAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (status === "ready" && record?.analysis && !savedToArchive.current) {
      savedToArchive.current = true;
      const flowerId = record.analysis.flower;

      // 보관함에 넣기 전 상태를 기준으로, 이 꽃을 몇 번째 만나는지와
      // 이번 저장으로 6종을 처음 다 모으게 되는지를 계산합니다.
      const before = getArchive();
      const countBefore = before.filter((e) => e.flower === flowerId).length;
      const wasComplete = FLOWER_IDS.every((fid) =>
        before.some((e) => e.flower === fid),
      );
      const nowComplete = FLOWER_IDS.every(
        (fid) => fid === flowerId || before.some((e) => e.flower === fid),
      );

      addToArchive({
        id,
        flower: flowerId,
        createdAt: record.createdAt,
      });

      setCollectionInfo({
        repeatCount: countBefore + 1,
        justCompletedSet: !wasComplete && nowComplete,
      });
    }
  }, [status, record, id]);

  if (status === "loading" || status === "analyzing") {
    return <BudLoading />;
  }

  if (status === "notfound") {
    return (
      <CenteredMessage>
        결과를 찾을 수 없어요. 링크를 다시 확인해주세요.
      </CenteredMessage>
    );
  }

  if (status === "error" || !record?.analysis) {
    return (
      <CenteredMessage>
        {errorMessage || "꽃을 피우는 데 어려움이 있었어요. 잠시 후 다시 시도해주세요."}
        <div style={{ marginTop: 16 }}>
          <button onClick={loadAndAnalyze} style={retryButtonStyle}>
            다시 시도하기
          </button>
        </div>
      </CenteredMessage>
    );
  }

  const analysis = record.analysis;
  const flower = getFlower(analysis.flower);

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "48px 20px 64px",
      }}
    >
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <FlowerImage flower={flower} />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              margin: "20px 0 6px",
            }}
          >
            {flower.name}
          </h1>
          <p style={{ color: "var(--color-ink-soft)", margin: 0 }}>
            {flower.englishName} · {flower.meaning}
          </p>
          {collectionInfo && collectionInfo.repeatCount >= 2 && (
            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "var(--color-brown)",
              }}
            >
              이 꽃을 {collectionInfo.repeatCount}번째 만나셨어요.
            </p>
          )}
        </div>
      </Reveal>

      {collectionInfo?.justCompletedSet && (
        <Reveal>
          <div
            style={{
              background: "var(--color-yellow-pale)",
              border: "1px solid var(--color-yellow-deep)",
              borderRadius: 20,
              padding: "20px 22px",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 6px",
              }}
            >
              여섯 가지 꽃을 모두 만나셨어요
            </p>
            <p style={{ margin: 0, color: "var(--color-ink-soft)", fontSize: 14 }}>
              그동안의 답변이 피워낸 꽃들이 보관함에 모두 모였어요.
            </p>
          </div>
        </Reveal>
      )}

      <Section title="당신의 답변과 이 꽃">
        <p>{analysis.connection}</p>
      </Section>

      <Section title="당신은 이런 사람이에요">
        <p>{analysis.who}</p>
      </Section>

      <Section title="당신의 장점">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {analysis.strengths.map((s, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="당신이 지닌 가능성">
        <p>{analysis.potential}</p>
      </Section>

      <Reveal>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/archive" style={archiveLinkStyle}>
            보관함 보기
          </Link>
        </div>
      </Reveal>
    </main>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 32px",
        color: "var(--color-ink-soft)",
      }}
    >
      <div>{children}</div>
    </div>
  );
}

const archiveLinkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 28px",
  borderRadius: 999,
  background: "var(--color-yellow)",
  color: "var(--color-ink)",
  fontWeight: 600,
  textDecoration: "none",
};

const retryButtonStyle: React.CSSProperties = {
  padding: "10px 22px",
  borderRadius: 999,
  background: "var(--color-paper)",
  border: "1px solid var(--color-line)",
  color: "var(--color-ink)",
  cursor: "pointer",
};
