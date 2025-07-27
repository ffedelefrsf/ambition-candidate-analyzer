from pydantic import BaseModel, Field
from typing import List


class CandidateEvaluation(BaseModel):
    bestCandidate: str = Field(..., description="Name of the best candidate")
    reasons: List[str] = Field(
        ..., max_items=10, description="Reasons for selecting the best candidate"
    )
    bestAlternative: str = Field(..., description="Name of the second-best candidate")
    alternativeReasons: List[str] = Field(
        ..., max_items=10, description="Reasons for selecting the alternative candidate"
    )
