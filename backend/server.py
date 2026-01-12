"""BariWiki - Bariatric Surgery Encyclopedia API"""
import os
import re
import json
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List
from contextlib import asynccontextmanager

import bcrypt
import jwt
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

load_dotenv()

# Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "bariwiki")
JWT_SECRET = os.environ.get("JWT_SECRET", "bariwiki-secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "BariWiki2024!")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

# MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
terms_collection = db["terms"]
admins_collection = db["admins"]

security = HTTPBearer(auto_error=False)


# Helper functions
def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    # Convert datetime objects to ISO format strings
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc


def get_first_letter(name: str) -> str:
    """Get first letter of term name for A-Z navigation"""
    if not name:
        return "#"
    first = name.strip()[0].upper()
    return first if first.isalpha() else "#"


# Pydantic Models
class TermCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    short_description: Optional[str] = ""
    category: Optional[str] = "Uncategorized"
    related_terms: Optional[List[str]] = []
    authority_links: Optional[List[dict]] = []
    status: Optional[str] = "draft"


class TermUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[str] = None
    related_terms: Optional[List[str]] = None
    authority_links: Optional[List[dict]] = None
    status: Optional[str] = None


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminCreate(BaseModel):
    username: str
    password: str


class GenerateDescriptionRequest(BaseModel):
    use_ai: bool = True


# Lifespan for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create indexes and default admin
    await terms_collection.create_index("slug", unique=True)
    await terms_collection.create_index("name")
    await terms_collection.create_index("first_letter")
    await terms_collection.create_index("category")
    await terms_collection.create_index("status")
    await terms_collection.create_index([("name", "text"), ("description", "text")])
    
    # Create default admin if not exists
    admin = await admins_collection.find_one({"username": ADMIN_USERNAME})
    if not admin:
        hashed = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt())
        await admins_collection.insert_one({
            "username": ADMIN_USERNAME,
            "password_hash": hashed.decode(),
            "created_at": datetime.utcnow()
        })
        print(f"Default admin created: {ADMIN_USERNAME}")
    
    yield
    # Shutdown
    client.close()


app = FastAPI(title="BariWiki API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Auth helpers
def create_token(username: str) -> str:
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"sub": username, "exp": expiration}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    username = verify_token(credentials.credentials)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    admin = await admins_collection.find_one({"username": username})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


# Public Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "BariWiki API"}


@app.get("/api/terms")
async def list_terms(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None
):
    """List all terms with pagination"""
    skip = (page - 1) * limit
    query = {}
    if status:
        query["status"] = status
    
    cursor = terms_collection.find(query).sort("name", 1).skip(skip).limit(limit)
    terms = [serialize_doc(doc) async for doc in cursor]
    total = await terms_collection.count_documents(query)
    
    return {
        "terms": terms,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@app.get("/api/terms/letter/{letter}")
async def get_terms_by_letter(letter: str):
    """Get all terms starting with a specific letter"""
    letter = letter.upper()
    query = {"first_letter": letter, "status": "published"}
    cursor = terms_collection.find(query).sort("name", 1)
    terms = [serialize_doc(doc) async for doc in cursor]
    return {"letter": letter, "terms": terms, "count": len(terms)}


@app.get("/api/terms/search")
async def search_terms(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=50)
):
    """Search terms by name or description"""
    # Use text search or regex for partial matching
    regex_pattern = {"$regex": q, "$options": "i"}
    query = {
        "$or": [
            {"name": regex_pattern},
            {"description": regex_pattern}
        ],
        "status": "published"
    }
    cursor = terms_collection.find(query).limit(limit)
    terms = [serialize_doc(doc) async for doc in cursor]
    return {"query": q, "terms": terms, "count": len(terms)}


@app.get("/api/terms/slug/{slug}")
async def get_term_by_slug(slug: str):
    """Get a single term by its slug"""
    term = await terms_collection.find_one({"slug": slug})
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    return serialize_doc(term)


