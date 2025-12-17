#!/usr/bin/env python3
"""Quick batch generator - processes terms in small batches"""
import asyncio
import json
import os
import sys
from datetime import datetime
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "bariwiki")
KEY = os.environ.get("EMERGENT_LLM_KEY")

PROMPT = """Medical encyclopedia writer for bariatric surgery. Return ONLY valid JSON:
{"description":"HTML description with <p> tags","short_description":"max 160 chars","category":"Procedures|Complications|Anatomy|Nutrition|Medications|Conditions|Diagnostic Tests|Patient Care|Equipment|Outcomes","related_terms":["term1","term2"],"authority_links":[{"title":"t","url":"u","source":"NIH|Mayo Clinic|ASMBS"}]}"""

async def gen(name):
    try:
        chat = LlmChat(api_key=KEY, session_id=f"bw{hash(name)%10000}", system_message=PROMPT).with_model("gemini", "gemini-2.5-flash")
        r = await chat.send_message(UserMessage(text=f'Term: "{name}" - JSON only'))
        t = r.strip()
        if "```" in t: t = t.split("```")[1].replace("json","").strip()
        return json.loads(t)
    except Exception as e:
        return None

async def main():
    BATCH = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    client = AsyncIOMotorClient(MONGO_URL)
    terms = client[DB_NAME]["terms"]
    
    q = {"$or": [{"description": ""}, {"description": {"$exists": False}}]}
    total = await terms.count_documents(q)
    print(f"Processing {min(BATCH, total)} of {total} terms...")
    
    cursor = terms.find(q).limit(BATCH)
    ok = fail = 0
    
    async for t in cursor:
        r = await gen(t["name"])
        if r:
            await terms.update_one({"_id": t["_id"]}, {"$set": {
                "description": r.get("description", ""),
                "short_description": r.get("short_description", ""),
                "category": r.get("category", "Uncategorized"),
                "related_terms": r.get("related_terms", []),
                "authority_links": r.get("authority_links", []),
                "updated_at": datetime.utcnow()
            }})
            ok += 1
            print(f"✓ [{ok+fail}] {t['name'][:40]} -> {r.get('category','?')}")
        else:
            fail += 1
            print(f"✗ [{ok+fail}] {t['name'][:40]}")
        await asyncio.sleep(0.2)
    
    print(f"\nDone: {ok} success, {fail} failed")
    remaining = await terms.count_documents(q)
    print(f"Remaining: {remaining}")
    client.close()

asyncio.run(main())
