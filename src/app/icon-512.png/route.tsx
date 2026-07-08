import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#161514",
        }}
      >
        <svg
          width="512"
          height="512"
          viewBox="0 0 512 512"
          fill="none"
          style={{ display: "block" }}
        >
          {/* Background */}
          <rect width="512" height="512" fill="#161514" />
          {/* Gold Border */}
          <rect
            x="24"
            y="24"
            width="464"
            height="464"
            rx="104"
            stroke="#D4A44A"
            strokeWidth="12"
            strokeOpacity="0.8"
          />
          {/* Inner Teal Outline */}
          <rect
            x="40"
            y="40"
            width="432"
            height="432"
            rx="88"
            fill="#1C1B1A"
            stroke="#1A8A8E"
            strokeWidth="6"
            strokeOpacity="0.2"
          />
          {/* C Shape */}
          <path
            d="M350 180 C320 135, 200 135, 170 200 C135 275, 170 365, 240 375 C310 380, 335 345, 350 315"
            stroke="#1A8A8E"
            strokeWidth="44"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gold Dot */}
          <circle cx="350" cy="245" r="16" fill="#D4A44A" />
        </svg>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
