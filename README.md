# 🎤 SpeakForge AI

**SpeakForge AI** is an AI-powered communication coaching platform that helps users improve their public speaking and communication skills through personalized AI feedback. Users can practice speaking on randomly generated topics, receive detailed speech evaluations, and track their improvement over time with an interactive dashboard.

---

## ✨ Features

- 🎯 AI-generated speaking topics with multiple difficulty levels
- 🎙️ One-minute speech recording
- 📝 Automatic speech transcription using Whisper
- 🤖 AI-powered speech evaluation using Large Language Models (LLMs)
- 📊 Personalized dashboard with performance analytics
- 📚 Session history with detailed feedback
- 📈 Progress tracking over time
- 🔐 Secure authentication with Clerk
- 💾 PostgreSQL database for persistent storage

---

## 📸 Screenshots

> screenshots of your application here.

- Dashboard
<img width="911" height="499" alt="image" src="https://github.com/user-attachments/assets/9eb8718f-b528-4667-b0a5-6c170c7935af" />

- Speaking Session
<img width="905" height="495" alt="image" src="https://github.com/user-attachments/assets/6d1e9c53-67c9-4c00-a06f-5d067c75dcdc" />

<img width="914" height="491" alt="image" src="https://github.com/user-attachments/assets/56bc6e1e-77d4-448d-bf68-6b475588d452" />

<img width="916" height="497" alt="image" src="https://github.com/user-attachments/assets/19140b38-48c8-4661-b5a5-a9e3738cbf55" />


- AI Feedback

<img width="430" height="501" alt="image" src="https://github.com/user-attachments/assets/80f3ef5d-d1aa-4403-8ec3-d5c21d0e58e9" />

- Session History
<img width="917" height="484" alt="image" src="https://github.com/user-attachments/assets/05a4c192-a323-4832-93fd-8b43727fab6c" />

---

## 🏗️ Architecture

```
                +----------------+
                |   Next.js UI   |
                +--------+-------+
                         |
                         |
                REST API Requests
                         |
                         ▼
                +----------------+
                | FastAPI Backend|
                +--------+-------+
                         |
        +----------------+----------------+
        |                                 |
        ▼                                 ▼
+----------------+               +----------------+
| Whisper         |              | Ollama LLM     |
| Speech-to-Text  |              | Speech Review  |
+----------------+               +----------------+
        |                                 |
        +----------------+----------------+
                         |
                         ▼
                 PostgreSQL Database
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- Clerk Authentication
- CSS

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Whisper
- Ollama
- LangChain

## AI

- Whisper
- Gemma / Llama (Ollama)

---

# 📂 Project Structure

```
SpeakForge-AI
│
├── frontend
│   ├── app
│   ├── components
│   ├── utils
│   └── public
│
├── backend
│   ├── routers
│   ├── services
│   ├── repositories
│   ├── db_models
│   ├── schemas
│   ├── database.py
│   └── main.py
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/SpeakForge-AI.git
cd SpeakForge-AI
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

## Backend Setup

Create a virtual environment

```bash
cd backend

python -m venv .venv
```

Activate

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn main:app --reload
```

Backend runs on

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/speakforge

CLERK_SECRET_KEY=your_clerk_secret

CLERK_PUBLISHABLE_KEY=your_publishable_key

OLLAMA_BASE_URL=http://localhost:11434

MODEL_NAME=gemma3:4b
```

For the frontend:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key

NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# 📊 Database Schema

### User

- id
- clerk_user_id
- email
- full_name
- created_at

### Speaking Session

- id
- user_id
- topic
- topic_description
- transcript
- duration_seconds
- language
- created_at

### Evaluation

- id
- session_id
- relevance
- fluency
- grammar
- vocabulary
- confidence
- overall_score
- strengths
- weaknesses
- suggestions
- created_at

---

# 🔄 Workflow

```
User Login
      │
      ▼
Generate Speaking Topic
      │
      ▼
Record Speech
      │
      ▼
Speech Transcription (Whisper)
      │
      ▼
AI Evaluation (Ollama LLM)
      │
      ▼
Save Session & Evaluation
      │
      ▼
Dashboard & Progress Analytics
```

---

# 📡 API Endpoints

## Authentication

Authentication is handled by **Clerk**.

---

## Topic

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/topic` | Generate a random speaking topic |

---

## Evaluation

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/evaluate` | Evaluate recorded speech |

---

## Sessions

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/sessions/{clerk_user_id}` | Get all speaking sessions |
| GET | `/api/session/{session_id}` | Get session details |
| DELETE | `/api/session/{session_id}` | Delete a session |

---

# 🎯 Future Improvements

- AI pronunciation analysis
- Speech filler-word detection
- Emotion analysis
- Personalized improvement plans
- Weekly AI performance reports
- Leaderboards and achievements
- Mobile application
- Cloud deployment
- Export feedback as PDF

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Rahul Singh**

- Software Engineer
- Full-Stack Developer
- AI Enthusiast

If you found this project useful, consider giving it a ⭐ on GitHub!
