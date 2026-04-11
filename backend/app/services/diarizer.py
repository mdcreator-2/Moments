import pyannote.audio
import os
from pyannote.audio import Pipeline

DEVICE = "cpu"
HF_AUTH_TOKEN = app.config.HF_AUTH_TOKEN
USE_ASSEMBLYAI = app.config.USE_ASSEMBLYAI
ASSEMBLYAI_API_KEY = app.config.ASSEMBLYAI_API_KEY


def diarize_pyannote(audio_path: str) -> list[dict]:
    print("[Diarizer] Loading pyannote pipeline...")
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HF_AUTH_TOKEN
    )
    pipeline.to(DEVICE)

    print("[Diarizer] Running diarization...")
    diarization = pipeline(audio_path)

    segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        segments.append({
            "speaker": speaker,
            "start": round(turn.start, 3),
            "end": round(turn.end, 3)
        })

    return segments


def diarize_assemblyai(audio_path: str) -> list[dict]:
    # Speaker labels already embedded in transcription when using AssemblyAI
    # merger.py will handle it — nothing to do here
    return []


def diarize(audio_path: str) -> list[dict]:
    if USE_ASSEMBLYAI:
        print("[Diarizer] AssemblyAI mode — skipping diarization.")
        return diarize_assemblyai(audio_path)
    
    print("[Diarizer] Using pyannote (CPU)...")
    return diarize_pyannote(audio_path)