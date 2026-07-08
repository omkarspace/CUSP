import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CUSP Casino Wordle",
    short_name: "CUSP",
    description: "On the edge of a win — every guess is a transaction.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#161514",
    theme_color: "#0D7377",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
