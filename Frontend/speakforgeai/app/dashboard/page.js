"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";
import Graph from "../../components/Graph";
import { fetchSessionHistory } from "../../utils/api";

const MOCK_SESSIONS = [
  {
    id: "mock-1",
    topic: "Describe a time you had to adapt quickly to change.",
    date: "2026-07-10",
    overallScore: 76,
  },
  {
    id: "mock-2",
    topic: "Should companies allow fully remote work?",
    date: "2026-07-13",
    overallScore: 82,
  },
  {
    id: "mock-3",
    topic: "Explain a technical concept to a non-technical audience.",
    date: "2026-07-16",
    overallScore: 79,
  },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [sessions, setSessions] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await fetchSessionHistory(user?.id);
      console.log(data)
      if (!active) return;
      if (data && Array.isArray(data.sessions) && data.sessions.length > 0) {
        setSessions(data.sessions);
        setUsingMock(false);
      } else {
        setSessions(MOCK_SESSIONS);
        setUsingMock(true);
      }
      setLoadingHistory(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const graphData = (sessions || []).map((s, i) => ({
    label: s.date ? new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : `Session ${i + 1}`,
    overallScore: s.overallScore,
  }));

  const totalSessions = sessions?.length ?? 0;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
            totalSessions
        )
      : 0;
  const bestScore =
    totalSessions > 0
      ? Math.max(...sessions.map((s) => s.overallScore || 0))
      : 0;

  return (
    <>
      <Navbar />
      <main className="sf-main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <p className="sf-eyebrow">Dashboard</p>
            <h1 style={{ fontSize: 30, marginTop: 6 }}>
              Welcome back{isLoaded && user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
          </div>
          <Link href="/session" className="sf-btn">
            Start new session
          </Link>
        </div>

        <section className="sf-grid-3" style={{ marginBottom: 24 }}>
          <div className="sf-card">
            <p className="sf-card-title">Sessions completed</p>
            <p style={{ fontSize: 32, fontWeight: 700 }}>{totalSessions}</p>
          </div>
          <div className="sf-card">
            <p className="sf-card-title">Average score</p>
            <p style={{ fontSize: 32, fontWeight: 700 }}>{avgScore || "—"}</p>
          </div>
          <div className="sf-card">
            <p className="sf-card-title">Best score</p>
            <p style={{ fontSize: 32, fontWeight: 700 }}>{bestScore || "—"}</p>
          </div>
        </section>

        <section className="sf-card" style={{ marginBottom: 24 }}>
          <p className="sf-card-title">Progress over time</p>
          {loadingHistory ? (
            <p style={{ color: "#3d4b45" }}>Loading your progress…</p>
          ) : (
            <Graph data={usingMock ? [] : graphData} />
          )}
        </section>

        <section className="sf-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <p className="sf-card-title" style={{ marginBottom: 0 }}>
              Recent recordings
            </p>
            <Link href="/history" style={{ fontSize: 13, fontWeight: 600, color: "#00674b" }}>
              View all →
            </Link>
          </div>

          {loadingHistory && <p style={{ color: "#3d4b45" }}>Loading…</p>}

          {!loadingHistory && totalSessions === 0 && (
            <div className="sf-empty">
              <p>No recordings yet. Start your first session to see results here.</p>
            </div>
          )}

          {!loadingHistory && totalSessions > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid var(--sf-line)",
                    borderRadius: 4,
                    padding: "12px 16px",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>{s.topic}</p>
                    <p style={{ fontSize: 12, color: "#3d4b45" }}>{s.date}</p>
                  </div>
                  <span className="sf-badge">{s.overallScore}</span>
                </div>
              ))}
            </div>
          )}

          {usingMock && !loadingHistory && (
            <p style={{ fontSize: 12, color: "#00674b", marginTop: 14 }}>
              Showing sample recordings — connect the backend&apos;s history
              endpoint to replace this with real data.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
