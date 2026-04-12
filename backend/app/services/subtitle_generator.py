import os
from typing import List, Dict

def format_ass_time(seconds: float) -> str:
    """Converts seconds to ASS format: H:MM:SS.cs"""
    # Prevent negative times if words start slightly before start_time
    seconds = max(0.0, seconds)
    
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int(round((seconds % 1) * 100))
    
    if cs == 100:
        cs = 0
        s += 1
        if s == 60:
            s = 0
            m += 1
            if m == 60:
                m = 0
                h += 1
                
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def generate_ass_subtitles(transcript: List[Dict], start_time: float, end_time: float, output_path: str, style: str = "bold_yellow"):
    """
    Generates an Advanced SubStation Alpha (.ass) subtitle file.
    It groups words into lines and creates word-level color highlight transitions.
    Timestamps are adjusted so the clip starts at 0:00.
    """
    
    # Filter words strictly within our clip timestamp boundaries
    words = [w for w in transcript if w['start'] >= start_time and w['start'] <= end_time]
    
    styles = {
        "bold_yellow": {
            "base": "FFFFFF",
            "highlight": "00FFFF",  # Yellow in ASS BGR format
            "font": "Montserrat Black",
            "size": 22,
            "border": 2
        },
        "clean_white": {
            "base": "FFFFFF",
            "highlight": "FFFF00",  # Cyan in ASS BGR format
            "font": "Inter",
            "size": 18,
            "border": 1
        },
        "neon_glow": {
            "base": "FFFFFF",
            "highlight": "FF00FF",  # Magenta in ASS BGR format
            "font": "Outfit Bold",
            "size": 24,
            "border": 4
        }
    }
    
    config = styles.get(style, styles["bold_yellow"])
    base_color = config["base"]
    hl_color = config["highlight"]
    
    # Outputting using a standard 384x683 (9:16) coordinate space.
    # This automatically makes size 20-24 look perfectly proportional on TikToks.
    ass_header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 384
PlayResY: 683
WrapStyle: 1

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{config['font']},{config['size']},&H00{base_color},&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,{config['border']},0,2,10,10,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    lines = []
    # Maximum 6 words per line
    current_line = []
    for w in words:
        current_line.append(w)
        if len(current_line) >= 6:
            lines.append(current_line)
            current_line = []
            
    if current_line:
        lines.append(current_line)

    events = []
    
    for line in lines:
        for i in range(len(line)):
            evt_start = line[i]['start']
            
            if i < len(line) - 1:
                evt_end = line[i+1]['start']
            else:
                evt_end = line[i]['end']
                
            # Cap maximum word hang-time if there's a long pause in speech
            if evt_end - evt_start > 1.5:
                evt_end = evt_start + 1.5
                
            # Re-zero timestamps relative to the Start of the Clip
            start_str = format_ass_time(evt_start - start_time)
            end_str = format_ass_time(evt_end - start_time)
            
            # Construct color tag strings
            spoken_words = " ".join([w['word'] for w in line[:i+1]])
            upcoming_words = " ".join([w['word'] for w in line[i+1:]])
            
            text = f"{{\\c&H{hl_color}&}}{spoken_words}"
            if upcoming_words:
                text += f" {{\\c&H{base_color}&}}{upcoming_words}"
                
            events.append(f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text}")

    # Ensure output directory exists (if output_path includes subdirectories)
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ass_header)
        for e in events:
            f.write(e + "\n")
