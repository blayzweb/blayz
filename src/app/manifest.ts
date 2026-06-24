import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blayz | Crafted with code & culture",
    short_name: "Blayz",
    description:
      "Blayz is a web design & development studio fusing Arabic geometric tradition with code culture. We build websites that build brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF2E2",
    theme_color: "#FF3800",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
