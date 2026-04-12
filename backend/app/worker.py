import redis
import json
import os
import cv2
import traceback
from app.config import REDIS_URL
from app.services import downloader, transcriber, analyzer, face_tracker, subtitle_generator, renderer

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def update_status(video_id, status):
    r.set(video_id, status)
    print(f"[Worker] Video {video_id} → {status}")

def update_clip_status(video_id, clip_index, status, url=None):
    r.set(f"clip:{video_id}:{clip_index}:status", status)
    if url:
        r.set(f"clip:{video_id}:{clip_index}:url", url)
    print(f"[Worker] Clip {clip_index} → {status}")

print("[Worker] Initialized and waiting for Redis jobs...")

while True:
    # Listen to both processing queues (First one has priority if multiple are filled)
    queue_name, payload = r.blpop(["job", "render_job"])
    job = json.loads(payload)

    if queue_name == "job":
        video_id = job["video_id"]
        try:
            update_status(video_id, "downloading")
            res = downloader.download_video(job["youtube_url"], video_id)
            
            # Save metadata so renderer can find paths later
            meta = {
                "title": res["title"], 
                "duration": res["duration"], 
                "video_path": res["video_path"], 
                "audio_path": res["audio_path"]
            }
            r.set(f"{video_id}:meta", json.dumps(meta))
            
            update_status(video_id, "transcribing")
            transcript = transcriber.transcribe_audio(res["audio_path"])
            r.set(f"{video_id}:transcript", json.dumps(transcript))
            
            update_status(video_id, "analyzing")
            clips = analyzer.find_viral_clips(transcript, res["duration"])
            
            # Pydantic serialization
            clips_dict = [c.model_dump() for c in clips] if len(clips) > 0 and hasattr(clips[0], 'model_dump') else clips
            r.set(f"{video_id}:clips", json.dumps(clips_dict))
            
            update_status(video_id, "clips_ready")

        except Exception as e:
            print(f"[Worker] Error processing {video_id}: {e}")
            traceback.print_exc()
            update_status(video_id, "error")

    elif queue_name == "render_job":
        video_id = job["video_id"]
        clip_index = job["clip_index"]
        style = job["style"]
        
        try:
            update_clip_status(video_id, clip_index, "rendering")
            
            # Hydrate DB state
            meta = json.loads(r.get(f"{video_id}:meta"))
            clips = json.loads(r.get(f"{video_id}:clips"))
            transcript = json.loads(r.get(f"{video_id}:transcript"))
            
            clip = clips[clip_index]
            start_time = clip["start_time"]
            end_time = clip["end_time"]
            video_path = meta["video_path"]
            
            # 1. Inspect dynamic width/height
            cap = cv2.VideoCapture(video_path)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            cap.release()
            
            print(f"[Worker] Tracking Faces for Clip {clip_index}...")
            
            # 2. Track & Crop
            face_data = face_tracker.track_faces(video_path, start_time, end_time, transcript)
            crops = face_tracker.calculate_crop_coordinates(face_data, width, height)
            
            # 3. Bake Ass Subtitles
            print(f"[Worker] Generating Captions...")
            sub_path = f"/tmp/clipper/{video_id}/sub_{clip_index}.ass"
            subtitle_generator.generate_ass_subtitles(transcript, start_time, end_time, sub_path, style=style)
            
            # 4. Final render with Fallback
            print(f"[Worker] Routing to NVENC/X264 FFmpeg...")
            out_path = f"/tmp/clipper/{video_id}/final_{clip_index}.mp4"
            final_path = renderer.render_short(video_path, meta["audio_path"], crops, sub_path, start_time, end_time, out_path)
            
            update_clip_status(video_id, clip_index, "rendered", url=final_path)
            print(f"[Worker] Render {clip_index} complete!")

        except Exception as e:
            print(f"[Worker] Error rendering clip {clip_index} for {video_id}: {e}")
            traceback.print_exc()
            update_clip_status(video_id, clip_index, "error")
