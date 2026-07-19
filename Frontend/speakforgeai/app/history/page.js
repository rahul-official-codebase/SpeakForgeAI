"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";
import { fetchSessionHistory } from "../../utils/api";

const MOCK_SESSIONS = [
  {
    id: "mock-1",
    topic: "Describe a time you had to adapt quickly to change.",
    date: "2026-07-10",
    overallScore: 76,
    fluency: 74,
    clarity: 80,
    pace: 70,
    confidence: 78,
    feedback:
      "Good structure with a clear beginning and end. Watch your pace during the middle section — a few rushed sentences made key details harder to follow.",
    audioUrl: null,
  },
  {
    id: "mock-2",
    topic: "Should companies allow fully remote work?",
    date: "2026-07-13",
    overallScore: 82,
    fluency: 85,
    clarity: 81,
    pace: 79,
    confidence: 83,
    feedback:
      "Strong, confident delivery with minimal filler words. Consider adding a concrete example to strengthen your argument.",
    audioUrl: null,
  },
  {
    id: "mock-3",
    topic: "Explain a technical concept to a non-technical audience.",
    date: "2026-07-16",
    overallScore: 79,
    fluency: 77,
    clarity: 84,
    pace: 75,
    confidence: 78,
    feedback:
      "Clear analogies made the concept easy to follow. Slow down slightly at the start — the first few seconds felt rushed.",
    audioUrl: null,
  },
];

export default function HistoryPage() {
  const { user } = useUser();
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await fetchSessionHistory(user?.id);
      if (!active) return;
      if (data && Array.isArray(data.sessions) && data.sessions.length > 0) {
        setSessions(data.sessions);
        setUsingMock(false);
      } else {
        setSessions(MOCK_SESSIONS);
        setUsingMock(true);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  return (
    <>
      <Navbar />
      <main className="sf-main">
        <div style={{ marginBottom: 24 }}>
          <p className="sf-eyebrow">History</p>
          <h1 style={{ fontSize: 28, marginTop: 6 }}>Past recordings & results</h1>
        </div>

        {loading && <p style={{ color: "#3d4b45" }}>Loading your sessions…</p>}

        {!loading && sessions?.length === 0 && (
          <div className="sf-empty">
            <p>No sessions yet. Head to a new session to get started.</p>
          </div>
        )}

        {!loading && sessions?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sessions.map((s) => {
              const expanded = expandedId === s.id;
              return (
                <div key={s.id} className="sf-card">
                  <button
                    onClick={() => setExpandedId(expanded ? null : s.id)}
                    style={{
                      all: "unset",
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16 }}>{s.topic}</p>
                      <p style={{ fontSize: 12, color: "#3d4b45", marginTop: 4 }}>
                        {s.date}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="sf-badge">{s.overallScore}</span>
                      <span style={{ color: "#00674b" }}>{expanded ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {expanded && (
                    <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--sf-line)" }}>
                      <div className="sf-grid-3" style={{ marginBottom: 16 }}>
                        {["fluency", "clarity", "pace", "confidence"]
                          .filter((key) => s[key] !== undefined)
                          .map((key) => (
                            <div
                              key={key}
                              style={{
                                border: "1px solid var(--sf-line)",
                                borderRadius: 4,
                                padding: "10px 12px",
                              }}
                            >
                              <p style={{ fontSize: 11, textTransform: "capitalize", color: "#00674b" }}>
                                {key}
                              </p>
                              <p style={{ fontSize: 18, fontWeight: 700 }}>{s[key]}</p>
                            </div>
                          ))}
                      </div>

                      {s.feedback && (
                        <p style={{ color: "#3d4b45", marginBottom: 14 }}>{s.feedback}</p>
                      )}

                      {s.audioUrl ? (
                        <audio controls src={s.audioUrl} style={{ width: "100%" }} />
                      ) : (
                        <p style={{ fontSize: 12, color: "#3d4b45" }}>
                          Audio playback unavailable for this sample entry.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {usingMock && !loading && (
          <p style={{ fontSize: 12, color: "#00674b", marginTop: 16 }}>
            Showing sample data — connect a backend history endpoint (see
            utils/api.js) to display real recordings.
          </p>
        )}
      </main>
    </>
  );
}
