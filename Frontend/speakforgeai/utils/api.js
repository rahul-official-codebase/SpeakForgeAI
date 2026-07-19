

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * GET /generate-topic
 * Fetches a random speaking topic (and optional category) from the backend.
 * Expected response shape: { topic: string, category?: string }
 */
export async function generateTopic() {
  const res = await fetch(`${API_BASE_URL}/generate-topic`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch a topic (status ${res.status}). Please try again.`
    );
  }

  return res.json();
}

/**
 * POST /evaluate
 * Sends the recorded audio blob plus session metadata for evaluation.
 * Uses multipart/form-data so the backend can accept a raw audio file.
 *
 * Expected response shape (example):
 * {
 *   overallScore: number,
 *   fluency: number,
 *   clarity: number,
 *   pace: number,
 *   confidence: number,
 *   feedback: string,
 *   transcript?: string
 * }
 */
export async function evaluateSession({
  token,
  audioBlob,
  topic,
  topicDescription,
  difficulty,
  prepSeconds,
  speakSeconds,
  durationSeconds,
}) {
  const formData = new FormData();

  formData.append("audio", audioBlob, "recording.webm");
  formData.append("topic", topic);
  formData.append("topic_description", topicDescription ?? "");
  formData.append("difficulty", difficulty ?? "Easy");
  formData.append("prep_seconds", String(prepSeconds ?? 0));
  formData.append("speak_seconds", String(speakSeconds ?? 60));
  formData.append("duration_seconds", String(durationSeconds ?? 60));

  const res = await fetch(`${API_BASE_URL}/evaluate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Evaluation failed");
  }

  return res.json();
}
/**
 * Optional helper: fetch a user's past sessions/recordings for the
 * dashboard and history pages. Adjust the path to match your backend.
 * Falls back to null on failure so callers can show mock/local data.
 */
export async function fetchSessionHistory(clerkUserId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sessions/${clerkUserId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch session history");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return {
      sessions: [],
    };
  }
}
export { API_BASE_URL };
