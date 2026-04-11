def merge_transcript(transcription: list[dict], diarization: list[dict]) -> list[dict]:
    """
    Merges word-level transcription with speaker diarization segments.
    
    Args:
        transcription: flat list of {word, start, end} dicts from transcriber.py
        diarization:   flat list of {speaker, start, end} dicts from diarizer.py
    
    Returns:
        flat list of {word, start, end, speaker} dicts
    """
    merged = []

    for word in transcription:
        midpoint = (word["start"] + word["end"]) / 2
        assigned_speaker = None
        min_distance = float("inf")

        for segment in diarization:
            # Check if midpoint falls within this segment
            if segment["start"] <= midpoint <= segment["end"]:
                assigned_speaker = segment["speaker"]
                break

            # Track nearest segment for edge cases (silence/gap between segments)
            distance = min(
                abs(midpoint - segment["start"]),
                abs(midpoint - segment["end"])
            )
            if distance < min_distance:
                min_distance = distance
                assigned_speaker = segment["speaker"]

        merged.append({
            "word": word["word"],
            "start": word["start"],
            "end": word["end"],
            "speaker": assigned_speaker if assigned_speaker else "UNKNOWN"
        })

    return merged