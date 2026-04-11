# 🗂️ AI Video Clipper — Hackathon Execution Guideline

**Event:** ByteVerse 8.0 | **Team:** 2 builders | **Duration:** 36 hours  
**Repo Name:** `ai-video-clipper`

> This document contains the complete project structure, file creation order, data flow, and step-by-step build instructions. No code — just the blueprint your team follows during the hackathon.

---

## 1. Team Roles

| Role | Builder | Responsibility |
|---|---|---|
| **A — Lead Developer** | You | All backend services, ML pipeline (WhisperX, pyannote, merger), FastAPI, Redis worker, Firebase, FFmpeg rendering, frontend pages & core components, deployment, final polish |
| **B — Prompt Engineer & Presenter** | Partner | Gemini prompt engineering (analyzer.py), frontend styling (globals.css), simpler UI components (ClipCard, Navbar), subtitle style definitions, README, CONTRIBUTING, presentation deck, video pitch |

> **Team Dynamic:** A is the technical engine — builds the entire backend pipeline and frontend skeleton. B focuses on the Gemini viral detection prompt (the "AI brain"), visual design/CSS, documentation, and presenting the project. Both work in parallel: A writes infrastructure code while B crafts prompts, styles, and docs. B knows basic Python and can handle guided coding tasks with AI assistance.

---

## 2. Project Folder Structure

```
ai-video-clipper/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    ← FastAPI app + all API endpoints
│   │   ├── config.py                  ← Environment variable loader
│   │   ├── models.py                  ← Pydantic data models (request/response shapes)
│   │   ├── firebase_client.py         ← Firestore + Firebase Storage helpers
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── downloader.py          ← yt-dlp: YouTube URL → video.mp4 + audio.wav
│   │   │   ├── transcriber.py         ← WhisperX (or AssemblyAI fallback) → word timestamps
│   │   │   ├── diarizer.py            ← pyannote CPU (or AssemblyAI fallback) → speaker labels
│   │   │   ├── merger.py              ← Combines transcription + diarization → unified JSON
│   │   │   ├── analyzer.py            ← Gemini LLM → viral clip detection
│   │   │   ├── face_tracker.py        ← MediaPipe face detection + EMA smoothing
│   │   │   ├── subtitle_generator.py  ← Generates .ass subtitle file with word-by-word highlight
│   │   │   └── renderer.py            ← FFmpeg: crop + subtitle burn + NVENC encode → final.mp4
│   │   │
│   │   └── worker.py                  ← Redis worker: listens for jobs, runs full pipeline
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                 ← Root layout: fonts, metadata, global CSS
│   │   ├── page.tsx                   ← Landing page: hero section + URL input
│   │   ├── processing/
│   │   │   └── [id]/
│   │   │       └── page.tsx           ← Processing status page: animated progress
│   │   └── results/
│   │       └── [id]/
│   │           ├── page.tsx           ← Results page: transcript + clip cards
│   │           └── clip/
│   │               └── [clipId]/
│   │                   └── page.tsx   ← Clip page: render + preview + download
│   │
│   ├── components/
│   │   ├── URLInput.tsx               ← YouTube URL text input + submit button
│   │   ├── StatusTracker.tsx          ← Multi-step animated progress bar
│   │   ├── TranscriptViewer.tsx       ← Scrollable word-by-word transcript with speaker colors
│   │   ├── ClipCard.tsx               ← Card: virality score, title, time range, justification
│   │   ├── VideoPlayer.tsx            ← HTML5 video player with custom controls
│   │   ├── RenderProgress.tsx         ← Render progress bar + download button
│   │   └── Navbar.tsx                 ← App navigation bar
│   │
│   ├── lib/
│   │   └── api.ts                     ← Typed API client: fetch wrapper for all endpoints
│   │
│   ├── styles/
│   │   └── globals.css                ← Dark theme, design tokens, animations, glassmorphism
│   │
│   ├── public/
│   │   └── logo.svg
│   │
│   ├── package.json
│   ├── next.config.js
│   └── .env.local.example
│
├── README.md
├── LICENSE                            ← MIT
├── .gitignore
└── CONTRIBUTING.md
```

