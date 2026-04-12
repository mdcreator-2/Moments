from pydantic import BaseModel

class VideoRequest(BaseModel):
    youtube_url: str

class VideoResponse(BaseModel):
    video_id: str
    status: str

class VideoStatus(BaseModel):
    status: str

class ClipRenderRequest(BaseModel):
    subtitle_style: str = "bold_yellow"

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

class FaceCoordinate(BaseModel):
    frame_index: int
    timestamp: float
    x: float
    y: float
    width: float
    height: float
    speaker_label: str
    is_active_speaker: bool

class CropRectangle(BaseModel):
    frame_index: int
    timestamp: float
    x: int
    y: int
    width: int
    height: int
