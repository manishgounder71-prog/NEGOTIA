from typing import List, Tuple, Dict, Any, Optional
from app.audit.hashing import AuditHasher

class AuditIntegrityValidator:
    """
    Validates the cryptographic chain of custody across all audit events in a negotiation session.
    """

    @classmethod
    def verify_chain(cls, events: List[Dict[str, Any]]) -> Tuple[bool, int, str, Optional[str]]:
        """
        Returns (is_valid, events_checked, root_hash, first_invalid_event_id).
        """
        if not events:
            return True, 0, AuditHasher.GENESIS_HASH, None

        expected_prev_hash = AuditHasher.GENESIS_HASH
        events_checked = 0

        for evt in events:
            # Check previous hash link
            if evt.get("previous_hash") != expected_prev_hash:
                return False, events_checked, evt.get("hash", ""), evt.get("id")

            # Re-compute current hash
            recomputed = AuditHasher.compute_hash(evt.get("raw_payload", {}), expected_prev_hash)
            if evt.get("hash") != recomputed:
                return False, events_checked, evt.get("hash", ""), evt.get("id")

            expected_prev_hash = evt.get("hash", "")
            events_checked += 1

        root_hash = events[-1].get("hash", expected_prev_hash)
        return True, events_checked, root_hash, None
