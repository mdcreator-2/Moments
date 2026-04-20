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
```
Moments/
├── docker-compose.yml
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── .env              ← your secrets (git-ignored)
│   ├── .env.example       ← template to copy
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py        ← FastAPI routes
│       ├── config.py      ← env loading
│       ├── models.py      ← Pydantic schemas
│       ├── worker.py      ← Redis queue consumer
│       └── services/
│           ├── downloader.py
│           ├── transcriber.py
│           ├── analyzer.py
│           ├── face_tracker.py
│           ├── subtitle_generator.py
│           └── renderer.py
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
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
```

---

## 📋 Prerequisites

Before deploying (Docker **or** manual), make sure you have:

| Requirement | Purpose | Where to get it |
|---|---|---|
| **Redis instance** | Job queue + state store | [Upstash](https://upstash.com) (free tier) or local `redis-server` |
| **AssemblyAI API key** | Audio transcription & diarization | [assemblyai.com](https://www.assemblyai.com) |
| **OpenRouter API key** | AI clip analysis (Qwen 3 32B) | [openrouter.ai](https://openrouter.ai) |
| **FFmpeg** ⚠️ | Video cropping, subtitle burn-in, final render | See [FFmpeg install](#installing-ffmpeg) section below |

---

## 🚀 Deployment

Choose **one** of the two methods below.

---

### Option A — Docker (Recommended)

> The easiest way to get everything running. Docker handles FFmpeg, Python deps, and Nginx for you.

#### 1. Install Docker

- **Windows / Mac**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Install [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

#### 2. Clone the repository

```bash
git clone https://github.com/mdcreator-2/Moments.git
cd Moments
```

#### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` in a text editor and fill in your keys:

```env
# Use rediss:// for Upstash (TLS), redis:// for local Redis
REDIS_URL="rediss://default:your_password@your-host.upstash.io:6379"

DEVICE="cpu"
BATCH_SIZE="16"
COMPUTE_TYPE="int8"

HF_AUTH_TOKEN=""
ASSEMBLYAI_API_KEY="your_assemblyai_key"
OPENROUTER_API_KEY="your_openrouter_key"
```

> **⚠️ `redis://` vs `rediss://`**  
> Cloud providers like Upstash **require TLS** → use `rediss://` (double s).  
> A local `redis-server` uses plain TCP → use `redis://`.

#### 4. Build and start all services

```bash
docker compose up --build
```

This starts **three** containers:

| Container | Port | Description |
|---|---|---|
| `moments-backend` | `8000` | FastAPI API server |
| `moments-worker` | — | Background job processor (queues) |
| `moments-frontend` | `3000` | React app served via Nginx |

#### 5. Open the app

Navigate to **http://localhost:3000** in your browser.

#### Useful Docker commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Rebuild after code changes
docker compose up --build
```

---

### Option B — Manual Setup

> Run each process natively on your machine. Useful for development.

#### 1. Install system dependencies

You need the following installed on your system:

| Tool | Version | Install guide |
|---|---|---|
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **FFmpeg** | 6.0+ | See [Installing FFmpeg](#installing-ffmpeg) below |
| **Redis** | 7.0+ | [Upstash](https://upstash.com) (cloud) or local install |

#### 2. Clone the repository

```bash
git clone https://github.com/mdcreator-2/Moments.git
cd Moments
```

#### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your keys (same format as Docker section above).

#### 4. Backend setup

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Linux / macOS:
source .venv/bin/activate
# Windows (PowerShell):
.venv\Scripts\activate

pip install -r requirements.txt
```

#### 5. Start the API server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 6. Start the worker (new terminal)

Open a **second terminal**, activate the venv, and run:

```bash
cd backend

# Activate venv again in this terminal
# Linux / macOS:
source .venv/bin/activate
# Windows (PowerShell):
.venv\Scripts\activate

python -m app.worker
```

You should see:
```
[Worker] Initialized and waiting for Redis jobs...
```

> The worker listens on two Redis queues:
> - `job` — video download, transcription, and AI analysis
> - `render_job` — clip rendering (face tracking + subtitles + FFmpeg)

#### 7. Frontend setup (new terminal)

Open a **third terminal**:

```bash
cd frontend
npm install
npm run dev
```

#### 8. Open the app

Navigate to **http://localhost:5173** in your browser.

> The Vite dev server automatically proxies `/api/*` requests to the backend at `http://127.0.0.1:8000`.

---

## 🔧 Installing FFmpeg

FFmpeg is **required** for video rendering (cropping, subtitle burn-in, encoding). The Docker setup includes it automatically — this section is only needed for **manual** deployment.

### Windows

```powershell
# Using winget (Windows 10+)
winget install Gyan.FFmpeg

# Or using Chocolatey
choco install ffmpeg
```

Or download manually from [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/) and add the `bin/` folder to your system `PATH`.

### macOS

```bash
brew install ffmpeg
```

### Linux (Debian / Ubuntu)

```bash
sudo apt update && sudo apt install ffmpeg -y
```

### Verify installation

```bash
ffmpeg -version
```

You should see version info — any version **6.0+** works.

---

## 🔌 API Reference

All endpoints are served from the backend at port `8000`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/videos` | Submit a YouTube URL → starts the pipeline |
| `GET` | `/api/videos/{video_id}` | Get pipeline status + clip data when ready |
| `POST` | `/api/videos/{video_id}/clips/{clip_index}/render` | Queue a clip for rendering with a subtitle style |
| `GET` | `/api/videos/{video_id}/clips/{clip_index}/status` | Poll render progress |
| `GET` | `/api/videos/{video_id}/clips/{clip_index}/download` | Download the rendered MP4 |
| `GET` | `/api/videos/{video_id}/clips/{clip_index}/thumbnail` | Fetch clip thumbnail (if generated) |

### Pipeline statuses

```
downloading → transcribing → analyzing → clips_ready
```

### Example — Submit a video

```bash
curl -X POST http://localhost:8000/api/videos \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

```json
{ "video_id": "a1b2c3d4-...", "status": "downloading" }
```

---

## 🎬 Demo Flow

1. Open the frontend in your browser
2. Paste a YouTube URL on the landing page
3. Submit and wait on the processing page (watch the status update live)
4. Browse the AI-generated clip candidates
5. Pick a subtitle style and trigger a render
6. Preview and download the final vertical MP4

> This project was demoed live with real-time processing (not pre-generated outputs).

---

## ⚠️ Known Limitations (Hackathon MVP)

- CORS is currently permissive (`*`) for rapid development
- Rendered clips are stored on the local filesystem (`/tmp/clipper/...`)
- Error handling and retry logic are minimal
- No authentication or per-user isolation
- Infrastructure scaling and security hardening are not production-complete

---

## 🧭 Roadmap (Post-hackathon)

- Persistent object storage for rendered assets (S3 / Firebase)
- Auth + per-user project history
- Better retry logic and worker observability
- Improved clip ranking with engagement feedback loop
- One-click cloud deploy (Railway / Render)

---

## 👥 Team

Built by the Moments hackathon team.

- **Mohmmad Ameer Siddqui** — Backend Developer — [GitHub](https://github.com/mdcreator-2)
- **Mohammad Taha Yaseen** — Frontend Developer — [GitHub](https://github.com/MohammadTahaYaseen)
- **Yash Garg** — AI Developer — [GitHub](https://github.com/yashgarg2866-cell)

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.