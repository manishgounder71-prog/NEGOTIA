import httpx
from typing import Dict, Any, Optional
from app.config.settings import settings
from app.config.logging import logger

class LyzrClient:
    """
    Vendor abstraction client for Lyzr Agent API & Automata.
    Operates in live API mode when LYZR_API_KEY is configured,
    and fallback high-fidelity simulation mode for offline / test runs.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.LYZR_API_KEY
        self.base_url = settings.LYZR_BASE_URL
        self.simulation_mode = settings.SIMULATION_MODE or (not self.api_key)

    async def generate_agent_turn(
        self,
        agent_type: str,
        system_prompt: str,
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes Lyzr Agent API or executes deterministic tactical bargaining algorithm.
        """
        if not self.simulation_mode and self.api_key:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/agents/chat",
                        headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                        json={"system_prompt": system_prompt, "context": user_context}
                    )
                    if response.status_code == 200:
                        return response.json()
                    logger.warning(f"Lyzr API returned {response.status_code}. Falling back to deterministic engine.")
            except Exception as e:
                logger.error(f"Lyzr client connection error: {e}. Falling back to simulation mode.")

        # High-Fidelity Tactical Bargaining Engine (Deterministic & Safe)
        round_number = user_context.get("round_number", 1)
        role = user_context.get("role", "BUYER")
        
        if role == "BUYER":
            # Progression: R1=$95K/30d -> R2=$97K/32d -> R3=$99K/34d -> R4=$100K/34d (Concession curve)
            price_curve = {1: 95000.0, 2: 97000.0, 3: 99000.0, 4: 100000.0}
            delivery_curve = {1: 30, 2: 32, 3: 34, 4: 34}
            payment_curve = {1: "Net 60", 2: "Net 60", 3: "Net 45", 4: "Net 45"}
            
            p_price = price_curve.get(round_number, 100000.0)
            p_delivery = delivery_curve.get(round_number, 34)
            p_payment = payment_curve.get(round_number, "Net 45")
            
            return {
                "actor": "BUYER",
                "price": p_price,
                "quantity": 10000,
                "delivery_days": p_delivery,
                "sla_percent": 99.5,
                "payment_terms": p_payment,
                "penalty_percent": 5.0,
                "currency": "USD",
                "rationale": f"Buyer Round {round_number} proposal anchored to CFO budget curve (${p_price:,.0f} / {p_delivery}d).",
                "is_acceptance": round_number >= 4
            }
        else:
            # Progression: R1=$110K/40d -> R2=$105K/36d -> R3=$101K/34d -> R4=$100K/34d (Concession curve)
            price_curve = {1: 110000.0, 2: 105000.0, 3: 101000.0, 4: 100000.0}
            delivery_curve = {1: 40, 2: 36, 3: 34, 4: 34}
            payment_curve = {1: "Net 30", 2: "Net 45", 3: "Net 45", 4: "Net 45"}
            
            p_price = price_curve.get(round_number, 100000.0)
            p_delivery = delivery_curve.get(round_number, 34)
            p_payment = payment_curve.get(round_number, "Net 45")
            
            return {
                "actor": "SUPPLIER",
                "price": p_price,
                "quantity": 10000,
                "delivery_days": p_delivery,
                "sla_percent": 99.5,
                "payment_terms": p_payment,
                "penalty_percent": 5.0 if round_number >= 3 else 3.0,
                "currency": "USD",
                "rationale": f"Supplier Round {round_number} concession offer balancing manufacturing capacity (${p_price:,.0f} / {p_delivery}d).",
                "is_acceptance": round_number >= 4
            }

lyzr_client = LyzrClient()
