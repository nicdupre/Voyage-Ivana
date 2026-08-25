import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f766e",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
          <path d="M21.5 2.5l-8.5 19-3-7.5-7.5-3z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
