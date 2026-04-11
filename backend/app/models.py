from pydantic import BaseModel

class VideoRequest(BaseModel):
    youtube_url: str

class VideoResponse(BaseModel):
    video_id: str
    status: str

class VideoStatus(BaseModel):
    status: str