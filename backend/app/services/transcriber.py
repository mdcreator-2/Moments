import whisperx
import os
import app.config

# Device config — set these in your environment or pass them in
DEVICE = app.config.DEVICE
BATCH_SIZE = int(app.config.BATCH_SIZE)
COMPUTE_TYPE = app.config.COMPUTE_TYPE

def transcribe_audio(audio_path: str) -> list[dict]:

    print("[Transcriber] Loading Faster-Whisper model...")
    model = whisperx.load_model("base", DEVICE, compute_type=COMPUTE_TYPE)

    print("[Transcriber] Transcribing audio...")
    audio = whisperx.load_audio(audio_path)
    result = model.transcribe(audio, batch_size=BATCH_SIZE)

    print(f"[Transcriber] Detected language: {result['language']}")

    print("[Transcriber] Loading alignment model (Wav2Vec2)...")
    model_a, metadata = whisperx.load_align_model(
        language_code=result["language"],
        device=DEVICE
    )

    print("[Transcriber] Aligning words to waveform...")
    result = whisperx.align(
        result["segments"], model_a, metadata, audio, DEVICE,
        return_char_alignments=False
    )

    return [
        {"word": w["word"], "start": w.get("start"), "end": w.get("end")}
        for segment in result["segments"]
        for w in segment["words"]
    ]