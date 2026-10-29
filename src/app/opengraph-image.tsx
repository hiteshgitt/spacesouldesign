import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const dir = join(process.cwd(), "src/assets/og");
  const [display, mono] = await Promise.all([
    readFile(join(dir, "ArchivoBlack-Regular.ttf")),
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
  ]);

  const grid =
    "linear-gradient(rgba(90,102,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(90,102,255,0.14) 1px, transparent 1px)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#04051a",
          backgroundImage: grid,
          backgroundSize: "60px 60px",
          color: "#eeeae2",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#b9b6ae", letterSpacing: 2 }}>
          <span>SPACE &amp; SOUL DESIGN</span>
          <span>SHEET 01 / EXHIBITION · EVENTS · FABRICATION</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo Black", fontSize: 112, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>WE BUILD</span>
          <span>SPACES THAT</span>
          <span style={{ color: "#5a66ff" }}>MOVE PEOPLE.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#b9b6ae", borderTop: "1px solid rgba(238,234,226,0.25)", paddingTop: 20 }}>
          <span>{site.url.replace("https://", "")}</span>
          <span>{site.tagline.toUpperCase()}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: display, style: "normal", weight: 400 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
