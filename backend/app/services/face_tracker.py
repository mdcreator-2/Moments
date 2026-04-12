import os
import urllib.request
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from typing import List, Dict, Optional
from app.models import FaceCoordinate, CropRectangle

def get_active_speaker(transcript: List[Dict], current_time: float) -> Optional[str]:
    for segment in transcript:
        if segment['start'] <= current_time <= segment['end']:
            return segment['speaker']
    return None

def get_speaker_mapping(transcript: List[Dict]) -> Dict[str, int]:
    unique_speakers = set(segment.get('speaker', '') for segment in transcript)
    sorted_speakers = sorted([s for s in unique_speakers if s])
    return {speaker: i for i, speaker in enumerate(sorted_speakers)}

def track_faces(video_path: str, start_time: float, end_time: float, transcript: List[Dict]) -> List[List[FaceCoordinate]]:
    model_path = os.path.join(os.path.dirname(__file__), 'blaze_face_short_range.tflite')
    if not os.path.exists(model_path):
        print("Downloading MediaPipe face detection model...")
        urllib.request.urlretrieve(
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
            model_path
        )
        
    cap = cv2.VideoCapture(video_path)
    cap.set(cv2.CAP_PROP_POS_MSEC, start_time * 1000.0)
    
    base_options = python.BaseOptions(model_asset_path=model_path)
    options = vision.FaceDetectorOptions(base_options=base_options, min_detection_confidence=0.5)
    detector = vision.FaceDetector.create_from_options(options)
    
    speaker_to_index = get_speaker_mapping(transcript)
    
    all_frames_coords: List[List[FaceCoordinate]] = []
    
    alpha = 0.15
    previous_smoothed: Dict[int, tuple] = {}
    
    frame_index = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        current_time_sec = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
        
        if current_time_sec > end_time:
            break
            
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        results = detector.detect(mp_image)
        
        current_active_speaker = get_active_speaker(transcript, current_time_sec)
        target_face_index = speaker_to_index.get(current_active_speaker, 0)
        
        frame_faces: List[FaceCoordinate] = []
        
        if results.detections:
            raw_faces = []
            for detection in results.detections:
                bboxC = detection.bounding_box
                raw_x = bboxC.origin_x
                raw_y = bboxC.origin_y
                raw_w = bboxC.width
                raw_h = bboxC.height
                center_x = raw_x + (raw_w / 2.0)
                raw_faces.append((center_x, raw_x, raw_y, raw_w, raw_h))
            
            # Sort faces from left to right based on center_x
            raw_faces.sort(key=lambda f: f[0])
            
            for face_idx, face_data in enumerate(raw_faces):
                _, raw_x, raw_y, raw_w, raw_h = face_data
                raw_box = (raw_x, raw_y, raw_w, raw_h)
                
                if face_idx not in previous_smoothed:
                    smoothed_box = raw_box
                else:
                    prev_box = previous_smoothed[face_idx]
                    smoothed_box = tuple(alpha * r + (1 - alpha) * p for r, p in zip(raw_box, prev_box))
                
                previous_smoothed[face_idx] = smoothed_box
                
                is_active = (face_idx == target_face_index) or (len(raw_faces) == 1)
                
                frame_faces.append(FaceCoordinate(
                    frame_index=frame_index,
                    timestamp=current_time_sec,
                    x=smoothed_box[0],
                    y=smoothed_box[1],
                    width=smoothed_box[2],
                    height=smoothed_box[3],
                    speaker_label=f"Face_{face_idx}",
                    is_active_speaker=is_active
                ))
        
        all_frames_coords.append(frame_faces)
        frame_index += 1
        
    cap.release()
    return all_frames_coords

def calculate_crop_coordinates(face_coords_per_frame: List[List[FaceCoordinate]], video_width: int, video_height: int) -> List[CropRectangle]:
    crop_rectangles: List[CropRectangle] = []
    crop_width = int(video_height * (9 / 16.0))
    
    last_known_crop_x = int((video_width - crop_width) / 2)
    
    for frame_faces in face_coords_per_frame:
        if not frame_faces:
            # Fallback for missing frames: use last known crop
            if crop_rectangles:
                last_crop = crop_rectangles[-1]
                crop_rectangles.append(CropRectangle(
                    frame_index=last_crop.frame_index + 1,
                    timestamp=last_crop.timestamp + 0.033, # Rough estimate approx 30fps
                    x=last_crop.x,
                    y=0,
                    width=crop_width,
                    height=video_height
                ))
            continue
            
        target_face = next((fc for fc in frame_faces if fc.is_active_speaker), None)
        
        if not target_face:
            # If the target speaker isn't found (e.g., they walked off screen),
            # fallback to the nearest face to center, or default to the first face.
            target_face = frame_faces[0]
            
        face_center_x = target_face.x + (target_face.width / 2.0)
        crop_x = int(face_center_x - (crop_width / 2.0))
        crop_x = max(0, min(crop_x, video_width - crop_width))
        
        last_known_crop_x = crop_x
        
        crop_rectangles.append(CropRectangle(
            frame_index=target_face.frame_index,
            timestamp=target_face.timestamp,
            x=crop_x,
            y=0,
            width=crop_width,
            height=video_height
        ))
        
    return crop_rectangles
