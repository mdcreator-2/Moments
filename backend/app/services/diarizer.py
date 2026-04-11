import pyannote.audio
import os
import torch
from pyannote.audio import Pipeline
from app.config import DEVICE, HF_AUTH_TOKEN, USE_ASSEMBLYAI, ASSEMBLYAI_API_KEY

# Fix for PyTorch 2.6+ weights_only default change
# Safe here — we only load trusted pyannote models from Hugging Face
_original_torch_load = torch.load
torch.load = lambda *args, **kwargs: _original_torch_load(*args, **{k: v for k, v in kwargs.items() if k != "weights_only"}, weights_only=False)


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