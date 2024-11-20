import whisper
import sys

# Load Whisper model
model = whisper.load_model("base")

# Get the audio file path from command line arguments
audio_path = sys.argv[1]

# Transcribe the audio file
result = model.transcribe(audio_path)

# Print the transcription result
print(result["text"])
