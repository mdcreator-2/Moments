from pydantic import BaseModel

class VideoRequest(BaseModel):
    youtube_url: str

class VideoResponse(BaseModel):
    video_id: str
    status: str

class VideoStatus(BaseModel):
    status: str

class wordSegment(BaseModel):
    word: str
    start: float
    end: float
    speaker: str

class ViralClip(BaseModel):
    start_time: float
    end_time: float
    title: str
    virality_score: float
    justification: str
