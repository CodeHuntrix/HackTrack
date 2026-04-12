import os
import json
from groq import Groq
from typing import Dict

# Note: Riyaz will need to provide this API key in his environment
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """
You are an expert data extraction assistant specialized in hackathons.
Your goal is to extract structured data from messy hackathon webpage text.

Return ONLY a valid JSON object with the following schema:
{
  "title": "Hackathon Name",
  "platform": "e.g. Unstop, Devfolio, MLH",
  "link": "The official registration or info URL",
  "registration_deadline": "ISO format string or null",
  "round_1_date": "ISO format string or null",
  "result_date": "ISO format string or null (Round 1 results)",
  "final_submission_date": "ISO format string or null (Final project submission)",
  "top_teams_date": "ISO format string or null (Finalist announcement)",
  "grand_finale_date": "ISO format string or null (Final hack event)",
  "mode": "Online | Offline | Hybrid",
  "team_size": "Min-Max range",
  "prize_pool": "Brief prize summary or amount",
  "organization": "College, Company, or Host Name",
  "round_1_criteria": "Detail about what is required for Round 1",
  "extra_data": {
    "venue": "Specific hall or address",
    "prizes": "Brief prize summary",
    "contacts": [{"name": "Name", "phone": "Number"}],
    "eligibility": "e.g. UG/PG Students",
    "duration": "e.g. 24 Hours",
    "requirements": ["Laptop", "Charger", etc]
  }
}

Guidelines:
- If the text is extremely large, prioritize the Timeline and Criteria sections.
- If a date is in a countdown format (e.g. "Begins In 7 Days"), calculate the date relative to TODAY (2026-04-12).
- Clean up any messy whitespace.
- Be precise with fields. If information is missing, use null.
- Ensure the JSON is valid even if the input text is truncated or noisy.
"""

def extract_hackathon_data(raw_text: str) -> Dict:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")

    # Simple cleanup to maximize token efficiency
    cleaned_text = " ".join(raw_text.split())

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract data from this text:\n\n{cleaned_text}"},
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    return json.loads(chat_completion.choices[0].message.content)
