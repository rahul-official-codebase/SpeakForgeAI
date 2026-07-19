import { NextResponse } from "next/server";

// OPTIONAL local mock of the backend's POST /evaluate endpoint.
// Accepts the same multipart/form-data payload utils/api.js sends
// (audio, topic, prepSeconds, speakSeconds, durationSeconds) and returns
// a randomized score so the UI can be exercised end-to-end without a
// real evaluation service.

function randomScore(min = 55, max = 95) {
  return Math.round(min + Math.random() * (max - min));
}

export async function POST(request) {
  const formData = await request.formData();
  const topic = formData.get("topic") || "";

  // Simulate processing latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const fluency = randomScore();
  const clarity = randomScore();
  const pace = randomScore();
  const confidence = randomScore();
  const overallScore = Math.round(
    (fluency + clarity + pace + confidence) / 4
  );

  return NextResponse.json({
    overallScore,
    fluency,
    clarity,
    pace,
    confidence,
    feedback: `Mock evaluation for "${topic}". Replace this route with your real backend to get genuine AI feedback.`,
  });
}