**Total: 33 files across backend and frontend.**

---

## 3. Complete Data Flow

### Phase 1: Video Processing Pipeline

```
USER pastes YouTube URL in browser
        │
        ▼
   POST /api/videos { youtube_url }
        │
        ▼
   main.py:
     → Generate video_id (UUID)
     → Create Firestore doc: videos/{id}, status = "downloading"
     → Push job to Redis queue: "pipeline_queue"
     → Return { video_id, status: "downloading" }
        │
        ▼
   worker.py picks up job from Redis
        │
        ▼
   STAGE 1 — DOWNLOAD (downloader.py)
     Input:  YouTube URL
     Tool:   yt-dlp
     Output: /tmp/clipper/{id}/video.mp4
             /tmp/clipper/{id}/audio.wav
     Saves:  Video title + duration to Firestore
     Status: "downloading"
        │
        ▼
   STAGE 2 — TRANSCRIBE (transcriber.py)
     Input:  /tmp/clipper/{id}/audio.wav
     Tool:   WhisperX with CUDA (or AssemblyAI API if fallback)
     Output: List of words with timestamps
             Example: { word: "never", start: 124.500, end: 124.780 }
     Status: "transcribing"
        │
        ▼
   STAGE 3 — DIARIZE (diarizer.py)
     Input:  /tmp/clipper/{id}/audio.wav
     Tool:   pyannote.audio on CPU (or AssemblyAI if fallback)
     Output: List of speaker segments
             Example: { speaker: "SPEAKER_00", start: 120.0, end: 145.0 }
     Status: "diarizing"
        │
        ▼
   STAGE 4 — MERGE (merger.py)
     Input:  Word list from Stage 2 + Speaker segments from Stage 3
     Logic:  For each word, find which speaker segment it falls within
             → assign that speaker label to the word
     Output: Unified transcript
             Example: { word: "never", start: 124.5, end: 124.78, speaker: "SPEAKER_00" }
     Saved:  Firestore → videos/{id}/transcript (single document with array)
        │
        ▼
   STAGE 5 — ANALYZE (analyzer.py)
     Input:  Full merged transcript (converted to readable text with timestamps)
     Tool:   Google Gemini 2.0 Flash API
     Prompt: "Act as a viral content strategist. Find 3-7 segments (30-90 sec each)
              with highest viral potential. Return JSON array."
     Output: List of viral clips
             Example: {
               start_time: 124.5,
               end_time: 184.5,
               title: "The moment that changed everything",
               virality_score: 87,
               justification: "Bold claim + emotional pause..."
             }
     Saved:  Firestore → videos/{id}/clips (one document per clip)
     Status: "clips_ready"
        │
        ▼
   Frontend polls GET /api/videos/{id}
   Sees status = "clips_ready"
   Redirects to Results page
   USER sees transcript + clip cards with virality scores
```

### Phase 2: Clip Rendering Pipeline

