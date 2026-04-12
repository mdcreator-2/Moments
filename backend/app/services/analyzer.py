import os
import json
from app.config import OPENROUTER_API_KEY  # You can rename this to OPENROUTER_API_KEY in your config later
from app.models import ViralClip
from openrouter import OpenRouter

# Initialize the new OpenRouter client
client = OpenRouter(
    api_key=OPENROUTER_API_KEY, # Make sure to put your friend's key in the .env under GEMINI_API_KEY, or change this variable
    server_url="https://ai.hackclub.com/proxy/v1",
)

def _build_transcript_text(transcript: list[dict]) -> str:
    lines = []
    current_speaker = None
    current_line = []
    line_start = 0.0

    for word in transcript:
        speaker = word.get("speaker", "UNKNOWN")
        if speaker != current_speaker:
            if current_line:
                timestamp = f"{int(line_start // 60):02d}:{int(line_start % 60):02d}"
                lines.append(f"[{timestamp} - {current_speaker}] {' '.join(current_line)}")
            current_speaker = speaker
            current_line = [word["word"]]
            line_start = word["start"]
        else:
            current_line.append(word["word"])

    if current_line:
        timestamp = f"{int(line_start // 60):02d}:{int(line_start % 60):02d}"
        lines.append(f"[{timestamp} - {current_speaker}] {' '.join(current_line)}")

    return "\n".join(lines)


def find_viral_clips(transcript: list[dict], video_duration: float) -> list[ViralClip]:
    transcript_text = _build_transcript_text(transcript)

    system_prompt = """You are a viral content strategist specializing in short-form video.
You will be given a transcript of a video with speaker labels and timestamps.
Your job is to identify the most viral-worthy segments for social media clips.

A great viral clip has one or more of:
- A bold, surprising, or controversial claim
- An emotional peak (anger, laughter, shock, inspiration)
- A quotable one-liner or punchline
- A compelling story arc with a clear beginning and payoff
- A moment of genuine disagreement or tension between speakers

Return ONLY a JSON array with no preamble, markdown, or explanation.
Each object must have exactly these fields:
{
  "start_time": <float, seconds>,
  "end_time": <float, seconds>,
  "title": <string, max 8 words>,
  "virality_score": <integer, 0-100>,
  "justification": <string, max 2 sentences>
}"""

    user_prompt = f"""Video duration: {int(video_duration // 60)}m {int(video_duration % 60)}s

Transcript:
{transcript_text}

Find 3 to 7 segments between 30 and 90 seconds long with the highest viral potential.
All start_time and end_time values must be within 0 and {video_duration}.
Return only the JSON array."""

    print("[Analyzer] Sending transcript to OpenRouter (Qwen Model)...")
    
    # Using the new layout from the documentation provided
    response = client.chat.send(
        model="qwen/qwen3-32b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        stream=False,
    )

    # Extract response text based on the OpenRouter schema
    raw = response.choices[0].message.content.strip()
    
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    clips = json.loads(raw)

    # Validate and clamp
    validated = []
    for clip in clips:
        start = max(0.0, float(clip["start_time"]))
        end   = min(video_duration, float(clip["end_time"]))
        score = max(0, min(100, int(clip["virality_score"])))

        if end - start < 10:  # discard malformed clips under 10s
            continue

        validated.append(ViralClip(
            start_time=start,
            end_time=end,
            title=clip["title"],
            virality_score=score,
            justification=clip["justification"]
        ))

    validated.sort(key=lambda c: c.virality_score, reverse=True)
    print(f"[Analyzer] Found {len(validated)} viral clips.")
    return validated