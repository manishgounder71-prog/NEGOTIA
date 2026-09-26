import logging
import sys
import re
from typing import Any, Dict

SENSITIVE_PATTERNS = [
    re.compile(r'password["\']?\s*[:=]\s*["\']?([^"\',]+)', re.IGNORECASE),
    re.compile(r'secret["\']?\s*[:=]\s*["\']?([^"\',]+)', re.IGNORECASE),
    re.compile(r'api[-_]?key["\']?\s*[:=]\s*["\']?([^"\',]+)', re.IGNORECASE),
    re.compile(r'batna["\']?\s*[:=]\s*["\']?([^"\',]+)', re.IGNORECASE),
    re.compile(r'reservation_price["\']?\s*[:=]\s*["\']?([^"\',]+)', re.IGNORECASE),
]

class RedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        for pattern in SENSITIVE_PATTERNS:
            msg = pattern.sub(r'***REDACTED***', msg)
        return msg

def setup_logging(level: str = "INFO"):
    logger = logging.getLogger("negotia")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    
    handler = logging.StreamHandler(sys.stdout)
    formatter = RedactingFormatter(
        fmt="[%(asctime)s] [%(levelname)s] [NEGOTIA] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