```
USER clicks "Render" on a clip card
        │
        ▼
   POST /api/clips/{clip_id}/render
        │
        ▼
   main.py:
     → Update clip status in Firestore: "rendering"
     → Push render job to Redis queue: "render_queue"
     → Return { clip_id, status: "rendering" }
        │
        ▼
   worker.py picks up render job
        │
        ▼
   STAGE 6 — FACE TRACK (face_tracker.py)
     Input:  /tmp/clipper/{id}/video.mp4 (only the clip time range)
             + Merged transcript (to know which speaker is active when)
     Tool:   MediaPipe BlazeFace (face detection)
     Process:
       1. Read video frames from start_time to end_time
       2. Detect face bounding boxes on each frame
       3. Apply EMA smoothing to coordinates (prevents jitter)
       4. Map speaker labels to face positions
          (heuristic: left-side face = SPEAKER_00, right = SPEAKER_01)
     Output: Per-frame crop coordinates
             Example: { frame: 0, x: 240, y: 0, width: 607, height: 1080 }
        │
        ▼
   STAGE 7 — SUBTITLES (subtitle_generator.py)
     Input:  Merged transcript (filtered to clip time range)
     Process:
       1. Group words into lines (max ~6 words per line)
       2. For each line, create ASS dialogue event
       3. Use ASS color override tags to highlight current word
          (words before = highlight color, words after = base color)
       4. Write .ass file with font, size, color, border, shadow settings
     Output: /tmp/clipper/{id}/clip_{cid}.ass
     Styles: "bold_yellow", "clean_white", "neon_glow"
        │
        ▼
   STAGE 8 — RENDER (renderer.py)
     Input:  /tmp/clipper/{id}/video.mp4
             + Crop coordinates from Stage 6
             + Subtitle file from Stage 7
             + start_time, end_time
     Tool:   FFmpeg with NVENC GPU encoding
     Process:
       1. Decode video (hardware-accelerated)
       2. Crop to 9:16 using face coordinates
       3. Scale to 1080x1920
       4. Burn subtitles from .ass file
       5. Encode with h264_nvenc
     Output: /tmp/clipper/{id}/rendered_{cid}.mp4
     Upload: Firebase Storage → get public download URL
     Update: Firestore clip doc → status: "rendered", render_url: "https://..."
        │
        ▼
   Frontend polls GET /api/clips/{clip_id}/status
   Sees status = "rendered" + download URL
   Shows video preview + Download button
   USER downloads the final vertical short
```

---

## 4. API Endpoints

| Method | Path | Purpose | Request Body | Response |
|---|---|---|---|---|
| POST | `/api/videos` | Submit YouTube URL | `{ youtube_url }` | `{ video_id, status }` |
| GET | `/api/videos/{video_id}` | Poll status + get results | — | `{ video_id, status, title, duration, transcript, clips }` |
| POST | `/api/clips/{clip_id}/render` | Trigger rendering | `{ subtitle_style }` (optional) | `{ clip_id, status }` |
| GET | `/api/clips/{clip_id}/status` | Poll render progress | — | `{ clip_id, status, render_url }` |
| GET | `/api/clips/{clip_id}/download` | Download rendered MP4 | — | Binary MP4 file |

**Status progression for videos:** `downloading` → `transcribing` → `diarizing` → `analyzing` → `clips_ready` → `error`

**Status progression for clips:** `pending` → `rendering` → `rendered` → `error`

---

## 5. Frontend Routes

| Route | Page | What It Shows |
|---|---|---|
| `/` | Landing page | Hero section, tagline, YouTube URL input form |
| `/processing/[id]` | Processing page | Animated status tracker (polls every 2s, redirects on clips_ready) |
| `/results/[id]` | Results page | Two-column: video player + transcript (left), clip cards (right) |
| `/results/[id]/clip/[clipId]` | Clip page | Rendered video preview, clip metadata, render button, download |

---

## 6. Firestore Data Structure

### Collection: `videos`

| Field | Type | Example |
|---|---|---|
| id | string | "a1b2c3d4" |
| youtube_url | string | "https://youtube.com/watch?v=abc123" |
| title | string | "Joe Rogan ft. Elon Musk" |
| duration_sec | number | 3600 |
| status | string | "clips_ready" |
| audio_path | string | "/tmp/clipper/a1b2c3d4/audio.wav" |
| video_path | string | "/tmp/clipper/a1b2c3d4/video.mp4" |
| created_at | timestamp | 2026-04-11T14:30:00Z |

### Subcollection: `videos/{videoId}/transcript` (single document)

| Field | Type | Example |
|---|---|---|
| video_id | string | "a1b2c3d4" |
| segments | array | [{ word: "never", start: 124.500, end: 124.780, speaker: "SPEAKER_00" }, ...] |

### Subcollection: `videos/{videoId}/clips` (one doc per clip)

