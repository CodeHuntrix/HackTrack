import os
import json
from groq import Groq
from typing import Dict

# Note: Riyaz will need to provide this API key in his environment
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """
You are an expert data extraction assistant for hackathons.
Extract structured data from messy hackathon text.

SCHEMA:
{
  "title": "Hackathon Name",
  "link": "The official registration or info URL",
  "duration": "A number representing HOURS only (e.g. '6', '24', '48'). CALCULATE this from time ranges (e.g. 8am-2pm = 6)",
  "fees": "The registration fee including currency e.g. '₹200 per team'",
  "hackathon_type": "Project Only | PPT Only | Mixed",
  "is_direct_to_final": "Boolean. True if ONLY a final round exists with no screening/preliminary rounds.",
  "registration_deadline": "ISO format string or null",
  "round_1_date": "ISO format string or null",
  "result_date": "ISO format string or null",
  "final_round_date": "ISO format string or null (The main finale or project submission event)",
  "mode": "Online | Offline | Hybrid",
  "team_size": "Min-Max range",
  "prize_pool": "Brief prize summary or amount",
  "organization": "College, Company, or Host Name",
  "round_1_criteria": "Detail about Round 1 requirements",
  "extra_data": {
    "venue": "Specific hall or address",
    "requirements": ["Laptop", etc]
  }
}

CRITICAL RULES:
1. DURATION: If the text says "8:30 AM – 2:30 PM", you MUST calculate the hours (6) and return "6".
2. DIRECT TO FINAL: If there is only one "Date" mentioned for the event itself, set is_direct_to_final to true.
3. FEES: Look for ₹ symbols and "Reg Fee" explicitly.
4. FINAL ROUND: Map "Grand Finale", "On-spot development", or "Demo Day" dates to final_round_date.
5. TYPE: If "Hardware" or "Software build" is mentioned, it's "Project Only". If "Presentation/Ideation" is the focus, it's "PPT Only".

Return ONLY JSON.
"""

def extract_hackathon_data(raw_text: str) -> Dict:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")

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
