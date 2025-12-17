#!/usr/bin/env python3
"""
POC Test Script - BariWiki AI Description Generation
Tests Gemini API integration for generating medical term descriptions.
"""

import asyncio
import json
import os
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage

# Test terms for POC
TEST_TERMS = [
    "Gastric Bypass",
    "Sleeve Gastrectomy", 
    "Anastomotic Leak"
]

# Sample related terms from the database (simulating what we'd have)
SAMPLE_RELATED_TERMS = [
    "Roux-en-Y Gastric Bypass",
    "Bariatric Surgery",
    "Malabsorptive Procedures",
    "Dumping Syndrome",
    "Nutritional Deficiency",
    "Weight Loss Surgery",
    "Obesity",
    "BMI",
    "Metabolic Surgery",
    "Laparoscopic Surgery"
]

SYSTEM_PROMPT = """You are a medical encyclopedia writer specializing in bariatric surgery. 
Your task is to generate comprehensive, accurate, and educational descriptions for bariatric surgery terms.

For each term, you must provide a JSON response with this exact structure:
{
    "description": "A comprehensive 2-4 paragraph description of the term in HTML format using <p>, <strong>, <em>, <ul>, <li> tags for proper formatting. Include definition, procedure details (if applicable), indications, outcomes, and important considerations.",
    "short_description": "A 1-2 sentence summary suitable for meta description (max 160 characters)",
    "category": "One of: Procedures | Complications | Anatomy | Nutrition | Medications | Conditions | Diagnostic Tests | Patient Care | Equipment | Outcomes",
    "related_terms": ["array of 3-5 related terms from the provided list"],
    "authority_links": [
        {"title": "Link title", "url": "URL", "source": "Source name (NIH, Mayo Clinic, ASMBS, etc.)"}
    ]
}

Guidelines:
1. Write in an authoritative, educational tone suitable for medical professionals and patients
2. Use proper medical terminology but explain complex terms
3. Include HTML formatting for readability
4. Always include at least 2 authority links from reputable sources:
   - NIH (National Institutes of Health): https://www.niddk.nih.gov/
   - Mayo Clinic: https://www.mayoclinic.org/
   - ASMBS (American Society for Metabolic and Bariatric Surgery): https://asmbs.org/
   - Cleveland Clinic: https://my.clevelandclinic.org/
   - WebMD: https://www.webmd.com/
5. Select related terms that are genuinely connected to the main term
6. Ensure the description is SEO-optimized with natural keyword usage

RESPOND ONLY WITH VALID JSON. No additional text before or after the JSON."""


async def test_gemini_description_generation():
    """Test Gemini API for generating medical term descriptions."""
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        print("❌ ERROR: EMERGENT_LLM_KEY not found in environment")
        return False
    
    print(f"✅ API Key found: {api_key[:20]}...")
    print("=" * 60)
    
    all_success = True
    
    for term in TEST_TERMS:
        print(f"\n🔄 Generating description for: {term}")
        print("-" * 40)
        
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"bariwiki-poc-{term.lower().replace(' ', '-')}",
                system_message=SYSTEM_PROMPT
            ).with_model("gemini", "gemini-2.5-flash")
            
            user_message = UserMessage(
                text=f"""Generate a comprehensive encyclopedia entry for the bariatric surgery term: "{term}"

Available related terms to choose from: {json.dumps(SAMPLE_RELATED_TERMS)}

Remember to respond ONLY with valid JSON."""
            )
            
            response = await chat.send_message(user_message)
            
            # Try to parse the response as JSON
            # Sometimes the response might have markdown code blocks
            response_text = response.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            parsed = json.loads(response_text)
            
            # Validate required fields
            required_fields = ["description", "short_description", "category", "related_terms", "authority_links"]
            missing_fields = [f for f in required_fields if f not in parsed]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                all_success = False
                continue
            
            print(f"✅ Successfully generated description for: {term}")
            print(f"   📝 Description length: {len(parsed['description'])} chars")
            print(f"   📋 Short description: {parsed['short_description'][:80]}...")
            print(f"   🏷️  Category: {parsed['category']}")
            print(f"   🔗 Related terms: {parsed['related_terms']}")
            print(f"   🌐 Authority links: {len(parsed['authority_links'])} links")
            for link in parsed['authority_links']:
                print(f"      - {link['source']}: {link['title']}")
            
            # Print a snippet of the description
            desc_snippet = parsed['description'][:200].replace('\n', ' ')
            print(f"   📖 Description preview: {desc_snippet}...")
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON response for {term}")
            print(f"   Error: {e}")
            print(f"   Raw response: {response[:500]}...")
            all_success = False
            
        except Exception as e:
            print(f"❌ Error generating description for {term}: {e}")
            all_success = False
    
    print("\n" + "=" * 60)
    if all_success:
        print("✅ POC SUCCESS: All test terms generated successfully!")
        print("   Gemini integration is working correctly.")
    else:
        print("❌ POC FAILED: Some tests did not pass.")
    
    return all_success


async def test_batch_generation_capability():
    """Test ability to process multiple terms efficiently."""
    print("\n" + "=" * 60)
    print("🔄 Testing batch generation capability...")
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    
    batch_terms = ["Dumping Syndrome", "BMI Calculation"]
    
    for term in batch_terms:
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"bariwiki-batch-{term.lower().replace(' ', '-')}",
                system_message=SYSTEM_PROMPT
            ).with_model("gemini", "gemini-2.5-flash")
            
            user_message = UserMessage(
                text=f"""Generate a comprehensive encyclopedia entry for: "{term}"
Available related terms: {json.dumps(SAMPLE_RELATED_TERMS[:5])}
Respond ONLY with valid JSON."""
            )
            
            response = await chat.send_message(user_message)
            
            response_text = response.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            parsed = json.loads(response_text.strip())
            print(f"✅ Batch test passed for: {term}")
            
        except Exception as e:
            print(f"❌ Batch test failed for {term}: {e}")
            return False
    
    print("✅ Batch generation capability confirmed!")
    return True


if __name__ == "__main__":
    print("=" * 60)
    print("BariWiki POC - Gemini Description Generation Test")
    print("=" * 60)
    
    # Run all tests
    loop = asyncio.get_event_loop()
    
    result1 = loop.run_until_complete(test_gemini_description_generation())
    result2 = loop.run_until_complete(test_batch_generation_capability())
    
    print("\n" + "=" * 60)
    print("FINAL POC RESULT:")
    if result1 and result2:
        print("✅ ALL TESTS PASSED - Ready for main development!")
    else:
        print("❌ SOME TESTS FAILED - Need to fix before proceeding")
    print("=" * 60)
