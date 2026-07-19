# SpeakForgeAI — Setup Guide

SpeakForgeAI is a Next.js (App Router, JavaScript) frontend that helps users
practice speaking on the spot: it fetches a random topic, gives the user
prep + speaking time, records their voice, and sends the recording to a
backend for evaluation. Authentication is handled by Clerk.

This guide covers everything needed to get the project running locally.

---

## 1. Prerequisites

- **Node.js 18.17 or later** (Next.js 14 requirement). Check with:
  ```bash
  node -v
  ```
- **npm** (comes with Node) or **yarn** — either works. Examples below use npm.
- A free **Clerk** account for authentication: https://clerk.com
- A modern browser with microphone access (Chrome, Edge, Firefox, Safari) —
  required for the recording feature, which uses `navigator.mediaDevices`
  and the `MediaRecorder` API.

---

## 2. Create the project / get the code

If you're starting from the files provided in this deliverable, put them
into a folder called `speakforgeai/` matching this structure:

```
speakforgeai/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── login/page.js
│   ├── register/page.js
│   ├── dashboard/page.js
│   ├── session/page.js
│   ├── history/page.js
│   └── api/
│       ├── generate-topic/route.js   (optional local mock)
│       └── evaluate/route.js         (optional local mock)
├── components/
│   ├── Navbar.js
│   ├── Graph.js
│   └── SessionRecorder.js
├── utils/
│   └── api.js
├── styles/
│   └── globals.css
├── middleware.js
├── next.config.mjs
├── package.json
└── .env.local.example
```

Alternatively, if you'd rather scaffold a fresh Next.js app and copy these
files in, run:

```bash
npx create-next-app@latest speakforgeai --js --app --no-tailwind --eslint --no-src-dir --import-alias "@/*"
cd speakforgeai
```

Then copy the files from this deliverable into place, overwriting the
generated `app/`, `styles/`, and `package.json` (merge dependencies) as needed.

---

## 3. Install dependencies

From inside the `speakforgeai/` directory:

```bash
npm install
```

This installs:
- `next`, `react`, `react-dom` — the framework
- `@clerk/nextjs` — authentication
- `recharts` — the dashboard progress graph

---

## 4. Configure Clerk

1. Go to https://dashboard.clerk.com and create a new application (choose
   "Email" and/or any social providers you want to support).
2. In your Clerk dashboard, open **API Keys** and copy:
   - **Publishable key**
   - **Secret key**
3. In the project root, copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
4. Fill in `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```
5. `middleware.js` (already included) protects `/dashboard`, `/session`,
   and `/history` — signed-out users are redirected to sign in. No further
   configuration is needed for this, but you can adjust the matcher if you
   add more protected routes.

**Note on `NEXT_PUBLIC_API_BASE_URL`:** this points at the backend that
implements `/generate-topic` and `/evaluate`. See section 6 below for how
to run without a real backend yet.

---

## 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000. You should see the SpeakForgeAI landing page.

- Click **Sign up free** to register a new account (Clerk handles email
  verification / social login per your dashboard config).
- After signing in you'll land on `/dashboard`.
- Use the navbar to start a **New session**, or view **History**.

For production builds:

```bash
npm run build
npm run start
```

---

## 6. Simulating the backend API (`/generate-topic` and `/evaluate`)

The frontend expects a backend with two endpoints:

- `GET /generate-topic` → `{ "topic": "...", "category": "..." }`
- `POST /evaluate` (multipart/form-data: `audio`, `topic`, `prepSeconds`,
  `speakSeconds`, `durationSeconds`) → an evaluation object, e.g.:
  ```json
  {
    "overallScore": 82,
    "fluency": 85,
    "clarity": 81,
    "pace": 79,
    "confidence": 83,
    "feedback": "Strong, confident delivery..."
  }
  ```

Two ways to develop against this without the real backend built yet:

### Option A — Use the included mock API routes (fastest)

This project ships with mock implementations at:
- `app/api/generate-topic/route.js`
- `app/api/evaluate/route.js`

They return randomized topics/scores after a short simulated delay. To use
them, simply point the frontend at your own Next.js server:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Since these mock routes live inside the same Next.js app (under `/api/...`),
this works out of the box with no extra services to run. Delete or replace
these two files once your real backend is ready.

### Option B — Point at a separate mock/real backend

If your backend team is building the real service separately (e.g. FastAPI,
Express), just set:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

and make sure that service implements the two endpoints above and allows
CORS requests from `http://localhost:3000`. A minimal Express mock:

```js
// mock-server.js
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/generate-topic", (req, res) => {
  res.json({ topic: "Describe a recent challenge you overcame." });
});

app.post("/evaluate", (req, res) => {
  res.json({
    overallScore: 78,
    fluency: 76,
    clarity: 80,
    pace: 74,
    confidence: 79,
    feedback: "Solid structure — work on reducing filler words.",
  });
});

app.listen(8000, () => console.log("Mock backend on :8000"));
```

---

## 7. Notes on microphone recording

- Recording uses the browser's native `MediaRecorder` API — no extra
  package is required.
- Browsers require **HTTPS or localhost** to grant microphone access, so
  test locally via `http://localhost:3000` or deploy behind HTTPS.
- If a user denies microphone permission, `SessionRecorder` surfaces an
  error state with a retry option.

---

## 8. Color palette / theming

The app's design tokens live in `styles/globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--sf-ink` | `#00674b` | Primary text, buttons, accents |
| `--sf-paper` | `#F6F4E8` | Page background |

Clerk's `<SignIn>` / `<SignUp>` components are themed to match via the
`appearance` prop in `app/login/page.js`, `app/register/page.js`, and the
`ClerkProvider` in `app/layout.js`.

---

## 9. Deploying

This app deploys cleanly to Vercel (or any Next.js-compatible host):

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings.
4. In your Clerk dashboard, add your production domain under **Domains**.

---

You're all set — run `npm run dev` and start speaking.
