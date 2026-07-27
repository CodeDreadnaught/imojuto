"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f7f4ef", color: "#27241f", fontFamily: "Montserrat, Segoe UI, Arial, sans-serif" }}>
        <main
          style={{
            display: "grid",
            minHeight: "100vh",
            placeItems: "center",
            padding: "24px",
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: "640px",
              boxSizing: "border-box",
              border: "1px solid #ded5c5",
              borderRadius: "10px",
              background: "#fffaf1",
              padding: "clamp(24px, 5vw, 40px)",
              textAlign: "center",
              boxShadow: "0 24px 90px rgba(39,36,31,0.1)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: "grid",
                width: "56px",
                height: "56px",
                margin: "0 auto",
                placeItems: "center",
                borderRadius: "10px",
                background: "#f6ded9",
                color: "#9f2f2f",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              !
            </div>
            <p style={{ margin: "20px 0 0", color: "#8a7a67", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
              System error
            </p>
            <h1 style={{ margin: "8px 0 0", color: "#27241f", fontSize: "clamp(30px, 7vw, 42px)", lineHeight: 1.08, fontWeight: 700 }}>
              Imojuto could not load this view.
            </h1>
            <p style={{ maxWidth: "520px", margin: "14px auto 0", color: "#655c50", fontSize: "14px", lineHeight: 1.7 }}>
              Try again now, or return to the dashboard and continue from a stable workspace page.
            </p>
            {error.digest ? <p style={{ margin: "16px 0 0", color: "#8a7a67", fontSize: "12px" }}>Reference: {error.digest}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{
                  minHeight: "44px",
                  cursor: "pointer",
                  border: 0,
                  borderRadius: "8px",
                  background: "#1d4f43",
                  color: "#fffaf1",
                  padding: "0 18px",
                  font: "inherit",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Try again
              </button>
              <a
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  minHeight: "44px",
                  alignItems: "center",
                  border: "1px solid #d8cebe",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.72)",
                  color: "#27241f",
                  padding: "0 18px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Dashboard
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
