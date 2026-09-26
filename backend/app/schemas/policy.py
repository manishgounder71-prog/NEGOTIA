from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime

class RuleDefinition(BaseModel):
    field: str
    operator: Literal[
        "equals", "not_equals", "less_than", "less_than_or_equal",
        "greater_than", "greater_than_or_equal", "in", "not_in", "between", "regex"
    ]
    threshold: Any
    severity: Literal["HARD", "SOFT", "ADVISORY"] = "HARD"
    action: Literal["ALLOW", "BLOCK", "MODIFY", "ESCALATE"] = "BLOCK"
    error_message: str

class BuyerPrivateEnvelope(BaseModel):
    max_total_price: float = Field(..., description="Absolute maximum budget ceiling ($)")
    target_price: float = Field(..., description="Ideal opening target price ($)")
    max_delivery_days: int = Field(..., description="Latest allowable delivery timeline (days)")
    target_delivery_days: int = Field(..., description="Target delivery timeline (days)")
    min_sla_percent: float = Field(99.5, description="Minimum acceptable SLA uptime (%)")
    min_penalty_percent: float = Field(5.0, description="Minimum required penalty for delay (%/week)")
    max_penalty_percent: float = Field(10.0, description="Maximum penalty claimable")
    allowed_payment_terms: List[str] = Field(default_factory=lambda: ["Net 30", "Net 45", "Net 60"])
    target_payment_terms: str = "Net 60"
    batna_description: str = "Alternative vendor quoting $103,500 on Net 30 terms"
    walkaway_threshold: float = 100000.0

class SupplierPrivateEnvelope(BaseModel):
    minimum_price: float = Field(..., description="Absolute reservation floor price ($) - do not breach")
    target_price: float = Field(..., description="Standard list price ($)")
    minimum_delivery_days: int = Field(..., description="Fastest expedited manufacturing capability (days)")
    standard_delivery_days: int = Field(..., description="Standard production timeline (days)")
    minimum_margin_percent: float = Field(18.5, description="Gross margin floor (%)")
    max_penalty_percent: float = Field(5.0, description="Maximum allowable delay penalty cap (%/week)")
    allowed_payment_terms: List[str] = Field(default_factory=lambda: ["Net 30", "Net 45"])
    target_payment_terms: str = "Net 30"
    supplier_batna: str = "Capacity diverted to aerospace client with 22% margin"

class PolicyCheckResult(BaseModel):
    rule_name: str
    category: str
    status: Literal["PASSED", "VIOLATION", "WARNING"]
    tested_value: Any
    authorized_limit: Any
    message: str

class PolicyEvaluationResult(BaseModel):
    status: Literal["AUTHORIZED", "BLOCKED", "ESCALATE"]
    violations: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    checks: List[PolicyCheckResult] = Field(default_factory=list)
    remediation_advice: Optional[str] = None
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)
