import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          background: "#0d1411",
          borderRadius: 14,
          display: "flex",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <polyline
            points="10,46 22,36 32,40 44,22 54,16"
            fill="none"
            stroke="#00c853"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
