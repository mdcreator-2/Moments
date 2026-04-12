# Moments

Turn long-form YouTube videos into viral short clips in minutes.

**Moments** is a hackathon MVP that:
1. Accepts a YouTube URL
2. Downloads and transcribes the video
3. Diarizes speakers
4. Uses AI to identify viral-worthy clip candidates
5. Renders vertical clips with smart crop + subtitles
6. Lets users preview and download final MP4 clips

---

## ✨ Features

- YouTube URL ingestion
- Async processing pipeline with Redis-backed job queues
- Word-level transcript + speaker-aware segmentation
- AI clip selection (viral segment discovery)
- Clip render queue with subtitle style presets
- Download endpoint for rendered MP4 files
- Clean frontend flow: Landing → Processing → Results → Clip Preview

---

## 🏗️ Tech Stack

### Frontend (`/frontend`)
- React + TypeScript
- Vite
- React Router
- Tailwind CSS (UI styling)

### Backend (`/backend`)
- FastAPI
- Redis (queue + state store)
- Python services for:
  - download/transcription/analysis
  - smart crop & subtitle generation
  - FFmpeg render orchestration

### AI
- OpenRouter client
- Model currently referenced in analyzer: `qwen/qwen3-32b`

---

## 📁 Repository Structure

Moments/
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── execution.md
├── frontend_prompts.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── worker.py
│   ├── render_worker.py
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── models.py
│       └── services/
│           ├── __init__.py
│           ├── downloader.py
│           ├── transcriber.py
│           ├── analyzer.py
│           ├── face_tracker.py
│           ├── subtitle_generator.py
│           └── renderer.py
└── frontend/
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── eslint.config.js
    ├── public/
    │   └── vite.svg
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── lib/
        │   └── api.ts
        ├── components/
        │   ├── ClipCard.tsx
        │   ├── Navbar.tsx
        │   ├── RenderProgress.tsx
        │   └── VideoPlayer.tsx
        └── pages/
            ├── LandingPage.tsx
            ├── ProcessingPage.tsx
            ├── ResultsPage.tsx
            └── ClipPage.tsx
---

## 🚀 Local Setup

> Tested as a hackathon MVP workflow.  
> If a command differs in your local scripts, use your project’s exact script names.

### 1) Clone

```bash
git clone https://github.com/mdcreator-2/Moments.git
cd Moments
```

### 2) Start Redis

You need Redis running locally on default port (`6379`).

```bash
# Option A: local redis service
redis-server

# Option B: docker
docker run -p 6379:6379 redis:7
```

### 3) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```env
# Required
REDIS_URL=your_redis_url_here

DEVICE="cpu"
BATCH_SIZE="16"
COMPUTE_TYPE="int8"

HF_AUTH_TOKEN=your_hf_auth_token_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

OPENROUTER_API_KEY=your_openrouter_or_proxy_key_here
```

Run backend API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4) Start worker(s)

In a new terminal (inside `backend/`, with venv activated), run your worker process(es) that consume:
- `job` queue (processing)
- `render_job` queue (clip rendering)

```bash
# Start processing worker
python -m app.workers
```
> Use your existing worker entry command(s) from your local setup.  
> If you have separate workers, start both.

### 5) Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on Vite default port (usually `5173`).

---

## 🔌 API Overview (current)

From `backend/app/main.py`:

- `POST /api/videos`  
  Submit YouTube URL and create processing job

- `GET /api/videos/{video_id}`  
  Get pipeline status (`downloading`, ..., `clips_ready`) and clip metadata when ready

- `POST /api/videos/{video_id}/clips/{clip_index}/render`  
  Queue clip render with subtitle style

- `GET /api/videos/{video_id}/clips/{clip_index}/status`  
  Poll render status

- `GET /api/videos/{video_id}/clips/{clip_index}/download`  
  Download rendered MP4

- `GET /api/videos/{video_id}/clips/{clip_index}/thumbnail`  
  Fetch generated thumbnail (if available)

---

## 🎬 Demo Flow (Real YouTube Link)

1. Open frontend
2. Paste a real YouTube URL in landing page
3. Submit and wait on processing page
4. Open generated clip candidates
5. Trigger render for a selected clip
6. Preview/download MP4 from download endpoint

> This project was demoed live with real-time processing (not pre-generated outputs).

---

## ⚠️ Known Limitations (Hackathon MVP)

- CORS is currently permissive for rapid development.
- Local file storage is used for rendered clips/thumbnails (`/tmp/...`) in current flow.
- Error handling and retries are basic.
- Infra/scaling/security hardening is not production-complete.

---

## 🧭 Roadmap (Post-hackathon)

- Persistent object storage for rendered assets
- Auth + per-user project history
- Better retry logic and worker observability
- Improved clip ranking with engagement feedback loop
- One-click cloud deploy

---

## 👥 Team

Built by the Moments hackathon team.

- Mohmmad Ameer Siddqui - Backend Developer - [GitHub](https://github.com/mdcreator-2)
- Mohammad Taha Yaseen - Frontend Developer - [GitHub](https://github.com/MohammadTahaYaseen)
- Yash Garg - AI Developer - [GitHub](https://github.com/yashgarg2866-cell)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.