| Field | Type | Example |
|---|---|---|
| id | string | "x7y8z9" |
| video_id | string | "a1b2c3d4" |
| start_time | number | 124.5 |
| end_time | number | 184.5 |
| title | string | "The moment that changed everything" |
| virality_score | number | 87 |
| justification | string | "Bold claim + emotional pause..." |
| status | string | "rendered" |
| render_url | string | "https://firebasestorage.googleapis.com/.../clip_x7y8z9.mp4" |

---

## 7. Environment Variables Needed

### Backend (.env)

| Variable | Purpose | Example |
|---|---|---|
| GOOGLE_APPLICATION_CREDENTIALS | Path to Firebase service account JSON | ./firebase-service-account.json |
| FIREBASE_STORAGE_BUCKET | Firebase Storage bucket name | your-project.appspot.com |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| WHISPERX_MODEL | Whisper model size | large-v2 |
| WHISPERX_DEVICE | CUDA or CPU for WhisperX | cuda |
| WHISPERX_COMPUTE_TYPE | Model precision | float16 |
| HF_AUTH_TOKEN | Hugging Face token for pyannote | hf_xxxxxxxxxxxx |
| PYANNOTE_DEVICE | Force pyannote to CPU | cpu |
| ASSEMBLYAI_API_KEY | AssemblyAI fallback key | your-key |
| USE_ASSEMBLYAI | Switch to AssemblyAI mode | false |
| GEMINI_API_KEY | Google Gemini API key | your-key |
| TEMP_DIR | Where video files are stored | /tmp/clipper |

### Frontend (.env.local)

| Variable | Purpose | Example |
|---|---|---|
| NEXT_PUBLIC_API_URL | Backend API base URL | http://localhost:8000 |

---

## 8. File Creation Order (By Block)

### Block 1: Scaffold + Ingestion (Hours 0–7)

| # | File | Owner | Purpose |
|---|---|---|---|
| 1 | `README.md` | A | Project description, links (filled in later) |
| 2 | `.gitignore` | A | Ignore .env, node_modules, __pycache__, media files |
| 3 | `LICENSE` | A | MIT License |
| 4 | `backend/requirements.txt` | A | All Python dependencies |
| 5 | `backend/app/config.py` | A | Load environment variables |
| 6 | `backend/app/models.py` | A | All Pydantic data models |
| 7 | `backend/app/firebase_client.py` | A | Firestore + Storage helpers |
| 8 | `backend/app/services/downloader.py` | A | yt-dlp: URL → video.mp4 + audio.wav |
| 9 | `backend/app/services/transcriber.py` | A | WhisperX → word-level timestamps (+ AssemblyAI fallback) |
| 10 | `backend/app/services/diarizer.py` | A | pyannote CPU → speaker segments (+ AssemblyAI fallback) |
| 11 | `backend/app/worker.py` | A | Redis worker: picks up jobs, runs pipeline |
| 12 | `backend/app/main.py` | A | FastAPI app with all endpoints |
| 13 | `frontend/` (scaffold) | A | Run create-next-app to generate project |
| 14 | `frontend/styles/globals.css` | B | Dark theme, design tokens, animations |
| 15 | `frontend/app/layout.tsx` | A | Root layout with fonts + metadata |
| 16 | `frontend/lib/api.ts` | A | Typed API client for all endpoints |
| 17 | `frontend/components/URLInput.tsx` | A | URL text input + submit button |
| 18 | `frontend/app/page.tsx` | A | Landing page with hero + URLInput |

> While A builds the entire backend + frontend scaffold, B works on `globals.css` — the design system (dark theme palette, glassmorphism cards, animations, typography tokens). This is B's first parallel task.

**Gate: Paste URL → download video → get transcript with speaker labels**

---

### Block 2: AI Brain + Merge (Hours 7–14)

