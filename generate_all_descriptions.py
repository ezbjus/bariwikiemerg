#!/usr/bin/env python3
"""
BariWiki - AI Description Generator Script
==========================================

This script generates AI descriptions for all bariatric surgery terms
using Gemini via the Emergent Universal LLM Key.

USAGE:
    python3 generate_all_descriptions.py [OPTIONS]

OPTIONS:
    --batch-size N    Number of terms to process per run (default: 100)
    --delay N         Seconds to wait between API calls (default: 0.5)
    --continuous      Keep running until all terms are processed
    --dry-run         Show what would be processed without making changes

EXAMPLES:
    # Process 100 terms (default)
    python3 generate_all_descriptions.py
    
    # Process 50 terms with 1 second delay
    python3 generate_all_descriptions.py --batch-size 50 --delay 1
    
    # Run continuously until all terms are done
    python3 generate_all_descriptions.py --continuous
    
    # Check status without processing
    python3 generate_all_descriptions.py --dry-run

NOTES:
    - The script only processes terms that don't have descriptions yet
    - You can stop the script at any time (Ctrl+C) and resume later
    - Progress is saved to the database automatically
    - If you hit API rate limits, increase the --delay value
"""

import asyncio
import argparse
import json
import sys
from datetime import datetime

# MongoDB connection
from motor.motor_asyncio import AsyncIOMotorClient

# Emergent LLM integration
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    LLM_AVAILABLE = True
except ImportError:
    print("ERROR: emergentintegrations package not installed.")
    print("Install with: pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/")
    LLM_AVAILABLE = False

# =============================================================================
# CONFIGURATION - Edit these values if needed
# =============================================================================

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "bariwiki"
EMERGENT_LLM_KEY = "sk-emergent-f2361Cc7fE66870F47"  # Emergent Universal Key

# =============================================================================
# AI PROMPT FOR GENERATING DESCRIPTIONS
# =============================================================================

SYSTEM_PROMPT = """You are a medical encyclopedia writer specializing in bariatric surgery. 
Generate comprehensive, accurate, and educational descriptions for bariatric surgery terms.

Respond ONLY with valid JSON in this exact structure:
{
    "description": "A comprehensive 2-4 paragraph description in HTML format using <p>, <strong>, <em>, <ul>, <li> tags. Include definition, clinical significance, indications, and relevant medical details.",
    "short_description": "A 1-2 sentence summary suitable for SEO meta description (max 160 characters)",
    "category": "One of: Procedures | Complications | Anatomy | Nutrition | Medications | Conditions | Diagnostic Tests | Patient Care | Equipment | Outcomes",
    "related_terms": ["array of 3-5 related bariatric surgery terms"],
    "authority_links": [
        {"title": "Link title", "url": "https://actual-url.com/page", "source": "NIH|Mayo Clinic|ASMBS|Cleveland Clinic|WebMD"}
    ]
}

Category Guidelines:
- Procedures: Surgical techniques (gastric bypass, sleeve gastrectomy, banding)
- Complications: Post-operative issues (leaks, strictures, dumping syndrome)
- Anatomy: Body parts and structures (stomach, intestines, gastric pouch)
- Nutrition: Diet, vitamins, supplements, eating guidelines
- Medications: Drugs used before/after surgery
- Conditions: Medical conditions related to obesity or surgery
- Diagnostic Tests: Tests and measurements (BMI, labs, imaging)
- Patient Care: Pre/post-operative care, follow-up, lifestyle
- Equipment: Surgical tools and devices
- Outcomes: Results, success metrics, quality of life

Include 2-3 authority links from:
- NIH/NIDDK: https://www.niddk.nih.gov/ or https://pubmed.ncbi.nlm.nih.gov/
- Mayo Clinic: https://www.mayoclinic.org/
- ASMBS: https://asmbs.org/
- Cleveland Clinic: https://my.clevelandclinic.org/
- WebMD: https://www.webmd.com/

RESPOND ONLY WITH VALID JSON. No markdown, no explanations."""


async def generate_description(term_name: str, related_terms: list) -> dict:
    """Generate AI description for a single term using Gemini."""
    if not LLM_AVAILABLE:
        return None
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"bariwiki-gen-{hash(term_name) % 100000}",
            system_message=SYSTEM_PROMPT
        ).with_model("gemini", "gemini-2.5-flash")
        
        user_message = UserMessage(
            text=f"""Generate a comprehensive medical encyclopedia entry for the bariatric surgery term: "{term_name}"

Available related terms to choose from: {json.dumps(related_terms[:15])}

Respond with valid JSON only."""
        )
        
        response = await chat.send_message(user_message)
        
        # Clean up response - remove markdown code blocks if present
        response_text = response.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        return json.loads(response_text.strip())
    
    except json.JSONDecodeError as e:
        print(f"    JSON parse error: {str(e)[:50]}")
        return None
    except Exception as e:
        error_msg = str(e)
        if "Budget" in error_msg:
            print(f"    ⚠️  Budget limit reached. Please add balance to your Emergent Universal Key.")
            print(f"       Go to: Profile -> Universal Key -> Add Balance")
            return "BUDGET_ERROR"
        print(f"    Error: {error_msg[:80]}")
        return None


