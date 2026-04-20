import os
from pytubefix import YouTube

def download_video(url, video_id):
    try:
        output_path = f"/tmp/clipper/{video_id}"
        os.makedirs(output_path, exist_ok=True)
        
        print(f"[Downloader] Initializing Pytubefix Bot Bypass for URL: {url}")
        
        yt = YouTube(url)
        
        stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
        
        if not stream:
            print("[Downloader] Progressive stream missing. Triggering absolute mp4 fallback...")
            stream = yt.streams.filter(file_extension='mp4').first()
            
        print(f"[Downloader] Located stream payload: {stream}. Initiating hardware download...")
        
        final_path = stream.download(output_path=output_path, filename="video.mp4")
        
        return {
            "video_path": final_path,
            "audio_path": final_path,
            "title": yt.title,
            "duration": yt.length
        }
    except Exception as e:
        print(f"[Downloader] Fatal Error pulling video via Pytubefix: {e}")
        raise e