| # | File | Owner | Purpose |
|---|---|---|---|
| 19 | `backend/app/services/merger.py` | A | Combine transcription + diarization into unified JSON |
| 20 | `backend/app/services/analyzer.py` | B+A | Gemini prompt → viral clip detection (B writes + iterates the prompt, A builds API integration scaffold) |
| 21 | `frontend/components/StatusTracker.tsx` | A | Animated multi-step progress bar |
| 22 | `frontend/app/processing/[id]/page.tsx` | A | Processing status page |
| 23 | `frontend/components/ClipCard.tsx` | B | Clip card with score, title, justification (guided by A's component template) |
| 24 | `frontend/components/TranscriptViewer.tsx` | A | Scrollable transcript with speaker colors |
| 25 | `frontend/app/results/[id]/page.tsx` | A | Results page: transcript + clips |

> B's key contribution here: crafting and iterating the Gemini system prompt in `analyzer.py`. B also builds `ClipCard.tsx` using A's component patterns as a template. A handles all backend logic and the complex frontend components.

**Gate: Full flow — URL → transcript with speakers → AI clips displayed in browser**

---

### Block 3: Video Engine (Hours 14–22)

| # | File | Owner | Purpose |
|---|---|---|---|
| 26 | `backend/app/services/face_tracker.py` | A | MediaPipe face detection + EMA smoothing + speaker-to-face mapping |
| 27 | `backend/app/services/subtitle_generator.py` | A | Generate .ass file with word-by-word color highlight (B defines subtitle style presets) |
| 28 | `backend/app/services/renderer.py` | A | FFmpeg: crop + subtitles + NVENC encode → final MP4 |
| 29 | `frontend/components/VideoPlayer.tsx` | A | HTML5 video player with seek + custom controls |
| 30 | `frontend/components/RenderProgress.tsx` | A | Render progress bar + download button |
| 31 | `frontend/app/results/[id]/clip/[clipId]/page.tsx` | A | Clip render + preview + download page |

> B uses this block to: (1) define the 3 subtitle style presets (colors, fonts, sizes) for `subtitle_generator.py`, (2) build `frontend/components/Navbar.tsx`, and (3) start drafting the README and CONTRIBUTING.md.

**Gate: End-to-end — URL → AI clips → smart-cropped render with subtitles → download MP4**

---

### Block 4: Polish + Deploy (Hours 22–28)

| # | File | Owner | Purpose |
|---|---|---|---|
| 32 | `backend/Dockerfile` | A | Containerize for Railway deployment |
| 33 | `CONTRIBUTING.md` | B | Short contribution guide |
| — | UI polish pass | A+B | Micro-animations, loading skeletons, error toasts, responsive (A writes logic, B tweaks CSS) |
| — | README.md (complete) | B+A | Setup instructions, architecture diagram, AI usage, demo links (B drafts, A reviews technical accuracy) |
| — | Presentation deck | B | 5 slides: problem, workflow, demo, impact, next steps |

---

### Block 5: Demo Prep (Hours 28–34)

| Task | Owner |
|---|---|
| Process 2-3 demo videos fully through the live pipeline | A |
| Dry-run demo 3 times | Both |
| Record video pitch (3-10 min) | B (presenter) + A (demo driver) |
| Fix last bugs | A |
| Final commit + push, verify repo is public | A |
| **SUBMIT by 20:00 IST** | Both |

---

## 9. File-by-File Specifications (What Each File Does)

### Backend Files

#### `config.py`
Loads all environment variables from `.env` file into Python variables. Every other module imports config values from here. One central place to change any setting.

#### `models.py`
Defines the shape of ALL data in the system using Pydantic:
- **VideoStatus enum:** downloading, transcribing, diarizing, analyzing, clips_ready, error
- **ClipStatus enum:** pending, rendering, rendered, error
- **VideoCreateRequest:** youtube_url (string)
- **ClipRenderRequest:** subtitle_style (string, default "bold_yellow")
- **WordSegment:** word, start (float), end (float), speaker (optional string)
- **DiarizationSegment:** speaker (string), start (float), end (float)
- **ViralClip:** start_time, end_time, title, virality_score (0-100), justification
- **FaceCoordinate:** frame_number, x, y, width, height, speaker
- **VideoResponse:** video_id, status, title, duration, transcript, clips
- **ClipStatusResponse:** clip_id, status, render_url

#### `firebase_client.py`
Functions for all Firestore + Storage operations:
- `init_firebase()` — initialize Firebase Admin SDK on app startup
- `create_video_doc(video_id, youtube_url)` — create initial video document
- `update_video_status(video_id, status)` — update status field
- `save_transcript(video_id, segments)` — save merged transcript array
- `save_clips(video_id, clips)` — save viral clips as subcollection docs
- `get_video(video_id)` — read video doc + transcript + clips
- `get_clip(clip_id)` — read single clip doc
- `update_clip_status(video_id, clip_id, status, render_url)` — update after render
- `upload_to_storage(local_path, remote_path)` — upload file, return public URL

#### `services/downloader.py`
Single function: `download_video(youtube_url, video_id)`
- Creates directory `/tmp/clipper/{video_id}/`
- Uses yt-dlp to download best video (max 1080p) → `video.mp4`
- Uses yt-dlp to extract best audio → converts to `audio.wav` via FFmpeg
- Extracts metadata: video title, duration in seconds
- Returns dict with paths + metadata

#### `services/transcriber.py`
Two implementations behind a router function:
- `transcribe_whisperx(audio_path)` — PRIMARY
  - Loads WhisperX model on CUDA GPU
  - Transcribes audio → gets text segments
  - Loads Wav2Vec2 alignment model
  - Forced-aligns transcript → word-level timestamps (millisecond-precise)
  - Returns list of WordSegment (without speaker field)
- `transcribe_assemblyai(audio_path)` — FALLBACK
  - Uploads audio to AssemblyAI API with speaker_labels=True
  - Returns list of WordSegment WITH speaker field already populated
- `transcribe(audio_path)` — checks config.USE_ASSEMBLYAI flag, calls the right one

#### `services/diarizer.py`
Two implementations behind a router function:
- `diarize_pyannote(audio_path)` — PRIMARY
  - Loads pyannote pipeline from Hugging Face (requires HF_AUTH_TOKEN)
  - Runs on CPU (device="cpu") to avoid CUDA dependency issues
  - Iterates over diarization tracks → extracts speaker labels with time ranges
  - Returns list of DiarizationSegment
- `diarize_assemblyai(audio_path)` — FALLBACK
  - Returns empty list (speaker labels already in transcription output)
- `diarize(audio_path)` — checks config, calls the right one

#### `services/merger.py`
Single function: `merge_transcript(transcription, diarization)`
- For each word in the transcription list:
  - Calculate word midpoint: (start + end) / 2
  - Find the diarization segment where segment.start <= midpoint <= segment.end
  - Assign that segment's speaker label to the word
- Edge case: word between segments → assign nearest segment's speaker
- Edge case: word in silence (no segment) → assign "UNKNOWN"
- If USE_ASSEMBLYAI is true, transcription already has speakers → return as-is
- Returns list of WordSegment with speaker field populated

#### `services/analyzer.py`
Single function: `find_viral_clips(transcript, video_duration)`
- Converts merged transcript into readable timestamped text:
  `"[00:02:04 - SPEAKER_00] Never gonna give you up..."`
- Builds a system prompt: "You are a viral content strategist..."
- Builds user prompt with the full transcript text
- Calls Gemini 2.0 Flash API requesting structured JSON output
- Parses response into list of ViralClip objects
- Validates: timestamps within [0, video_duration], scores within [0, 100]
- Sorts by virality_score descending
- Returns 3-7 clips

#### `services/face_tracker.py`
Two functions:
- `track_faces(video_path, start_time, end_time, transcript)`:
  - Opens video with OpenCV, seeks to start_time
  - For each frame until end_time: runs MediaPipe FaceDetection
  - Stores raw bounding box coordinates per face per frame
  - Applies Exponential Moving Average (EMA) smoothing to coordinates
    - Formula: smoothed = alpha × raw + (1 - alpha) × previous_smoothed
    - Alpha = 0.15 (lower = smoother panning)
  - Maps speakers to faces using position heuristic (left = SPEAKER_00, right = SPEAKER_01)
  - Returns list of FaceCoordinate per frame
- `calculate_crop_coordinates(face_coords, video_width, video_height)`:
  - For each frame: calculates 9:16 crop window centered on the active speaker's face
  - crop_width = video_height × (9/16)
  - crop_x = face_center_x - (crop_width / 2), clamped to valid range
  - Returns list of crop rectangles per frame

#### `services/subtitle_generator.py`
Single function: `generate_ass_subtitles(transcript, start_time, end_time, output_path, style)`
- Filters transcript to words within [start_time, end_time]
- Groups words into display lines (max ~6 words per line)
- Writes ASS file header with script info and style definitions
- For each line of words: creates a Dialogue event with:
  - ASS color override tags that switch color at each word's timestamp
  - Words already spoken = highlight color, upcoming words = base color
- Three preset styles:
  - **bold_yellow:** Montserrat Black, size 22, white text, yellow highlight
  - **clean_white:** Inter, size 18, white text, cyan highlight
  - **neon_glow:** Outfit Bold, size 24, white text, magenta highlight, thick border
- Saves .ass file to output_path

#### `services/renderer.py`
Single function: `render_short(video_path, crop_coords, subtitle_path, start_time, end_time, output_path)`
- Builds FFmpeg command:
  - Input: original video file, trimmed to [start_time, end_time]
  - Video filter chain: crop (using face coordinates) → scale to 1080×1920 → burn subtitles from .ass
  - GPU mode: h264_nvenc encoder for ~5-10 second render time
  - CPU fallback: libx264 encoder for ~30-60 second render time
  - Audio: AAC 128kbps
- Runs FFmpeg as subprocess
- Hackathon simplification: uses average crop position for entire clip (static crop) rather than per-frame dynamic crop
- Returns path to rendered MP4 file

#### `worker.py`
Main worker loop + two pipeline functions:
- `main()`: infinite loop that pops jobs from Redis queues ("pipeline_queue" and "render_queue") and dispatches to the right handler
- `process_video(video_id)`: calls downloader → transcriber → diarizer → merger → analyzer in sequence, updating Firestore status at each stage, with error handling
- `render_clip(video_id, clip_id)`: calls face_tracker → subtitle_generator → renderer in sequence, uploads result to Firebase Storage, updates Firestore

#### `main.py`
FastAPI application with 5 endpoints (see API Endpoints section above), CORS middleware for frontend access, and Firebase initialization on startup.

---

### Frontend Files

#### `globals.css`
Dark theme design system with CSS custom properties:
- Background: near-black (#0a0a0f)
- Accent gradient: purple (#7c3aed) to cyan (#06b6d4)
- Glassmorphism card styles (semi-transparent with blur)
- Micro-animations: score pulse, status flow, fade-in
- Typography: Google Fonts (Inter)

#### `layout.tsx`
Root layout: imports Google Fonts, sets page metadata (title, description), wraps children in global styles.

#### `api.ts`
Typed fetch wrapper with 5 functions matching the 5 API endpoints. All functions handle errors and return typed responses.

#### `URLInput.tsx`
Controlled text input for YouTube URLs. On submit: calls `submitVideo()` from api.ts, then navigates to `/processing/{video_id}`. Visual: large input with glow effect, gradient button.

#### `page.tsx` (landing)
Full-screen hero section with tagline, description, and the URLInput component centered.

#### `StatusTracker.tsx`
Shows 5 pipeline stages as connected nodes: Download → Transcribe → Diarize → Analyze → Done. Current stage pulses with animation. Completed stages show green check. Receives current status as prop.

#### `processing/[id]/page.tsx`
Fetches video status every 2 seconds via polling. Shows StatusTracker component. When status becomes "clips_ready", automatically redirects to `/results/{id}`.

#### `ClipCard.tsx`
Glass-morphism card displaying: circular virality score (animated fill from 0 to score), clip title, time range badge (e.g., "2:04 - 3:04"), justification text (collapsible), "View Details" button linking to clip page.

#### `TranscriptViewer.tsx`
Scrollable container of word spans. Each word colored by speaker (SPEAKER_00 = blue, SPEAKER_01 = green, etc.). Clicking a word seeks the video player to that timestamp. If a clip range is selected, words within range are highlighted with a background.

#### `VideoPlayer.tsx`
Wrapper around HTML5 `<video>` element with custom controls (play/pause, seek bar, volume, fullscreen). Accepts optional startTime and endTime props to auto-seek and auto-stop.

#### `results/[id]/page.tsx`
Two-column layout. Left column: VideoPlayer (original video) with TranscriptViewer below. Right column: list of ClipCards sorted by virality score descending. Fetches all data from `GET /api/videos/{id}`.

#### `RenderProgress.tsx`
Polls `GET /api/clips/{clipId}/status` every 2 seconds. While "rendering": shows animated progress bar. When "rendered": shows VideoPlayer with rendered clip + download button.

#### `results/[id]/clip/[clipId]/page.tsx`
Top: VideoPlayer (shows original video at clip timestamps, or rendered clip if available). Middle: clip metadata (title, score, justification, time range). Bottom: "Render as Vertical Short" button (if pending) or RenderProgress component (if rendering/rendered).

#### `Navbar.tsx`
Simple top navigation bar with app logo, app name, and a link back to home.

---

## 10. Module Dependency Graph

```
main.py
  ├── imports: models.py, firebase_client.py
  ├── pushes jobs to: Redis
  └── reads from: Firestore

worker.py
  ├── imports: models.py, config.py
  ├── reads jobs from: Redis
  ├── calls: downloader.py → transcriber.py → diarizer.py → merger.py → analyzer.py
  ├── calls: face_tracker.py → subtitle_generator.py → renderer.py
  └── writes to: Firestore (via firebase_client.py)

downloader.py    → uses: yt-dlp (subprocess), produces files in /tmp/
transcriber.py   → uses: WhisperX (local GPU) or AssemblyAI (API)
diarizer.py      → uses: pyannote (local CPU) or AssemblyAI (API)
merger.py        → pure Python logic, no external dependencies
analyzer.py      → uses: Google Gemini API (google-generativeai library)
face_tracker.py  → uses: MediaPipe, OpenCV
subtitle_generator.py → pure Python string manipulation, writes .ass files
renderer.py      → uses: FFmpeg (subprocess), firebase_client.py for upload
```

**Key insight: A handles all core engineering while B provides critical non-code and guided-code contributions in parallel.** A builds the entire backend pipeline (downloader → transcriber → diarizer → merger → analyzer API → face tracker → renderer) and the frontend skeleton. B crafts the Gemini viral detection prompt, designs the CSS theme, builds simpler components (ClipCard, Navbar), writes documentation (README, CONTRIBUTING), and prepares the presentation + video pitch. They connect through the shared models.py data shapes and API contracts.

---

## 11. Pre-Hackathon Checklist (Do This Week)

- [ ] Test WhisperX + pyannote CPU on a 2-minute audio file (GO/NO-GO for primary vs. AssemblyAI)
- [ ] Sign up for AssemblyAI — get $50 free credits (fallback)
- [ ] Install MediaPipe + FFmpeg on GPU laptop
- [ ] Verify FFmpeg NVENC encoding works (test with a sample video)
- [ ] Get Gemini API key from Google AI Studio
- [ ] Set up Firebase project + Firestore database + Storage bucket
- [ ] Download Firebase service account JSON
- [ ] Install Redis locally (or plan to use Railway Redis)
- [ ] Both members install Node.js 18+, Python 3.11+, Git
- [ ] Both members join Discord, change nicknames
- [ ] Prepare presentation PPT template
- [ ] Pick 3 demo videos (short podcasts, 3-5 min each, multi-speaker)