async def get_stats(terms_collection):
    """Get current progress statistics."""
    total = await terms_collection.count_documents({})
    with_desc = await terms_collection.count_documents({"description": {"$ne": ""}})
    without_desc = total - with_desc
    
    # Category distribution
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    categories = {}
    async for doc in terms_collection.aggregate(pipeline):
        cat_name = doc["_id"]
        if cat_name is None:
            cat_name = "Uncategorized"
        elif isinstance(cat_name, list):
            cat_name = str(cat_name)
        categories[cat_name] = doc["count"]
    
    return {
        "total": total,
        "with_descriptions": with_desc,
        "without_descriptions": without_desc,
        "completion_percent": round(100 * with_desc / total, 1) if total > 0 else 0,
        "categories": categories
    }


async def main():
    parser = argparse.ArgumentParser(description="Generate AI descriptions for BariWiki terms")
    parser.add_argument("--batch-size", type=int, default=100, help="Terms per batch (default: 100)")
    parser.add_argument("--delay", type=float, default=0.5, help="Delay between API calls in seconds (default: 0.5)")
    parser.add_argument("--continuous", action="store_true", help="Run until all terms are processed")
    parser.add_argument("--dry-run", action="store_true", help="Show status without processing")
    args = parser.parse_args()
    
    if not LLM_AVAILABLE:
        sys.exit(1)
    
    # Connect to MongoDB
    print("=" * 60)
    print("BariWiki AI Description Generator")
    print("=" * 60)
    print(f"Connecting to MongoDB: {MONGO_URL}")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    terms_collection = db["terms"]
    
    # Get initial stats
    stats = await get_stats(terms_collection)
    print(f"\n📊 Current Status:")
    print(f"   Total terms: {stats['total']}")
    print(f"   With descriptions: {stats['with_descriptions']}")
    print(f"   Need descriptions: {stats['without_descriptions']}")
    print(f"   Completion: {stats['completion_percent']}%")
    print(f"\n📁 Category Distribution:")
    for cat, count in stats["categories"].items():
        print(f"   {cat}: {count}")
    
    if args.dry_run:
        print("\n[Dry run - no changes made]")
        client.close()
        return
    
    if stats["without_descriptions"] == 0:
        print("\n✅ All terms already have descriptions!")
        client.close()
        return
    
    # Get all term names for related terms suggestions
    all_terms_cursor = terms_collection.find({}, {"name": 1})
    all_term_names = [doc["name"] async for doc in all_terms_cursor]
    
    # Process loop
    total_processed = 0
    total_successful = 0
    total_failed = 0
    
    while True:
        # Query for terms without descriptions
        query = {"$or": [{"description": ""}, {"description": {"$exists": False}}]}
        remaining = await terms_collection.count_documents(query)
        
        if remaining == 0:
            print("\n✅ All terms now have descriptions!")
            break
        
        batch_to_process = min(args.batch_size, remaining)
        print(f"\n{'=' * 60}")
        print(f"Processing batch of {batch_to_process} terms ({remaining} remaining)")
        print("=" * 60)
        
        cursor = terms_collection.find(query).limit(batch_to_process)
        batch_successful = 0
        batch_failed = 0
        
        async for term in cursor:
            term_id = term["_id"]
            term_name = term["name"]
            
            total_processed += 1
            print(f"\n[{total_processed}] {term_name[:50]}...")
            
            # Get related terms (exclude current term)
            related_candidates = [t for t in all_term_names if t.lower() != term_name.lower()]
            
            # Generate description
            result = await generate_description(term_name, related_candidates)
            
            if result == "BUDGET_ERROR":
                print("\n⛔ Stopping due to budget limit.")
                print("   Add balance at: Profile -> Universal Key -> Add Balance")
                client.close()
                sys.exit(1)
            
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
                
                await terms_collection.update_one({"_id": term_id}, {"$set": update_data})
                
                batch_successful += 1
                total_successful += 1
                print(f"    ✓ Category: {result.get('category', 'N/A')}")
            else:
                batch_failed += 1
                total_failed += 1
                print(f"    ✗ Failed")
            
            # Delay between API calls
            await asyncio.sleep(args.delay)
        
        # Batch summary
        print(f"\n--- Batch Complete ---")
        print(f"    Successful: {batch_successful}")
        print(f"    Failed: {batch_failed}")
        
        # Overall progress
        stats = await get_stats(terms_collection)
        print(f"\n📊 Overall Progress: {stats['completion_percent']}% ({stats['with_descriptions']}/{stats['total']})")
        
        if not args.continuous:
            break
    
    # Final summary
    print("\n" + "=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Total processed this session: {total_processed}")
    print(f"Successful: {total_successful}")
    print(f"Failed: {total_failed}")
    
    final_stats = await get_stats(terms_collection)
    print(f"\n📊 Final Status:")
    print(f"   Completion: {final_stats['completion_percent']}%")
    print(f"   Remaining: {final_stats['without_descriptions']} terms")
    
    print(f"\n📁 Category Distribution:")
    for cat, count in final_stats["categories"].items():
        print(f"   {cat}: {count}")
    
    client.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user. Progress has been saved.")
        print("   Run the script again to continue from where you left off.")
