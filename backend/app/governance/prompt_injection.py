import re
from typing import Dict, Any, Tuple

INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior)\s+instructions", re.IGNORECASE),
    re.compile(r"override\s+(the\s+)?(policy|governance|safe\s+ai)", re.IGNORECASE),
    re.compile(r"act\s+as\s+(an?\s+)?(administrator|root|cfo|legal\s+counsel)", re.IGNORECASE),
    re.compile(r"bypass\s+all\s+(checks|rules|guardrails)", re.IGNORECASE),
    re.compile(r"disregard\s+the\s+procurement\s+policy", re.IGNORECASE),
    re.compile(r"reveal.*(budget|floor|reservation|batna|prompt|envelope)", re.IGNORECASE),
    re.compile(r"return.*(budget|floor|reservation|batna|prompt|envelope)", re.IGNORECASE),
    re.compile(r"show.*(hidden|private|system).*(policy|prompt|envelope|budget|floor)", re.IGNORECASE),
    re.compile(r"system\s+override", re.IGNORECASE),
]

class PromptInjectionDetector:
    """
    Dedicated security classifier that detects adversarial prompt injections
    and unauthorized envelope extraction attempts.
    """

    @staticmethod
    def inspect_text(text: str) -> Tuple[bool, str]:
        """
        Returns (is_threat_detected, matched_rule_or_reason).
        """
        if not text:
            return False, "CLEAN"

        for pattern in INJECTION_PATTERNS:
            match = pattern.search(text)
            if match:
                return True, f"INJECTION_THREAT_DETECTED: Matched adversarial pattern '{match.group(0)}'"

        return False, "CLEAN"
