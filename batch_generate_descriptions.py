#!/usr/bin/env python3
"""
Batch AI Description Generator for BariWiki
Generates descriptions for all terms using Gemini AI
"""

import asyncio
import json
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Try to import the LLM library
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    print("Warning: emergentintegrations not available")

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "bariwiki")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

# Categories for bariatric surgery terms
CATEGORIES = [
    "Procedures",
    "Complications", 
    "Anatomy",
    "Nutrition",
    "Medications",
    "Conditions",
    "Diagnostic Tests",
    "Patient Care",
    "Equipment",
    "Outcomes"
]

SYSTEM_PROMPT = """You are a medical encyclopedia writer specializing in bariatric surgery. 
Generate comprehensive, accurate, and educational descriptions for bariatric surgery terms.

Respond ONLY with valid JSON in this exact structure:
{
    "description": "A comprehensive 2-4 paragraph description in HTML format using <p>, <strong>, <em>, <ul>, <li> tags. Include definition, clinical significance, and relevant details.",
    "short_description": "A 1-2 sentence summary (max 160 characters)",
    "category": "One of: Procedures | Complications | Anatomy | Nutrition | Medications | Conditions | Diagnostic Tests | Patient Care | Equipment | Outcomes",
    "related_terms": ["array of 3-5 related bariatric surgery terms"],
    "authority_links": [
        {"title": "Link title", "url": "https://actual-url.com/page", "source": "NIH/Mayo Clinic/ASMBS/Cleveland Clinic/WebMD"}
    ]
}

Guidelines:
1. Write in an authoritative, educational tone
2. Use proper medical terminology but explain complex terms
3. Include HTML formatting for readability
4. Include 2-3 authority links from reputable medical sources like:
   - NIH: https://www.niddk.nih.gov/ or https://www.ncbi.nlm.nih.gov/
   - Mayo Clinic: https://www.mayoclinic.org/
   - ASMBS: https://asmbs.org/
   - Cleveland Clinic: https://my.clevelandclinic.org/
   - WebMD: https://www.webmd.com/
5. Select the most appropriate category based on the term
6. Choose related terms that are genuinely connected

RESPOND ONLY WITH VALID JSON. No additional text."""


async def generate_description(term_name: str, available_terms: list) -> dict:
    """Generate AI description for a single term"""
    if not LLM_AVAILABLE or not EMERGENT_LLM_KEY:
        return None
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"bariwiki-batch-{term_name[:20].replace(' ', '-')}",
            system_message=SYSTEM_PROMPT
        ).with_model("gemini", "gemini-2.5-flash")
        
        user_message = UserMessage(
            text=f"""Generate an encyclopedia entry for the bariatric surgery term: "{term_name}"

Available related terms to choose from: {json.dumps(available_terms[:20])}

Respond ONLY with valid JSON."""
        )
        
        response = await chat.send_message(user_message)
        
        # Parse response
        response_text = response.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        return json.loads(response_text.strip())
    
    except Exception as e:
        print(f"  Error generating for '{term_name}': {str(e)[:100]}")
        return None


async def batch_generate():
    """Main batch generation function"""
    print("=" * 60)
    print("BariWiki Batch AI Description Generator")
    print("=" * 60)
    
    if not EMERGENT_LLM_KEY:
        print("ERROR: EMERGENT_LLM_KEY not configured")
        return
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    terms_collection = db["terms"]
    
    # Get all terms that need descriptions (empty description)
    query = {"$or": [{"description": ""}, {"description": {"$exists": False}}]}
    total_to_process = await terms_collection.count_documents(query)
    
    print(f"Found {total_to_process} terms needing descriptions")
    
    # Get all term names for related terms suggestions
    all_terms_cursor = terms_collection.find({}, {"name": 1})
    all_term_names = [doc["name"] async for doc in all_terms_cursor]
    
    # Process in batches
    batch_size = 10
    processed = 0
    successful = 0
    failed = 0
    
    cursor = terms_collection.find(query)
    
    async for term in cursor:
        term_id = term["_id"]
        term_name = term["name"]
        
        processed += 1
        print(f"\n[{processed}/{total_to_process}] Generating: {term_name}")
        
        # Get related terms (exclude current term)
        related_candidates = [t for t in all_term_names if t != term_name]
        
        # Generate description
        result = await generate_description(term_name, related_candidates)
        
        if result:
            # Update term in database
            update_data = {
                "description": result.get("description", ""),
                "short_description": result.get("short_description", ""),
                "category": result.get("category", "Uncategorized"),
                "related_terms": result.get("related_terms", []),
                "authority_links": result.get("authority_links", []),
                "meta_description": result.get("short_description", ""),
                "updated_at": datetime.utcnow()
            }
            
            await terms_collection.update_one(
                {"_id": term_id},
                {"$set": update_data}
            )
            
            successful += 1
            print(f"  ✓ Success - Category: {result.get('category', 'N/A')}")
        else:
            failed += 1
            print(f"  ✗ Failed")
        
        # Small delay to avoid rate limiting
        await asyncio.sleep(0.5)
        
        # Progress report every 50 terms
        if processed % 50 == 0:
            print(f"\n--- Progress: {processed}/{total_to_process} ({successful} successful, {failed} failed) ---\n")
    
    print("\n" + "=" * 60)
    print("BATCH GENERATION COMPLETE")
    print(f"  Total processed: {processed}")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print("=" * 60)
    
    # Show category distribution
    print("\nCategory Distribution:")
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    async for doc in terms_collection.aggregate(pipeline):
        print(f"  {doc['_id']}: {doc['count']}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(batch_generate())
