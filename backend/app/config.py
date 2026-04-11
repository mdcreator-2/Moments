import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

REDIS_URL = os.getenv("REDIS_URL")
DEVICE = os.getenv("DEVICE")
BATCH_SIZE = os.getenv("BATCH_SIZE")
COMPUTE_TYPE = os.getenv("COMPUTE_TYPE")