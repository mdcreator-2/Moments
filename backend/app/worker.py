import redis
import json
from app.config import REDIS_URL
from app.models import VideoStatus
from app.services import downloader, transcriber

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)


def update_status(video_id, status):
    r.set(video_id, VideoStatus(status=status).model_dump_json())
    print(f"[Worker] {video_id} → {status}")


while True:
    print("[Worker] Waiting for job...")
    payload = r.blpop("job")
    job = json.loads(payload[1])
    video_id = job["video_id"]

    try:
        update_status(video_id, "downloading")
        download_result = downloader.download_video(job["youtube_url"], video_id)
        print(f"[Worker] Downloaded: {download_result['title']}")

        update_status(video_id, "transcribing")
        transcript = transcriber.transcribe_audio(download_result["audio_path"])
        print(f"[Worker] Transcribed: {len(transcript)} words with speaker labels")

        #******* USE FIREBASE HERE ******
        r.set(f"{video_id}:transcript", json.dumps(transcript))

        update_status(video_id, "Transcription Ready")
        print(f"[Worker] Ready To Analyze{video_id}")

    except Exception as e:
        print(f"[Worker] Error processing {video_id}: {e}")
        update_status(video_id, "error")
