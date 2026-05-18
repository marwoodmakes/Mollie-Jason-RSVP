import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mollie & Jason - Wedding RSVP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(180deg, #FAF8F5 0%, #F7F3EE 40%, #F2E8E3 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "6px",
              color: "#9B9590",
              marginBottom: 20,
            }}
          >
            You&apos;re invited
          </p>
          <p
            style={{
              fontSize: 80,
              fontWeight: 300,
              color: "#3D3833",
              lineHeight: 1.1,
              marginBottom: 0,
            }}
          >
            Mollie & Jason
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 300,
              fontStyle: "italic",
              color: "#7A756F",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            tying the knot
          </p>
          <div
            style={{
              width: 60,
              height: 1,
              background: "#D4CCE0",
              marginBottom: 30,
              display: "flex",
            }}
          />
          <p
            style={{
              fontSize: 26,
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#3D3833",
            }}
          >
            Saturday, 22nd August 2026
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 300,
              fontStyle: "italic",
              color: "#7A756F",
              marginTop: 10,
            }}
          >
            Bathampton Home Farm, BA2 6TL
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