@app.get("/api/terms/categories")
async def get_categories():
    """Get all unique categories with counts"""
    pipeline = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    categories = []
    async for doc in terms_collection.aggregate(pipeline):
        categories.append({"category": doc["_id"], "count": doc["count"]})
    return {"categories": categories}


@app.get("/api/terms/category/{category}")
async def get_terms_by_category(category: str):
    """Get all terms in a specific category"""
    query = {"category": category, "status": "published"}
    cursor = terms_collection.find(query).sort("name", 1)
    terms = [serialize_doc(doc) async for doc in cursor]
    return {"category": category, "terms": terms, "count": len(terms)}


@app.get("/api/terms/letters")
async def get_letters_with_counts():
    """Get all letters with term counts for A-Z navigation"""
    pipeline = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$first_letter", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    letters = {}
    async for doc in terms_collection.aggregate(pipeline):
        letters[doc["_id"]] = doc["count"]
    return {"letters": letters}


@app.get("/api/stats")
async def get_stats():
    """Get overall statistics"""
    total = await terms_collection.count_documents({})
    published = await terms_collection.count_documents({"status": "published"})
    drafts = await terms_collection.count_documents({"status": "draft"})
    
    # Categories count
    pipeline = [{"$group": {"_id": "$category"}}]
    categories = len([doc async for doc in terms_collection.aggregate(pipeline)])
    
    return {
        "total_terms": total,
        "published": published,
        "drafts": drafts,
        "categories": categories
    }


@app.get("/api/sitemap.xml")
async def get_sitemap():
    """Generate comprehensive SEO sitemap"""
    base_url = "https://parnellwellness.com"
    today = datetime.utcnow().strftime("%Y-%m-%d")
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    
    # Home page - highest priority
    xml += f'''  <url>
    <loc>{base_url}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n'''
    
    # Resources page
    xml += f'''  <url>
    <loc>{base_url}/resources</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n'''
    
    # Disclaimer page
    xml += f'''  <url>
    <loc>{base_url}/disclaimer</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n'''
    
    # A-Z browse pages
    for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        xml += f'''  <url>
    <loc>{base_url}/browse/{letter.lower()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n'''
    
    # Category pages
    pipeline = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$category"}},
    ]
    async for doc in terms_collection.aggregate(pipeline):
        cat_id = doc["_id"]
        if cat_id and isinstance(cat_id, str):
            category_slug = cat_id.replace(" ", "%20")
            xml += f'''  <url>
    <loc>{base_url}/category/{category_slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n'''
    
    # All published terms
    cursor = terms_collection.find({"status": "published"}, {"slug": 1, "updated_at": 1, "name": 1})
    async for term in cursor:
        lastmod = term.get("updated_at", datetime.utcnow())
        if isinstance(lastmod, str):
            lastmod = datetime.fromisoformat(lastmod.replace('Z', '+00:00'))
        lastmod_str = lastmod.strftime("%Y-%m-%d")
        xml += f'''  <url>
    <loc>{base_url}/wiki/{term["slug"]}</loc>
    <lastmod>{lastmod_str}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n'''
    
    xml += '</urlset>'
    return Response(content=xml, media_type="application/xml")


@app.get("/api/robots.txt")
async def get_robots():
    """Return robots.txt for SEO"""
    content = """# BariWiki - Bariatric Surgery Encyclopedia
# https://parnellwellness.com

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*

# Sitemaps
Sitemap: https://parnellwellness.com/api/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Google-specific
User-agent: Googlebot
Allow: /

# Bing-specific
User-agent: Bingbot
Allow: /

# Allow AI crawlers for AEO
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /
"""
    return Response(content=content, media_type="text/plain")


