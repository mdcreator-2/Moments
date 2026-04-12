# AI Video Clipper 🎬

An intelligent system that automatically detects and extracts viral-worthy clips from long-form video content using AI-powered analysis, speaker diarization, and smart video cropping.

## 🌟 Features

- **YouTube Video Processing** - Download and process videos from YouTube URLs
- **Automatic Transcription** - Word-level accuracy using WhisperX with GPU acceleration
- **Speaker Diarization** - Identify and label different speakers in conversations
- **AI Viral Detection** - Uses Google Gemini to identify the most shareable moments
- **Smart Cropping** - Automatically detects faces and crops to vertical 9:16 format
- **Dynamic Subtitles** - Generates word-by-word highlighted subtitles for maximum engagement
- **GPU-Accelerated Rendering** - NVIDIA NVENC for fast video encoding
- **Real-time Progress Tracking** - Live status updates via REST API and WebSocket support
- **Firebase Integration** - Secure storage and metadata management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                    │
│         Landing → Processing → Results → Clip Page     │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────┐
│            Backend (FastAPI + Redis Workers)            │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │Download │→ │Transcibe │→ │Diarize   │→ │Analyze │  │
│  │(yt-dlp) │  │(WhisperX)│  │(pyannote)│  │(Gemini)│  │
│  └─────────┘  └──────────┘  └──────────┘  └────────┘  │
│       │              │              │           │       │
│       └──────────────[Redis Queue]──────────────┘       │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐            │
│  │Track     │→ │Generate   │→ │Render    │            │
│  │Faces     │  │Subtitles  │  │(FFmpeg)  │            │
│  │(MediaPipe)  │(.ass)      │  │          │            │
│  └──────────┘  └───────────┘  └──────────┘            │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐           ┌────▼────────┐
    │Firebase │           │Firebase     │
    │Firestore│           │Storage      │
    └─────────┘           └─────────────┘
```

## 🛠️ Tech Stack

**Backend:**
- Python 3.11+
- FastAPI - REST API framework
- Redis - Job queue management
- WhisperX - Speech-to-text transcription
- pyannote.audio - Speaker diarization
- MediaPipe - Face detection
- FFmpeg - Video processing
- Google Gemini 2.0 Flash - AI clip analysis
- Firebase (Firestore + Storage) - Database and file storage

**Frontend:**
- Next.js 14+ - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Vite - Build tool

## 📋 Prerequisites

Before starting, ensure you have:

- Python 3.11+
- Node.js 18+
- FFmpeg with NVIDIA GPU support (optional, falls back to CPU)
- Git
- Docker (for deployment)

**API Keys Required:**
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))
- Firebase service account JSON ([Setup guide](https://firebase.google.com/docs/admin/setup))
- Hugging Face token for pyannote ([Get it here](https://huggingface.co/settings/tokens))
- AssemblyAI API key (optional fallback) ([Sign up](https://www.assemblyai.com/))

## 🚀 Setup Instructions

### Backend Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ai-video-clipper.git
cd ai-video-clipper
```

2. **Create Python virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

5. **Start Redis server:**
```bash
# Using Docker (recommended)
docker run -d -p 6379:6379 redis:latest

# Or install locally and run
redis-server
```

6. **Run the FastAPI server:**
```bash
cd app
python main.py
# Server will start at http://localhost:8000
```

7. **In another terminal, start the Redis worker:**
```bash
cd app
python worker.py
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
# Edit with your backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Start development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Environment Variables

**Backend (.env):**
```env
# Firebase
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Redis
REDIS_URL=redis://localhost:6379

# WhisperX
WHISPERX_MODEL=large-v2
WHISPERX_DEVICE=cuda  # or cpu
WHISPERX_COMPUTE_TYPE=float16

# Pyannote (Hugging Face)
HF_AUTH_TOKEN=hf_xxxxxxxxxxxx
PYANNOTE_DEVICE=cpu

# Gemini AI
GEMINI_API_KEY=your-gemini-key

# AssemblyAI (Optional fallback)
ASSEMBLYAI_API_KEY=your-assemblyai-key
USE_ASSEMBLYAI=false

# Storage
TEMP_DIR=/tmp/clipper
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📡 API Endpoints

### Video Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/videos` | Submit a YouTube URL for processing |
| **GET** | `/api/videos/{video_id}` | Get video status and results (transcript, clips) |

