import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 24px",
        gap: 16,
      }}
    >
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>
        RE:TRACE · 꽃 결과
      </h1>
      <p style={{ color: "var(--color-ink-soft)", maxWidth: 360 }}>
        RE:TRACE에서 답변을 마친 뒤 받은 QR을 찍으면, 이곳에서 당신의 답변이
        피워낸 꽃을 확인할 수 있어요.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Link
          href="/test"
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            background: "var(--color-yellow)",
            color: "var(--color-ink)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          테스트 페이지
        </Link>
        <Link
          href="/archive"
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: "1px solid var(--color-line)",
            color: "var(--color-ink)",
            textDecoration: "none",
          }}
        >
          보관함
        </Link>
      </div>
    </main>
  );
}
