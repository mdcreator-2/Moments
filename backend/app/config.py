import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

REDIS_URL = os.getenv("REDIS_URL")
DEVICE = os.getenv("DEVICE")
BATCH_SIZE = os.getenv("BATCH_SIZE")
COMPUTE_TYPE = os.getenv("COMPUTE_TYPE")
HF_AUTH_TOKEN = os.getenv("HF_AUTH_TOKEN")
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
USE_ASSEMBLYAI = os.getenv("USE_ASSEMBLYAI")