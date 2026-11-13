export default function BudLoading() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, var(--color-yellow-pale), var(--color-yellow))",
          animation: "float-y 1.8s ease-in-out infinite, glow 2.4s ease-out infinite",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 18,
          color: "var(--color-ink-soft)",
        }}
      >
        꽃이 피어나는 중이에요
      </p>
    </div>
  );
}
