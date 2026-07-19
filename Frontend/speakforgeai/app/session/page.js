"use client";

import Navbar from "../../components/Navbar";
import SessionRecorder, {
  DEFAULT_PREP_SECONDS,
  DEFAULT_SPEAK_SECONDS,
} from "../../components/SessionRecorder";

export default function SessionPage() {
  return (
    <>
      <Navbar />
      <main className="sf-main" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 24 }}>
          <p className="sf-eyebrow">Speaking session</p>
          <h1 style={{ fontSize: 28, marginTop: 6 }}>Practice on a random topic</h1>
          <p style={{ color: "#3d4b45", marginTop: 8 }}>
            You&apos;ll have {DEFAULT_PREP_SECONDS / 60} minute
            {DEFAULT_PREP_SECONDS / 60 === 1 ? "" : "s"} to prepare and{" "}
            {DEFAULT_SPEAK_SECONDS / 60} minute
            {DEFAULT_SPEAK_SECONDS / 60 === 1 ? "" : "s"} to speak. Your
            microphone will be requested when recording begins.
          </p>
        </div>

        <SessionRecorder
          prepSeconds={DEFAULT_PREP_SECONDS}
          speakSeconds={DEFAULT_SPEAK_SECONDS}
        />
      </main>
    </>
  );
}
