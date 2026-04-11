import redis
import os
import json
import app.config
from app.services import downloader, transcriber

r = redis.Redis.from_url(app.config.REDIS_URL, decode_responses=True)

while True:
    payload = r.blpop("job")
    job = json.loads(payload[1])
    #Downloading
    try:
        download_result = downloader.download_video(job["youtube_url"],job["video_id"])
    except Exception as e:
        print(e)
    #transcribing
    try:
        transcriber_result = transcriber.transcribe_audio(download_result["audio_path"])
    except Exception as e:
        print(e)
    #diarizing
    try:
        diarizer_result = diarizer.diarize(download_result["audio_path"])
    except Exception as e:
        print(e)
