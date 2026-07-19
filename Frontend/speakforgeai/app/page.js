import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Navbar from "../components/Navbar";

export default function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="sf-main">
        <SignedIn>
          {/* Safety net in case middleware/redirect above hasn't fired yet */}
          <p>Redirecting to your dashboard…</p>
        </SignedIn>

        <SignedOut>
          <section
            style={{
              textAlign: "center",
              padding: "72px 16px 48px",
              maxWidth: 680,
              margin: "0 auto",
            }}
          >
            <p className="sf-eyebrow">Speak on the spot. Improve every time.</p>
            <h1
              style={{
                fontSize: 46,
                lineHeight: 1.1,
                margin: "18px 0 20px",
              }}
            >
              Forge sharper speaking skills, one topic at a time.
            </h1>
            <p style={{ fontSize: 17, color: "#3d4b45", marginBottom: 32 }}>
              SpeakForgeAI hands you a random prompt, a short prep window,
              and a timer. Record your answer, get instant AI feedback on
              fluency, clarity, pace, and confidence — and watch your scores
              climb over time.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/register" className="sf-btn">
                Create a free account
              </Link>
              <Link href="/login" className="sf-btn sf-btn-outline">
                I already have one
              </Link>
            </div>
          </section>

          <section className="sf-grid-3" style={{ marginTop: 40 }}>
            <div className="sf-card">
              <p className="sf-card-title">01 — Get a topic</p>
              <p style={{ color: "#3d4b45" }}>
                A fresh prompt is pulled for every session, so you always
                practice thinking on your feet.
              </p>
            </div>
            <div className="sf-card">
              <p className="sf-card-title">02 — Prep, then speak</p>
              <p style={{ color: "#3d4b45" }}>
                A short prep timer, then a speaking timer. Just like a real
                interview or presentation.
              </p>
            </div>
            <div className="sf-card">
              <p className="sf-card-title">03 — Get evaluated</p>
              <p style={{ color: "#3d4b45" }}>
                Your recording is scored on delivery, and every session adds
                a data point to your progress graph.
              </p>
            </div>
          </section>
        </SignedOut>
      </main>
    </>
  );
}
