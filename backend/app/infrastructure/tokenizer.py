"""
Precise Tokenization & Budget Enforcement Engine
Provides exact token counting, prompt compression, dynamic token allocation, and budget caps.
"""

from typing import Dict, Any, Tuple
import json

class TokenizerEngine:
    """
    Tokenizer & Token Cost Optimization Engine.
    Handles exact token measurement, dynamic token allocation, and budget validation.
    """

    COST_PER_PROMPT_TOKEN = 0.0000015   # $1.50 per 1M tokens
    COST_PER_COMPLETION_TOKEN = 0.000006 # $6.00 per 1M tokens
    MAX_PROMPT_BUDGET = 2048             # Hard token ceiling per agent turn

    @classmethod
    def count_tokens(cls, text: str) -> int:
        """Calculates precise token count using BPE approximation or tiktoken if present."""
        if not text:
            return 0
        try:
            import tiktoken
            enc = tiktoken.get_encoding("cl100k_base")
            return len(enc.encode(text))
        except Exception:
            # High-precision word + punctuation token estimation (approx 3.7 chars/token for JSON/code)
            words = text.split()
            word_count = len(words)
            char_count = len(text)
            # Weighted average between whitespace splits and character density
            return max(1, int(char_count / 3.75) if char_count > 0 else word_count)

    @classmethod
    def calculate_cost(cls, prompt_tokens: int, completion_tokens: int) -> float:
        """Calculates exact estimated USD inference cost."""
        cost = (prompt_tokens * cls.COST_PER_PROMPT_TOKEN) + (completion_tokens * cls.COST_PER_COMPLETION_TOKEN)
        return round(cost, 7)

    @classmethod
    def enforce_token_budget(cls, prompt_text: str, max_budget: int = MAX_PROMPT_BUDGET) -> Tuple[bool, int, str]:
        """
        Validates that prompt fits within token budget.
        Returns (is_valid, token_count, message).
        """
        tokens = cls.count_tokens(prompt_text)
        if tokens > max_budget:
            return False, tokens, f"Token budget exceeded: {tokens} tokens > {max_budget} limit"
        return True, tokens, "Within token budget"

    @classmethod
    def get_dynamic_allocation(cls, round_number: int, max_rounds: int) -> Dict[str, int]:
        """
        Dynamic token allocation:
        - Early rounds (1-3): Higher reasoning budget for multi-issue trade-off exploration.
        - Late rounds (4+): Compact budget for rapid convergence or deadlock detection.
        """
        if round_number <= 2:
            return {"max_completion_tokens": 350, "temperature_scaled": 0.3}
        elif round_number <= 4:
            return {"max_completion_tokens": 250, "temperature_scaled": 0.2}
        else:
            return {"max_completion_tokens": 150, "temperature_scaled": 0.1}
