"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateTopic, evaluateSession } from "../utils/api";
import { useAuth } from "@clerk/nextjs";


// Default configurable timings (in seconds). Can be overridden via props.
export const DEFAULT_PREP_SECONDS = 60; // x: prep time
export const DEFAULT_SPEAK_SECONDS = 180; // t: speaking time

const STAGES = {
  IDLE: "idle",
  FETCHING_TOPIC: "fetching_topic",
  PREP: "prep",
  RECORDING: "recording",
  SUBMITTING: "submitting",
  RESULT: "result",
  ERROR: "error",
};

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function SessionRecorder({
  prepSeconds = DEFAULT_PREP_SECONDS,
  speakSeconds = DEFAULT_SPEAK_SECONDS,
}) {
  const { getToken } = useAuth();
  const [stage, setStage] = useState(STAGES.IDLE);
  const [topic, setTopic] = useState(null);
  const [topicDescription, setTopicDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(prepSeconds);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordStartRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const startCountdown = useCallback((seconds, onComplete) => {
    clearTimer();
    setSecondsLeft(seconds);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const beginSession = async () => {
    setErrorMessage("");
    setResult(null);
    setAudioUrl(null);
    setStage(STAGES.FETCHING_TOPIC);
    try {
      const data = await generateTopic();
      setTopic(data.topic || "Describe a moment you overcame a challenge.");
      setTopicDescription(data.description);
      setDifficulty(data.difficulty);
      setStage(STAGES.PREP);
      startCountdown(prepSeconds, () => {
        beginRecording();
      });
    } catch (err) {
      setErrorMessage(err.message || "Could not fetch a topic. Try again.");
      setStage(STAGES.ERROR);
    }
  };

  const beginRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recordStartRef.current = Date.now();
      recorder.start();

      setStage(STAGES.RECORDING);
      startCountdown(speakSeconds, () => {
        finishRecording();
      });
    } catch (err) {
      setErrorMessage(
        "Microphone access was denied or unavailable. Please allow microphone access and try again."
      );
      setStage(STAGES.ERROR);
    }
  };

  const finishRecording = () => {
    clearTimer();
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    const durationSeconds = recordStartRef.current
      ? Math.round((Date.now() - recordStartRef.current) / 1000)
      : speakSeconds;

    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      setAudioUrl(URL.createObjectURL(blob));
      submitForEvaluation(blob, durationSeconds);
    };
    recorder.stop();
  };

const submitForEvaluation = async (blob, durationSeconds) => {
  setStage(STAGES.SUBMITTING);

  try {
    const token = await getToken();

    const result = await evaluateSession({
      token,
      audioBlob: blob,
      topic,
      topicDescription,
      difficulty,
      prepSeconds,
      speakSeconds,
      durationSeconds,
    });

    setResult(result);
    setStage(STAGES.RESULT);
  } catch (err) {
    setErrorMessage(
      err.message ||
        "Evaluation failed. Your recording was not lost — you can try submitting again."
    );

    setStage(STAGES.ERROR);
  }
};

  const skipPrep = () => {
    clearTimer();
    beginRecording();
  };

  const stopEarly = () => {
    finishRecording();
  };

  const resetSession = () => {
    clearTimer();
    setStage(STAGES.IDLE);
    setTopic(null);
    setResult(null);
    setErrorMessage("");
    setAudioUrl(null);
  };

  return (
    <div className="sf-card">
      {stage === STAGES.IDLE && (
        <div style={{ textAlign: "center", padding: "24px 12px" }}>
          <p className="sf-eyebrow">New session</p>
          <h2 style={{ fontSize: 26, margin: "10px 0 12px" }}>
            Ready to forge a new response?
          </h2>
          <p style={{ color: "#3d4b45", marginBottom: 24 }}>
            You&apos;ll get {Math.round(prepSeconds / 60) || 1} min to prepare
            and {Math.round(speakSeconds / 60) || 1} min to speak on a random
            topic.
          </p>
          <button className="sf-btn" onClick={beginSession}>
            Start speaking session
          </button>
        </div>
      )}

      {stage === STAGES.FETCHING_TOPIC && (
        <div style={{ textAlign: "center", padding: "32px 12px" }}>
          <p className="sf-eyebrow">Fetching topic…</p>
          <p style={{ marginTop: 8, color: "#3d4b45" }}>
            Hold tight while we pull a topic for you.
          </p>
        </div>
      )}

      {(stage === STAGES.PREP || stage === STAGES.RECORDING) && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <span className="sf-badge">
              {stage === STAGES.PREP ? "Preparation" : "Recording"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 700,
                color: stage === STAGES.RECORDING ? "#a1381f" : "#00674b",
              }}
            >
              {stage === STAGES.RECORDING && (
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#a1381f",
                    marginRight: 8,
                  }}
                />
              )}
              {formatTime(secondsLeft)}
            </span>
          </div>

          <div
            style={{
              background: "var(--sf-paper)",
              border: "1px solid var(--sf-line)",
              borderRadius: 4,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <p className="sf-card-title">Your topic</p>
            <p style={{ fontSize: 19, fontFamily: "var(--font-display)" }}>
              {topic}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {stage === STAGES.PREP && (
              <button className="sf-btn" onClick={skipPrep}>
                Start speaking now
              </button>
            )}
            {stage === STAGES.RECORDING && (
              <button className="sf-btn sf-btn-danger" onClick={stopEarly}>
                Stop &amp; submit
              </button>
            )}
          </div>
        </div>
      )}

      {stage === STAGES.SUBMITTING && (
        <div style={{ textAlign: "center", padding: "32px 12px" }}>
          <p className="sf-eyebrow">Evaluating…</p>
          <p style={{ marginTop: 8, color: "#3d4b45" }}>
            Sending your recording off for feedback. This can take a moment.
          </p>
        </div>
      )}

      {stage === STAGES.RESULT && result && (
  <div>
    <p className="sf-eyebrow">Evaluation Result</p>

    <h2
      style={{
        fontSize: 28,
        marginBottom: 20,
        color: "#00674b",
      }}
    >
      Overall Score: {result.feedback.overall_score}/50
    </h2>

    {/* Score Cards */}

    <div className="sf-grid-3" style={{ marginBottom: 25 }}>

      <ScoreCard
        title="Relevance"
        score={result.feedback.relevance}
      />

      <ScoreCard
        title="Fluency"
        score={result.feedback.fluency}
      />

      <ScoreCard
        title="Grammar"
        score={result.feedback.grammar}
      />

      <ScoreCard
        title="Vocabulary"
        score={result.feedback.vocabulary}
      />

      <ScoreCard
        title="Confidence"
        score={result.feedback.confidence}
      />

    </div>

    {/* Transcript */}

    <div
      style={{
        marginBottom: 20,
        border: "1px solid var(--sf-line)",
        padding: 16,
        borderRadius: 6,
      }}
    >
      <h3>Transcript</h3>

      <p>{result.transcript}</p>
    </div>

    {/* Strengths */}

    <div
      style={{
        marginBottom: 20,
        border: "1px solid var(--sf-line)",
        padding: 16,
        borderRadius: 6,
      }}
    >
      <h3>Strengths</h3>

      <ul>
        {result.feedback.strengths.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    {/* Weaknesses */}

    <div
      style={{
        marginBottom: 20,
        border: "1px solid var(--sf-line)",
        padding: 16,
        borderRadius: 6,
      }}
    >
      <h3>Weaknesses</h3>

      <ul>
        {result.feedback.weaknesses.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    {/* Suggestions */}

    <div
      style={{
        marginBottom: 20,
        border: "1px solid var(--sf-line)",
        padding: 16,
        borderRadius: 6,
      }}
    >
      <h3>Suggestions</h3>

      <ul>
        {result.feedback.suggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    {/* Audio */}

    {audioUrl && (
      <div style={{ marginBottom: 20 }}>
        <h3>Your Recording</h3>

        <audio
          controls
          src={audioUrl}
          style={{ width: "100%" }}
        />
      </div>
    )}

    <button
      className="sf-btn"
      onClick={resetSession}
    >
      Start Another Session
    </button>

  </div>
)}
      {stage === STAGES.ERROR && (
        <div style={{ textAlign: "center", padding: "24px 12px" }}>
          <p className="sf-eyebrow" style={{ color: "#a1381f" }}>
            Something went wrong
          </p>
          <p style={{ margin: "10px 0 20px", color: "#3d4b45" }}>
            {errorMessage}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="sf-btn sf-btn-outline" onClick={resetSession}>
              Back to start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score }) {
  return (
    <div
      style={{
        border: "1px solid var(--sf-line)",
        borderRadius: 6,
        padding: 16,
      }}
    >
      <p
        style={{
          color: "#00674b",
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {title}
      </p>

      <h2>{score}/10</h2>
    </div>
  );
}
