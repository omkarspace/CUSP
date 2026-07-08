import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          border: "1px solid rgba(16, 185, 129, 0.15)",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#10b981",
            letterSpacing: "8px",
            textShadow: "0 0 40px rgba(16, 185, 129, 0.3)",
            marginBottom: 16,
          }}
        >
          CUSP
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8b8b9e",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          On the edge of a win
        </div>
      </div>
    ),
    { ...size }
  );
}
