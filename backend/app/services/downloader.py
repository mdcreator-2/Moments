import yt_dlp
import os
import glob

def download_video(url,video_id):
    output_path = f"/tmp/clipper/{video_id}"
    os.makedirs(output_path,exist_ok=True)
    ydl_opts = {
        'format': 'b',  # Unconditional fallback to pre-combined 720p/360p MP4 guaranteed to bypass DASH locks
        'outtmpl': f'{output_path}/video.%(ext)s',
    }
    
    # Secure Cookie Injection for YouTube Bot-Bypass
    if os.path.exists("cookies.txt"):
        ydl_opts['cookiefile'] = 'cookies.txt'
        
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)

    title = info.get("title", "")
    duration = info.get("duration", 0)
    
    # Dynamically find the file (yt-dlp will save it to video.mp4 or video.webm)
    video_search = glob.glob(f"{output_path}/video.*")
    final_path = video_search[0] if video_search else f"{output_path}/video.mp4"
    
    return {
           "video_path": final_path,
           "audio_path": final_path,   # The AssemblyAI client natively extracts audio streams from mp4 payloads flawlessly!
           "title": title,
           "duration": duration
    }