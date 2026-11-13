"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import type { AnswerItem } from "@/lib/types";

const DEFAULT_QUESTIONS = [
  "요즘 마음에 가장 크게 자리하고 있는 생각은 무엇인가요?",
  "지금의 나를 한 문장으로 표현한다면?",
  "앞으로 바라는 모습이 있다면 무엇인가요?",
];

export default function TestPage() {
  const [items, setItems] = useState<AnswerItem[]>(
    DEFAULT_QUESTIONS.map((q) => ({ question: q, answer: "" })),
  );
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function updateItem(index: number, field: keyof AnswerItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function addRow() {
    setItems((prev) => [...prev, { question: "", answer: "" }]);
  }

  function removeRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const answers = items.filter(
      (item) => item.question.trim() && item.answer.trim(),
    );
    if (answers.length === 0) {
      setErrorMessage("질문과 답변을 하나 이상 입력해주세요.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).catch(() => null);
    setSubmitting(false);

    if (!res || !res.ok) {
      setErrorMessage("저장에 실패했어요. 다시 시도해주세요.");
      return;
    }

    const { id } = await res.json();
    setResultUrl(`${window.location.origin}/r/${id}`);
  }

  if (resultUrl) {
    return (
      <main style={{ maxWidth: 420, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>
          저장이 끝났어요
        </h1>
        <p style={{ color: "var(--color-ink-soft)" }}>
          폰으로 QR을 찍어서 결과를 확인해보세요.
        </p>

        <div
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: 24,
            padding: 24,
            display: "inline-block",
            margin: "20px 0",
          }}
        >
          <QRCodeSVG value={resultUrl} size={200} />
        </div>

        <p
          style={{
            wordBreak: "break-all",
            fontSize: 13,
            color: "var(--color-ink-soft)",
          }}
        >
          {resultUrl}
        </p>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href={resultUrl.replace(window.location.origin, "")} style={primaryButtonStyle}>
            이 화면에서 결과 보기
          </Link>
          <button
            onClick={() => {
              setResultUrl(null);
              setItems(DEFAULT_QUESTIONS.map((q) => ({ question: q, answer: "" })));
            }}
            style={secondaryButtonStyle}
          >
            새로 입력하기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px 64px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, textAlign: "center" }}>
        테스트용 입력 페이지
      </h1>
      <p style={{ color: "var(--color-ink-soft)", textAlign: "center", marginBottom: 28 }}>
        원래 사이트와 연결되기 전까지, 질문과 답변을 직접 입력해 결과를 테스트할 수 있어요.
      </p>

      <form onSubmit={handleSubmit}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <input
              value={item.question}
              onChange={(e) => updateItem(i, "question", e.target.value)}
              placeholder="질문"
              style={inputStyle}
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(i, "answer", e.target.value)}
              placeholder="답변"
              rows={3}
              style={{ ...inputStyle, marginTop: 8, resize: "vertical" }}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                style={{ ...secondaryButtonStyle, marginTop: 8, fontSize: 13 }}
              >
                이 질문 삭제
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addRow} style={{ ...secondaryButtonStyle, width: "100%" }}>
          질문 추가하기
        </button>

        {errorMessage && (
          <p style={{ color: "#b5572c", fontSize: 14, marginTop: 12 }}>{errorMessage}</p>
        )}

        <button type="submit" disabled={submitting} style={{ ...primaryButtonStyle, width: "100%", marginTop: 20, border: "none" }}>
          {submitting ? "저장하는 중..." : "제출하고 결과 만들기"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--color-line)",
  background: "var(--color-ivory)",
  fontFamily: "inherit",
  fontSize: 15,
  color: "var(--color-ink)",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 0",
  borderRadius: 999,
  background: "var(--color-yellow)",
  color: "var(--color-ink)",
  fontWeight: 600,
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 0",
  borderRadius: 999,
  background: "var(--color-paper)",
  border: "1px solid var(--color-line)",
  color: "var(--color-ink)",
  textAlign: "center",
  cursor: "pointer",
};
