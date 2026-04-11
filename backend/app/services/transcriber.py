import requests
import time
from app.config import ASSEMBLYAI_API_KEY

BASE_URL = "https://api.assemblyai.com"
HEADERS = {"authorization": ASSEMBLYAI_API_KEY}


def transcribe_audio(audio_path: str) -> list[dict]:
    print("[Transcriber] Uploading audio to AssemblyAI...")
    with open(audio_path, "rb") as f:
        upload_response = requests.post(
            f"{BASE_URL}/v2/upload", headers=HEADERS, data=f
        )
    upload_response.raise_for_status()
    audio_url = upload_response.json()["upload_url"]
    print(f"[Transcriber] Uploaded: {audio_url[:60]}...")
    data = {
        "audio_url": audio_url,
        "language_detection": True,
        "speaker_labels": True,
        "speech_models": ["universal-3-pro", "universal-2"],
    }
    response = requests.post(f"{BASE_URL}/v2/transcript", json=data, headers=HEADERS)
    response.raise_for_status()
    transcript_id = response.json()["id"]
    print(f"[Transcriber] Transcription started: {transcript_id}")
    polling_url = f"{BASE_URL}/v2/transcript/{transcript_id}"
    while True:
        result = requests.get(polling_url, headers=HEADERS).json()

        if result["status"] == "completed":
            print("[Transcriber] Transcription complete!")
            break
        elif result["status"] == "error":
            raise Exception(f"AssemblyAI error: {result['error']}")
        else:
            print(f"[Transcriber] Status: {result['status']}...")
            time.sleep(3)

    words = []
    for word in result.get("words", []):
        words.append({
            "word": word["text"],
            "start": word["start"] / 1000,
            "end": word["end"] / 1000,
            "speaker": word.get("speaker", "UNKNOWN"),
        })

    print(f"[Transcriber] {len(words)} words with speaker labels")
    return words