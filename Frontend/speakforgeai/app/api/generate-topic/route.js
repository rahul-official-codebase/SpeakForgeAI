import { NextResponse } from "next/server";

// OPTIONAL local mock of the backend's GET /generate-topic endpoint.
// This lets you develop the frontend before the real backend exists.
// Point NEXT_PUBLIC_API_BASE_URL at your real backend when it's ready,
// or leave it empty/local to use this route during development.

const TOPICS = [
  "Describe a time you had to adapt quickly to change.",
  "Should companies allow fully remote work? Defend your position.",
  "Explain a technical concept to a non-technical audience.",
  "Talk about a book or film that changed how you think.",
  "Pitch an idea for improving your local community.",
  "Describe your ideal workday from start to finish.",
  "Should social media platforms verify user identities?",
  "Talk about a mistake you learned the most from.",
];

export async function GET() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  return NextResponse.json({ topic, category: "general" });
}
