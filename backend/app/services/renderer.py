import subprocess
import os

def escape_path_for_ffmpeg(path: str) -> str:
    """Escapes Windows absolute paths for use inside FFmpeg filter graphs."""
    p = os.path.abspath(path).replace('\\', '/')
    # FFmpeg filters use ':' as an argument separator, so the drive letter colon must be escaped
    p = p.replace(':', '\\:')
    return p

def render_short(video_path: str, crop_coords: list, subtitle_path: str, start_time: float, end_time: float, output_path: str) -> str:
    """
    Renders the final vertical video using the calculated average crop and burning the ASS subtitles.
    Attempts NVENC hardware acceleration first, falls back to libx264 CPU rendering.
    """
    if not crop_coords:
        raise ValueError("No crop coordinates provided.")

    # Calculate average crop position across the tracked segment to create a stable, non-jittery camera
    avg_x = int(sum(c.x for c in crop_coords) / len(crop_coords))
    crop_width = crop_coords[0].width
    crop_height = crop_coords[0].height
    avg_y = 0  # Full height crop for 9:16
    
    esc_sub = escape_path_for_ffmpeg(subtitle_path)
    
    # Filter string: Crop -> Scale to standard 1080x1920 -> Overlay Subtitles
    vf_string = f"crop={crop_width}:{crop_height}:{avg_x}:{avg_y},scale=1080:1920,ass='{esc_sub}'"
    
    # Base command for 128kbps AAC audio and time trim
    base_cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start_time),
        "-to", str(end_time),
        "-i", video_path,
        "-vf", vf_string,
        "-c:a", "aac",
        "-b:a", "128k"
    ]
    
    nvenc_cmd = base_cmd + ["-c:v", "h264_nvenc", "-preset", "p4", output_path]
    x264_cmd = base_cmd + ["-c:v", "libx264", "-preset", "fast", output_path]
    
    print("[Renderer] Attempting hardware-accelerated render (NVENC)...")
    try:
        subprocess.run(nvenc_cmd, check=True, capture_output=True, text=True)
        print("[Renderer] Hardware render successful!")
        return output_path
    except subprocess.CalledProcessError as e:
        print("[Renderer] Hardware render failed. This is expected if you don't have an Nvidia GPU setup.")
        print("[Renderer] Falling back to CPU render (libx264)...")
    
    # Fallback to pure CPU render
    subprocess.run(x264_cmd, check=True)
    print("[Renderer] CPU render successful!")
    
    return output_path
