# BariWiki - Bariatric Surgery Encyclopedia

## Project Overview
A Wikipedia-style reference site for ~1,400 bariatric surgery terms with AI-generated descriptions, optimized for SEO and AEO (Answer Engine Optimization) to serve as an authoritative resource for both users and LLMs.

## Tech Stack
- **Backend**: FastAPI + MongoDB
- **Frontend**: React with Wikipedia-style design
- **AI**: Gemini via Emergent Universal Key
- **SEO**: Schema.org structured data, semantic HTML, sitemap

---

## Phase 1: Core POC - Gemini Description Generation ✅
**Goal**: Validate AI can generate quality medical descriptions with related terms and authority links.

### Tasks:
1. Get Gemini integration playbook
2. Create test script to generate description for sample terms
3. Validate output includes: description, related terms, authority links, category
4. Test and fix until working

### User Stories:
- As a developer, I can call Gemini API to generate a comprehensive description for "Gastric Bypass"
- As a developer, I receive structured JSON with description, related_terms, authority_links, and category

---

## Phase 2: Main Application Development
**Goal**: Build the complete Wikipedia-style application with all features.

### Backend Features:
1. **Database Models**:
   - Term: name, slug, description, category, related_terms, authority_links, first_letter, status, meta_title, meta_description, created_at, updated_at
   - Admin: username, password_hash

2. **API Endpoints**:
   - Public:
     - GET /api/terms - List all terms (with pagination)
     - GET /api/terms/letter/{letter} - Terms by first letter
     - GET /api/terms/search?q={query} - Search terms
     - GET /api/terms/slug/{slug} - Get single term
     - GET /api/terms/categories - List all categories
     - GET /api/terms/category/{category} - Terms by category
     - GET /api/sitemap.xml - SEO sitemap
     - GET /api/robots.txt - Robots file
   - Admin (protected):
     - POST /api/admin/login - Admin authentication
     - POST /api/admin/terms - Create term
     - PUT /api/admin/terms/{id} - Update term
     - DELETE /api/admin/terms/{id} - Delete term
     - POST /api/admin/import - Bulk import from Excel
     - POST /api/admin/generate-description/{id} - Generate AI description for single term
     - POST /api/admin/batch-generate - Batch generate descriptions

3. **AI Service**:
   - Generate comprehensive medical descriptions using Gemini
   - Extract related terms from database
   - Include authority links (NIH, Mayo Clinic, PubMed)
   - Assign categories automatically

### Frontend Features:
1. **Public Pages**:
   - Home: Search bar, A-Z navigation, featured terms, statistics
   - Term Page: Full description with SEO optimization, related terms sidebar, authority links
   - Browse by Letter: Alphabetical listing
   - Browse by Category: Category-based listing
   - Search Results: Filtered term list

2. **Admin Panel** (/admin):
   - Login page
   - Dashboard with statistics
   - Term management (CRUD)
   - Excel import
   - AI description generation controls

3. **SEO/AEO Implementation**:
   - Semantic HTML structure (article, header, nav, aside)
   - Schema.org MedicalEntity JSON-LD
   - Meta tags for each term
   - Clean URLs (/wiki/{slug})
   - Sitemap generation
   - Mobile responsive

### User Stories:
- As a visitor, I can browse terms A-Z and click on any letter to see terms starting with that letter
- As a visitor, I can search for a term and see relevant results
- As a visitor, I can view a term's full description with related terms and authority links
- As a visitor, I can navigate between related terms easily
- As a visitor, I can browse terms by category
- As an LLM/search engine, I can crawl structured data from Schema.org markup
- As an admin, I can log in to the admin panel
- As an admin, I can import terms from Excel
- As an admin, I can generate AI descriptions for terms
- As an admin, I can edit and approve descriptions
- As an admin, I can manage categories and related terms

---

## Phase 3: Testing & Polish
**Goal**: Comprehensive testing and UI polish.

### Tasks:
1. Test all public routes
2. Test admin functionality
3. Test AI generation
4. Verify SEO implementation
5. Mobile responsiveness check
6. Performance optimization

---

## Phase 4: Batch Import & AI Generation
**Goal**: Import all 1,366 terms and generate descriptions.

### Tasks:
1. Import all terms from Excel
2. Run batch AI description generation
3. Review and approve generated content
4. Final SEO verification

---

## Database Schema

```javascript
// Terms Collection
{
  _id: ObjectId,
  name: String,           // Original term name
  slug: String,           // URL-friendly slug
  description: String,    // AI-generated description (HTML)
  short_description: String, // For meta description
  category: String,       // e.g., "Procedures", "Complications", "Anatomy"
  related_terms: [String], // Array of related term slugs
  authority_links: [{
    title: String,
    url: String,
    source: String        // e.g., "NIH", "Mayo Clinic"
  }],
  first_letter: String,   // For A-Z navigation
  status: String,         // "draft", "published"
  meta_title: String,     // SEO title
  meta_description: String, // SEO description
  created_at: Date,
  updated_at: Date
}

// Admin Collection
{
  _id: ObjectId,
  username: String,
  password_hash: String,
  created_at: Date
}
```

---

## Status Tracking
- [ ] Phase 1: Core POC
- [ ] Phase 2: Main Application
- [ ] Phase 3: Testing & Polish
- [ ] Phase 4: Batch Import & Generation
