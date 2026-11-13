"use client";

import { useState } from "react";
import type { Flower } from "@/lib/flowers";

export default function FlowerImage({
  flower,
  size = 180,
}: {
  flower: Flower;
  size?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: imageFailed
          ? "radial-gradient(circle at 35% 30%, var(--color-yellow-pale), var(--color-paper))"
          : "var(--color-paper)",
        border: "1px solid var(--color-line)",
        boxShadow: "0 10px 26px -14px rgba(43, 36, 22, 0.4)",
        animation: "bloom 1.1s ease-out",
      }}
    >
      {imageFailed ? (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.16,
            color: "var(--color-brown)",
            letterSpacing: "0.02em",
          }}
        >
          {flower.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/flowers/${flower.id}.png`}
          alt={flower.name}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}
