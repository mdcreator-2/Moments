import yt_dlp 
import os

def download_video(url,video_id):
    output_path = f"/tmp/clipper/{video_id}"
    os.mkdir(output_path,exist_ok=True)
    ydl_opts_video = {
        'format': 'bestvideo[height<=1080]',
        'merge_output_format': 'mp4',
        'outtmpl': f'{output_path}/video.%(ext)s'
        
    }
    ydl_opts_audio = {
        'format': 'bestaudio',
        'merge_output_format': 'wav',
        'outtmpl': f'{output_path}/audio.%(ext)s'
    }
    with yt_dlp.YoutubeDL(ydl_opts_video) as ydl:
        ydl.download([url])
    with yt_dlp.YoutubeDL(ydl_opts_audio) as ydl:
        ydl.download([url])
    info = ydl.extract_info(url, download=False)
    title = info.get("title", "")
    duration = info.get("duration", 0)
    return {
                 
           "video_path": output_path+"/video.mp4",
           "audio_path": output_path+"/audio.wav",
           "title": title,
           "duration": duration
    }