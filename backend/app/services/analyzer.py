import google.generativeai as genai
import os
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def _build_transcript_text(transcript: list[dict]) -> str:
    """Converts merged word list into readable timestamped text for the prompt."""
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


def find_viral_clips(transcript: list[dict], video_duration: float) -> list[dict]:
    """
    Sends merged transcript to Gemini and returns 3-7 viral clip suggestions.

    Args:
        transcript:      flat merged list of {word, start, end, speaker} dicts
        video_duration:  total duration of video in seconds

    Returns:
        list of dicts: {start_time, end_time, title, virality_score, justification}
        sorted by virality_score descending
    """
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

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=system_prompt
    )

    print("[Analyzer] Sending transcript to Gemini...")
    response = model.generate_content(user_prompt)

    raw = response.text.strip()
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

        validated.append({
            "start_time":     start,
            "end_time":       end,
            "title":          clip["title"],
            "virality_score": score,
            "justification":  clip["justification"]
        })

    validated.sort(key=lambda c: c["virality_score"], reverse=True)
    print(f"[Analyzer] Found {len(validated)} viral clips.")
    return validated