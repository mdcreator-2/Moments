import cv2
import uuid
import sys
import os

# Ensure the parent directory is in the path to allow direct execution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.downloader import download_video
from app.services.transcriber import transcribe_audio
from app.services.analyzer import find_viral_clips
from app.services.face_tracker import track_faces, calculate_crop_coordinates

def test_full_pipeline(youtube_url: str):
    print("\n" + "="*50)
    print("=== 1. DOWNLOADING ===")
    print("="*50)
    vid_id = str(uuid.uuid4())[:8]
    media_info = download_video(youtube_url, vid_id)
    video_path = media_info["video_path"]
    audio_path = media_info["audio_path"]
    duration = media_info["duration"]
    
    print("\n" + "="*50)
    print("=== 2. TRANSCRIBING ===")
    print("="*50)
    transcript = transcribe_audio(audio_path)
    
    print("\n" + "="*50)
    print("=== 3. ANALYZING FOR VIRAL CLIPS ===")
    print("="*50)
    clips = find_viral_clips(transcript, duration)
    
    if not clips:
        print("No clips found.")
        return
        
    print(f"Found {len(clips)} clips! Picking the highest-scoring one for tracking preview.")
    top_clip = clips[0]
    print(f"--> [{top_clip.virality_score}/100] '{top_clip.title}'")
    print(f"    Target Time: {top_clip.start_time}s to {top_clip.end_time}s")
    print(f"    Justification: {top_clip.justification}")
    
    print("\n" + "="*50)
    print("=== 4. FACE TRACKING (MediaPipe Tasks API) ===")
    print("="*50)
    # Track faces only within the clip segment to save time
    face_data = track_faces(video_path, top_clip.start_time, top_clip.end_time, transcript)
    
    cap = cv2.VideoCapture(video_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Calculate vertical (9:16) coordinate rectangles
    crops = calculate_crop_coordinates(face_data, width, height)
    
    print("\n" + "="*50)
    print("=== 5. DYNAMIC PREVIEW ===")
    print("="*50)
    print("Spawning OpenCV Window... Press 'q' to stop.")
    cap.set(cv2.CAP_PROP_POS_MSEC, top_clip.start_time * 1000)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    
    for frame_idx, crop in enumerate(crops):
        ret, frame = cap.read()
        if not ret:
            break
            
        # Draw the target vertical 9:16 crop window
        cv2.rectangle(frame, (crop.x, crop.y), (crop.x + crop.width, crop.y + crop.height), (0, 255, 0), 4)
        
        current_time = top_clip.start_time + (float(frame_idx) / fps)
        
        # Identify who is speaking right now from the transcript
        active_spk = next((s['speaker'] for s in transcript if s['start'] <= current_time <= s['end']), "Unknown")
        
        cv2.putText(frame, f"Active Speaker: {active_spk}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(frame, f"Clip Time: {current_time:.2f}s", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        cv2.imshow("Full E2E Tracker E2E Preview", frame)
        
        # Mimic actual playback speed
        if cv2.waitKey(int(1000/fps)) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # Supply your test podcast YouTube URL right here!
    test_url = "https://www.youtube.com/watch?v=rwV1dWXAGYM" # Modify to your sample podcast!
    test_full_pipeline(test_url)
