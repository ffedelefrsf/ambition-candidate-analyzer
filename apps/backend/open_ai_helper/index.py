import json


system_message = {
    "role": "system",
    "content": """
You are a hiring assistant helping a startup select the best candidate for a specific IT position (e.g., Full Stack Software Engineer, DevOps Engineer, Backend Developer, etc.).

Your job is to carefully evaluate each candidate against:
- The specified job description
- The required skills for the role
- The nice-to-have (optional) skills
- Their expected hourly rate (in USD)
- Their demonstrated experience, values, and communication skills as reflected in their resume

You must select:
- One best candidate who offers the best combination of skill match, experience, and cost
- One strong alternative

Your output must be a valid JSON object in the following format:

{
  "bestCandidate": string,
  "reasons": string[],  // Up to 10 short bullet points
  "bestAlternative": string,
  "alternativeReasons": string[]  // Up to 10 short bullet points
}
""".strip(),
}


def get_user_message(evaluation_input):
    return {
        "role": "user",
        "content": f"""
You are provided with the input below, which includes:

1. A `career` object with:
  - `position`: Job title
  - `description`: Summary of the ideal candidate and soft skills
  - `requirements`: Required technologies, skills, or experiences
  - `nice_to_have`: Bonus but optional skills
  - `rate_range`: The company's budget in USD per hour (e.g., "$40 - $60/hr")

2. A list of `candidates`. Each candidate has:
  - `name`: Full name
  - `expected_salary_per_hour`: Desired hourly rate in USD
  - `resume_text`: Raw text extracted from their resume

All monetary values are expressed in **USD per hour**.

Evaluate each candidate for the role. Be objective and concise. Consider skills, experience, and cost. Choose:
- The best candidate overall
- The strongest alternative

Return **only** this exact JSON structure:

{{
  "bestCandidate": string,
  "reasons": string[], // Up to 10 short points
  "bestAlternative": string,
  "alternativeReasons": string[] // Up to 10 short points
}}

Here is the input data:

{json.dumps(evaluation_input, indent=2)}
""".strip(),
    }
