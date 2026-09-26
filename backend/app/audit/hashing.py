import hashlib
import json
from typing import Dict, Any

class AuditHasher:
    """
    Cryptographic SHA-256 Hashing Engine for Tamper-Evident Audit Chains.
    Formula: Hash_N = SHA-256(Canonical_JSON(Event_Payload) + Previous_Hash)
    """

    GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

    @classmethod
    def compute_hash(cls, payload: Dict[str, Any], previous_hash: str) -> str:
        # Deterministic canonical serialization (sorted keys, no whitespace variance)
        canonical_json = json.dumps(payload, sort_keys=True, separators=(',', ':'), default=str)
        combined_string = f"{canonical_json}::{previous_hash}"
        return hashlib.sha256(combined_string.encode('utf-8')).hexdigest()

    @classmethod
    def compute_contract_hash(cls, contract_data: Dict[str, Any]) -> str:
        canonical_json = json.dumps(contract_data, sort_keys=True, separators=(',', ':'), default=str)
        return hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
