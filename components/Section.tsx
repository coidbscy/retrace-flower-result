import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section
        style={{
          background: "var(--color-paper)",
          border: "1px solid var(--color-line)",
          borderRadius: 24,
          padding: "28px 24px",
          marginBottom: 20,
        }}
      >
        {title && (
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-brown)",
              margin: "0 0 14px",
            }}
          >
            {title}
          </h2>
        )}
        <div style={{ color: "var(--color-ink)" }}>{children}</div>
      </section>
    </Reveal>
  );
}
