from typing import Set, Dict

class NegotiationStateMachine:
    """
    Formal State Machine for NEGOTIA sessions.
    Validates state transitions to prevent race conditions and illegal status jumps.
    """

    VALID_TRANSITIONS: Dict[str, Set[str]] = {
        "DRAFT": {"INITIALIZING", "CANCELLED"},
        "INITIALIZING": {"RUNNING", "DEADLOCK", "FAILED", "CANCELLED"},
        "RUNNING": {"GOVERNANCE_CHECK", "PAUSED", "CANCELLED", "FAILED"},
        "GOVERNANCE_CHECK": {"RUNNING", "POLICY_BLOCKED", "AGREED", "DEADLOCK", "WAITING_FOR_HUMAN", "FAILED"},
        "POLICY_BLOCKED": {"RUNNING", "WAITING_FOR_HUMAN", "CANCELLED", "FAILED"},
        "PAUSED": {"RUNNING", "CANCELLED"},
        "WAITING_FOR_HUMAN": {"RUNNING", "AGREED", "CANCELLED", "DEADLOCK"},
        "AGREED": {"CONTRACT_GENERATING", "CONTRACT_COMPLETED", "FAILED"},
        "CONTRACT_GENERATING": {"CONTRACT_COMPLETED", "FAILED"},
        "CONTRACT_COMPLETED": set(), # Terminal state
        "DEADLOCK": {"WAITING_FOR_HUMAN", "CANCELLED"},
        "CANCELLED": set(), # Terminal state
        "FAILED": set() # Terminal state
    }

    @classmethod
    def can_transition(cls, current_state: str, new_state: str) -> bool:
        allowed = cls.VALID_TRANSITIONS.get(current_state, set())
        return new_state in allowed

    @classmethod
    def validate_transition(cls, current_state: str, new_state: str) -> None:
        if not cls.can_transition(current_state, new_state):
            raise ValueError(
                f"ILLEGAL_STATE_TRANSITION: Cannot transition negotiation from '{current_state}' to '{new_state}'."
            )