# Admin Routes
@app.post("/api/admin/login")
async def admin_login(data: AdminLogin):
    """Admin login endpoint"""
    admin = await admins_collection.find_one({"username": data.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(data.password.encode(), admin["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(admin["username"])
    return {"token": token, "username": admin["username"]}


@app.get("/api/admin/me")
async def get_admin_profile(admin = Depends(get_current_admin)):
    """Get current admin profile"""
    return {"username": admin["username"]}


@app.get("/api/admin/terms")
async def admin_list_terms(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    admin = Depends(get_current_admin)
):
    """Admin: List all terms with pagination"""
    skip = (page - 1) * limit
    query = {}
    if status:
        query["status"] = status
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    cursor = terms_collection.find(query).sort("name", 1).skip(skip).limit(limit)
    terms = [serialize_doc(doc) async for doc in cursor]
    total = await terms_collection.count_documents(query)
    
    return {
        "terms": terms,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@app.post("/api/admin/terms")
async def create_term(data: TermCreate, admin = Depends(get_current_admin)):
    """Admin: Create a new term"""
    slug = slugify(data.name)
    
    # Check for duplicate slug
    existing = await terms_collection.find_one({"slug": slug})
    if existing:
        raise HTTPException(status_code=400, detail="Term with this name already exists")
    
    term = {
        "name": data.name,
        "slug": slug,
        "description": data.description or "",
        "short_description": data.short_description or "",
        "category": data.category or "Uncategorized",
        "related_terms": data.related_terms or [],
        "authority_links": data.authority_links or [],
        "first_letter": get_first_letter(data.name),
        "status": data.status or "draft",
        "meta_title": f"{data.name} - BariWiki",
        "meta_description": data.short_description or f"Learn about {data.name} in bariatric surgery.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await terms_collection.insert_one(term)
    term["_id"] = str(result.inserted_id)
    return serialize_doc(term)


@app.get("/api/admin/terms/{term_id}")
async def admin_get_term(term_id: str, admin = Depends(get_current_admin)):
    """Admin: Get a single term by ID"""
    try:
        term = await terms_collection.find_one({"_id": ObjectId(term_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid term ID")
    
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    return serialize_doc(term)


@app.put("/api/admin/terms/{term_id}")
async def update_term(term_id: str, data: TermUpdate, admin = Depends(get_current_admin)):
    """Admin: Update a term"""
    try:
        oid = ObjectId(term_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid term ID")
    
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    
    if "name" in update_data:
        update_data["slug"] = slugify(update_data["name"])
        update_data["first_letter"] = get_first_letter(update_data["name"])
        update_data["meta_title"] = f"{update_data['name']} - BariWiki"
    
    if "short_description" in update_data:
        update_data["meta_description"] = update_data["short_description"]
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await terms_collection.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Term not found")
    
    term = await terms_collection.find_one({"_id": oid})
    return serialize_doc(term)


@app.delete("/api/admin/terms/{term_id}")
async def delete_term(term_id: str, admin = Depends(get_current_admin)):
    """Admin: Delete a term"""
    try:
        oid = ObjectId(term_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid term ID")
    
    result = await terms_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Term not found")
    
    return {"message": "Term deleted successfully"}


@app.post("/api/admin/import")
async def import_terms(
    file: UploadFile = File(...),
    admin = Depends(get_current_admin)
):
    """Admin: Bulk import terms from Excel or CSV"""
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Only Excel or CSV files are supported")
    
    try:
        content = await file.read()
        
        # Read file based on extension
        if file.filename.endswith('.csv'):
            import io
            df = pd.read_csv(io.BytesIO(content))
        else:
            import io
            df = pd.read_excel(io.BytesIO(content))
        
        # Get the first column as terms
        if len(df.columns) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        terms_column = df.iloc[:, 0].dropna().tolist()
        
        # Also add the column header if it's a valid term
        first_col_name = df.columns[0]
        if isinstance(first_col_name, str) and first_col_name.strip():
            terms_column.insert(0, first_col_name.strip())
        
        imported = 0
        skipped = 0
        
        for term_name in terms_column:
            if not isinstance(term_name, str) or not term_name.strip():
                continue
            
            term_name = term_name.strip()
            slug = slugify(term_name)
            
            # Skip if already exists
            existing = await terms_collection.find_one({"slug": slug})
            if existing:
                skipped += 1
                continue
            
            term = {
                "name": term_name,
                "slug": slug,
                "description": "",
                "short_description": "",
                "category": "Uncategorized",
                "related_terms": [],
                "authority_links": [],
                "first_letter": get_first_letter(term_name),
                "status": "draft",
                "meta_title": f"{term_name} - BariWiki",
                "meta_description": f"Learn about {term_name} in bariatric surgery.",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            await terms_collection.insert_one(term)
            imported += 1
        
        return {
            "message": f"Import complete: {imported} terms imported, {skipped} skipped (duplicates)",
            "imported": imported,
            "skipped": skipped
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")


@app.post("/api/admin/terms/{term_id}/generate")
async def generate_description(
    term_id: str,
    admin = Depends(get_current_admin)
):
    """Admin: Generate AI description for a term"""
    try:
        oid = ObjectId(term_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid term ID")
    
    term = await terms_collection.find_one({"_id": oid})
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI key not configured")
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        # Get some related terms from database for context
        related_cursor = terms_collection.find(
            {"_id": {"$ne": oid}},
            {"name": 1}
        ).limit(20)
        available_terms = [doc["name"] async for doc in related_cursor]
        
        system_prompt = """You are a medical encyclopedia writer specializing in bariatric surgery. 
Generate comprehensive, accurate, and educational descriptions for bariatric surgery terms.

Respond ONLY with valid JSON in this exact structure:
{
    "description": "A comprehensive 2-4 paragraph description in HTML format using <p>, <strong>, <em>, <ul>, <li> tags.",
    "short_description": "A 1-2 sentence summary (max 160 characters)",
    "category": "One of: Procedures | Complications | Anatomy | Nutrition | Medications | Conditions | Diagnostic Tests | Patient Care | Equipment | Outcomes",
    "related_terms": ["array of 3-5 related terms from the provided list"],
    "authority_links": [
        {"title": "Link title", "url": "URL", "source": "NIH/Mayo Clinic/ASMBS/Cleveland Clinic"}
    ]
}

Include at least 2 authority links from reputable medical sources."""
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"bariwiki-gen-{term_id}",
            system_message=system_prompt
        ).with_model("gemini", "gemini-2.5-flash")
        
        user_message = UserMessage(
            text=f"""Generate an encyclopedia entry for: "{term['name']}"

Available related terms: {json.dumps(available_terms[:15])}

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
        
        parsed = json.loads(response_text.strip())
        
        # Update term with generated content
        update_data = {
            "description": parsed.get("description", ""),
            "short_description": parsed.get("short_description", ""),
            "category": parsed.get("category", "Uncategorized"),
            "related_terms": parsed.get("related_terms", []),
            "authority_links": parsed.get("authority_links", []),
            "meta_description": parsed.get("short_description", ""),
            "updated_at": datetime.utcnow()
        }
        
        await terms_collection.update_one({"_id": oid}, {"$set": update_data})
        
        term = await terms_collection.find_one({"_id": oid})
        return {"message": "Description generated successfully", "term": serialize_doc(term)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/api/admin/terms/{term_id}/publish")
async def publish_term(term_id: str, admin = Depends(get_current_admin)):
    """Admin: Publish a term"""
    try:
        oid = ObjectId(term_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid term ID")
    
    result = await terms_collection.update_one(
        {"_id": oid},
        {"$set": {"status": "published", "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Term not found")
    
    return {"message": "Term published successfully"}


@app.post("/api/admin/batch-publish")
async def batch_publish(admin = Depends(get_current_admin)):
    """Admin: Publish all draft terms"""
    result = await terms_collection.update_many(
        {"status": "draft"},
        {"$set": {"status": "published", "updated_at": datetime.utcnow()}}
    )
    return {"message": f"{result.modified_count} terms published"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
