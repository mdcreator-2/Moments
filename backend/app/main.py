from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import redis
import uuid
import os
from app.config import REDIS_URL
from app.models import VideoRequest, ClipRenderRequest

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

app = FastAPI()

# Crucial for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/videos")
async def video_request(request: VideoRequest):
    video_id = str(uuid.uuid4())
    job = {
        "video_id": video_id,
        "youtube_url": request.youtube_url,
    }
    # Push job to pipeline queue
    r.rpush("job", json.dumps(job))
    r.set(video_id, "downloading")
    return {"video_id": video_id, "status": "downloading"}

@app.get("/api/videos/{video_id}")
async def get_video_status(video_id: str):
    status = r.get(video_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Video not found")
        
    response = {"video_id": video_id, "status": status}
    
    # Pack in all the parsed data once the pipeline hits completion
    if status == "clips_ready":
        meta = r.get(f"{video_id}:meta")
        if meta:
            response.update(json.loads(meta))
            
        clips = r.get(f"{video_id}:clips")
        if clips:
            response["clips"] = json.loads(clips)
            
        transcript = r.get(f"{video_id}:transcript")
        if transcript:
            response["transcript"] = json.loads(transcript)
            
    return response

@app.post("/api/videos/{video_id}/clips/{clip_index}/render")
async def trigger_render(video_id: str, clip_index: int, req: ClipRenderRequest = None):
    style = req.subtitle_style if req else "bold_yellow"
    
    job = {
        "video_id": video_id,
        "clip_index": clip_index,
        "style": style
    }
    r.rpush("render_job", json.dumps(job))
    r.set(f"clip:{video_id}:{clip_index}:status", "rendering")
    return {"status": "rendering", "clip_index": clip_index}

@app.get("/api/videos/{video_id}/clips/{clip_index}/status")
async def get_clip_status(video_id: str, clip_index: int):
    status = r.get(f"clip:{video_id}:{clip_index}:status")
    url = r.get(f"clip:{video_id}:{clip_index}:url")
    
    if not status:
        return {"status": "pending"}
        
    return {"status": status, "render_url": f"/api/videos/{video_id}/clips/{clip_index}/download" if url else None}

@app.get("/api/videos/{video_id}/clips/{clip_index}/download")
async def download_clip(video_id: str, clip_index: int):
    # Hackathon static file serving without AWS/Firebase Storage
    url = r.get(f"clip:{video_id}:{clip_index}:url")
    if not url or not os.path.exists(url):
        raise HTTPException(status_code=404, detail="Rendered file no longer exists or hasn't finished")
    return FileResponse(url, media_type="video/mp4", filename=f"moment_{clip_index}.mp4")