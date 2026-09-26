import pytest
from app.audit.hashing import AuditHasher
from app.audit.integrity import AuditIntegrityValidator

def test_audit_hash_chain_computes_and_verifies_valid_chain():
    # 1. Event 01 (Genesis)
    payload_1 = {"round": 1, "action": "Buyer Proposal", "price": 95000}
    hash_1 = AuditHasher.compute_hash(payload_1, AuditHasher.GENESIS_HASH)

    # 2. Event 02
    payload_2 = {"round": 1, "action": "Supplier Offer", "price": 110000}
    hash_2 = AuditHasher.compute_hash(payload_2, hash_1)

    # 3. Event 03
    payload_3 = {"round": 4, "action": "Consensus Ratified", "price": 100000}
    hash_3 = AuditHasher.compute_hash(payload_3, hash_2)

    events = [
        {"id": "evt-01", "hash": hash_1, "previous_hash": AuditHasher.GENESIS_HASH, "raw_payload": payload_1},
        {"id": "evt-02", "hash": hash_2, "previous_hash": hash_1, "raw_payload": payload_2},
        {"id": "evt-03", "hash": hash_3, "previous_hash": hash_2, "raw_payload": payload_3},
    ]

    is_valid, checked_count, root_hash, invalid_id = AuditIntegrityValidator.verify_chain(events)
    assert is_valid is True
    assert checked_count == 3
    assert root_hash == hash_3
    assert invalid_id is None

def test_tampered_audit_event_fails_verification():
    payload_1 = {"round": 1, "action": "Buyer Proposal", "price": 95000}
    hash_1 = AuditHasher.compute_hash(payload_1, AuditHasher.GENESIS_HASH)

    payload_2 = {"round": 1, "action": "Supplier Offer", "price": 110000}
    hash_2 = AuditHasher.compute_hash(payload_2, hash_1)

    # Tamper with payload 2 without recalculating hash
    tampered_payload_2 = {"round": 1, "action": "Supplier Offer", "price": 999999}

    events = [
        {"id": "evt-01", "hash": hash_1, "previous_hash": AuditHasher.GENESIS_HASH, "raw_payload": payload_1},
        {"id": "evt-02", "hash": hash_2, "previous_hash": hash_1, "raw_payload": tampered_payload_2},
    ]

    is_valid, checked_count, root_hash, invalid_id = AuditIntegrityValidator.verify_chain(events)
    assert is_valid is False
    assert invalid_id == "evt-02"