### Clip Rendering

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/clips/{clip_id}/render` | Trigger rendering of a specific clip |
| **GET** | `/api/clips/{clip_id}/status` | Get render progress and URL |
| **GET** | `/api/clips/{clip_id}/download` | Download the rendered MP4 file |

## 📁 Project Structure

```
ai-video-clipper/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application
│   │   ├── config.py               # Configuration loader
│   │   ├── models.py               # Pydantic data models
│   │   ├── firebase_client.py      # Firebase integration
│   │   ├── worker.py               # Redis job worker
│   │   └── services/
│   │       ├── downloader.py       # YouTube video download
│   │       ├── transcriber.py      # Speech-to-text
│   │       ├── diarizer.py         # Speaker identification
│   │       ├── merger.py           # Merge transcript + speakers
│   │       ├── analyzer.py         # Gemini AI analysis
│   │       ├── face_tracker.py     # Face detection & cropping
│   │       ├── subtitle_generator.py # ASS subtitle generation
│   │       └── renderer.py         # Video rendering with FFmpeg
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── processing/          # Processing status page
│   │   │   ├── results/             # Results & clip pages
│   │   │   └── clip/
│   │   ├── components/
│   │   │   ├── URLInput.tsx
│   │   │   ├── StatusTracker.tsx
│   │   │   ├── TranscriptViewer.tsx
│   │   │   ├── ClipCard.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── lib/
│   │   │   └── api.ts              # API client
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.local.example
│
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── .gitignore
```

## 🎯 How It Works

1. **User Input** - Paste a YouTube URL in the landing page
2. **Download** - Backend downloads video (MP4) and audio (WAV)
3. **Transcription** - Convert speech to text with word-level timestamps using WhisperX
4. **Diarization** - Identify different speakers and label segments
5. **AI Analysis** - Gemini analyzes transcript to find viral moments
6. **Results Display** - Show clips with virality scores and justifications
7. **Smart Rendering** - On demand, render clips with:
   - Face detection and vertical cropping (9:16 aspect ratio)
   - Dynamic word-by-word highlighted subtitles
   - GPU-accelerated video encoding
8. **Download** - User downloads the final vertical short

## 🧪 Testing

### Test the Backend
```bash
cd backend
pytest test_tracker.py
```

### Test the Frontend
```bash
cd frontend
npm run test
```

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t ai-video-clipper-backend ./backend
docker run -p 8000:8000 --env-file .env ai-video-clipper-backend
```

## 📝 API Response Examples

### Submit Video
**Request:**
```json
POST /api/videos
{
  "youtube_url": "https://www.youtube.com/watch?v=abc123"
}
```

**Response:**
```json
{
  "video_id": "a1b2c3d4",
  "status": "downloading"
}
```

### Get Results
**Request:**
```
GET /api/videos/a1b2c3d4
```

**Response:**
```json
{
  "video_id": "a1b2c3d4",
  "status": "clips_ready",
  "title": "Joe Rogan ft. Elon Musk",
  "duration_sec": 3600,
  "transcript": [
    {
      "word": "never",
      "start": 124.5,
      "end": 124.78,
      "speaker": "SPEAKER_00"
    }
  ],
  "clips": [
    {
      "id": "x7y8z9",
      "start_time": 124.5,
      "end_time": 184.5,
      "title": "The moment that changed everything",
      "virality_score": 87,
      "justification": "Bold claim with strong emotional delivery and pause for effect",
      "status": "pending"
    }
  ]
}
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Lead Developer** - Backend infrastructure, ML pipeline, video rendering
- **Prompt Engineer** - AI prompts, frontend design, documentation

## 🙏 Acknowledgments

- WhisperX for accurate speech recognition
- pyannote.audio for speaker diarization
- MediaPipe for production-ready face detection
- Google Gemini for powerful LLM capabilities
- Firebase for scalable backend infrastructure

## 📞 Support

For issues, questions, or suggestions, please open an [issue](https://github.com/yourusername/ai-video-clipper/issues) on GitHub.

## 🚀 Roadmap

- [ ] Support for multiple video sources (TikTok, Instagram Reels, etc.)
- [ ] Real-time WebSocket updates for progress tracking
- [ ] Advanced subtitle styling and animations
- [ ] Batch processing for multiple videos
- [ ] Custom AI prompt templates
- [ ] Multi-language support
- [ ] Mobile app

---

**Made with ❤️ for ByteVerse 8.0 Hackathon**