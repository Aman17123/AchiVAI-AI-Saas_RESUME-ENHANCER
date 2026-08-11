import { ImageResponse } from "next/og";

export const alt = "AchiVAI — AI Resume Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#021F81",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: "#ffffff",
              color: "#021F81",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ color: "#ffffff", fontSize: 64, fontWeight: 700 }}>
            AchiVAI
          </div>
        </div>
        <div style={{ color: "#BFD3F2", fontSize: 32, textAlign: "center" }}>
          Beat the ATS and get hired faster.
        </div>
        <div
          style={{
            color: "#BFD3F2",
            fontSize: 22,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          AI resume analysis · keyword matching · expert feedback
        </div>
      </div>
    ),
    size
  );
}