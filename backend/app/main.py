from fastapi import FastAPI
import json
import redis
import uuid
import app.config
from app.models import VideoRequest, VideoResponse, VideoStatus

r = redis.Redis.from_url(app.config.REDIS_URL, decode_responses=True)

app = FastAPI()

@app.post("/api/videos")
async def video_request(request: VideoRequest):
    video_id = str(uuid.uuid4())
    job = {
        "video_id": video_id,
        "youtube_url": request.youtube_url,
        "status": "downloading"
    }
    r.rpush("job",json.dumps(job))
    r.set(video_id,json.dumps(VideoStatus(status="downloading")))
    return VideoResponse(video_id=video_id,status="downloading")

@app.get("/api/videos/{video_id}")
async def get_video_status(video_id: str):
    status = r.get(video_id)
    return VideoStatus.model_validate_json(status)