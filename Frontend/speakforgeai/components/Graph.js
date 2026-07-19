"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Placeholder chart component. Swap `data` for real session history once
// the backend exposes it (e.g. via fetchSessionHistory in utils/api.js).
// Expected data shape: [{ label: "Jul 1", overallScore: 72 }, ...]
const FALLBACK_DATA = [
  { label: "Session 1", overallScore: 58 },
  { label: "Session 2", overallScore: 64 },
  { label: "Session 3", overallScore: 61 },
  { label: "Session 4", overallScore: 70 },
  { label: "Session 5", overallScore: 76 },
  { label: "Session 6", overallScore: 82 },
];

export default function Graph({ data, dataKey = "overallScore", height = 260 }) {
  const chartData = data && data.length > 0 ? data : FALLBACK_DATA;
  const isFallback = !data || data.length === 0;

  return (
    <div>
      {isFallback && (
        <p style={{ fontSize: 12, color: "#00674b", marginBottom: 12 }}>
          Showing sample data — complete a session to see your real progress.
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="rgba(0,103,75,0.12)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#003f2d" }}
            axisLine={{ stroke: "rgba(0,103,75,0.3)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#003f2d" }}
            axisLine={{ stroke: "rgba(0,103,75,0.3)" }}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "#fffdf4",
              border: "1px solid rgba(0,103,75,0.3)",
              borderRadius: 4,
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#00674b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#00674b" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
