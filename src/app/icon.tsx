import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#0a0a0f",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 16,
          color: "#10b981",
          letterSpacing: "0.5px",
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
