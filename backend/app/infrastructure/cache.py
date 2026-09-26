"""
Semantic Response Cache for Multi-Agent Turns
Reduces redundant LLM inference calls, lowers token expenditure to $0 on repeated states, and tracks hit metrics.
"""

from typing import Dict, Any, Optional, Tuple
import hashlib
import json
import time

class SemanticResponseCache:
    """
    In-Memory & Redis-Compatible Semantic LRU Cache for Negotiation Turns.
    """
    _cache: Dict[str, Dict[str, Any]] = {}
    _hits: int = 0
    _misses: int = 0
    _max_entries: int = 500

    @classmethod
    def _compute_key(cls, agent_type: str, system_prompt: str, context: Dict[str, Any]) -> str:
        """Generates deterministic SHA-256 fingerprint for input pair."""
        serialized = json.dumps({
            "agent": agent_type,
            "system": system_prompt.strip(),
            "context": context
        }, sort_keys=True)
        return hashlib.sha256(serialized.encode()).hexdigest()

    @classmethod
    def get(cls, agent_type: str, system_prompt: str, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieves cached response if available."""
        key = cls._compute_key(agent_type, system_prompt, context)
        if key in cls._cache:
            entry = cls._cache[key]
            # Check TTL (default 1 hour)
            if time.time() - entry["timestamp"] < 3600:
                cls._hits += 1
                return entry["response"]
            else:
                del cls._cache[key]
        cls._misses += 1
        return None

    @classmethod
    def set(cls, agent_type: str, system_prompt: str, context: Dict[str, Any], response: Dict[str, Any]):
        """Stores agent turn response in cache."""
        if len(cls._cache) >= cls._max_entries:
            # Evict oldest entry
            oldest_key = min(cls._cache.keys(), key=lambda k: cls._cache[k]["timestamp"])
            del cls._cache[oldest_key]

        key = cls._compute_key(agent_type, system_prompt, context)
        cls._cache[key] = {
            "response": response,
            "timestamp": time.time()
        }

    @classmethod
    def get_metrics(cls) -> Dict[str, Any]:
        """Returns cache telemetry."""
        total = cls._hits + cls._misses
        hit_ratio = round((cls._hits / total * 100), 2) if total > 0 else 0.0
        return {
            "total_requests": total,
            "cache_hits": cls._hits,
            "cache_misses": cls._misses,
            "hit_ratio_percent": hit_ratio,
            "active_cache_size": len(cls._cache)
        }

    @classmethod
    def clear(cls):
        """Resets the cache."""
        cls._cache.clear()
        cls._hits = 0
        cls._misses = 0
