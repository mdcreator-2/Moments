import assemblyai as aai
from app.config import ASSEMBLYAI_API_KEY

aai.settings.api_key = ASSEMBLYAI_API_KEY


def transcribe_audio(audio_path: str) -> list[dict]:
    print("[Transcriber] Uploading to AssemblyAI...")

    config = aai.TranscriptionConfig(
        speaker_labels=True,
        word_boost=[],
    )

    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_path, config=config)

    if transcript.status == aai.TranscriptStatus.error:
        raise Exception(f"AssemblyAI error: {transcript.error}")

    print(f"[Transcriber] Transcription complete — {len(transcript.words)} words")

    words = []
    for word in transcript.words:
        words.append({
            "word": word.text,
            "start": word.start / 1000,
            "end": word.end / 1000,
            "speaker": word.speaker,
        })

    print(f"[Transcriber] {len(words)} words with speaker labels")
    return words