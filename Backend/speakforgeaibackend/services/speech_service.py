import os
import shutil
from faster_whisper import WhisperModel


class SpeechService:

    def __init__(self):

        self.upload_dir = "uploads"

        os.makedirs(self.upload_dir, exist_ok=True)

        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio):

        file_path = os.path.join(
            self.upload_dir,
            audio.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)

        segments, info = self.model.transcribe(file_path)

        transcript = " ".join(
            segment.text.strip()
            for segment in segments
        )

        return transcript