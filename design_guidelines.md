{
  "brand": {
    "name": "Bariatric Surgery Reference (Wiki-style)",
    "attributes": ["authoritative", "calm", "clinical", "unbiased", "fast", "accessible"],
    "voice_tone": "Neutral, textbook-like, plain-language first with clinically precise terms where needed."
  },
  "design_personality": {
    "aesthetic": "Classic Wikipedia-inspired encyclopedic layout with medical-grade clarity. Text-forward, generous whitespace, minimal chrome.",
    "style_fusion": "Wikipedia content rhythm + NHS-style clarity + Mayo Clinic trust cues, with a subtle modern UI via shadcn components.",
    "layout_style": "Single-Column reading flow with right-rail ToC/Related on desktop; stacked on mobile; breadcrumb trail at top; A–Z ribbon below header."
  },
  "typography": {
    "fonts": {
      "headings": {
        "family": "Spectral",
        "fallback": "Georgia, 'Times New Roman', serif",
        "import": "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&display=swap"
      },
      "body": {
        "family": "Karla",
        "fallback": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        "import": "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&display=swap"
      },
      "monospace": {
        "family": "Source Code Pro",
        "fallback": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        "import": "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap"
      }
    },
    "text_scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base sm:text-lg font-semibold tracking-tight",
      "body": "text-base sm:text-sm leading-7",
      "small": "text-sm leading-6",
      "code": "font-mono text-sm px-1 py-0.5 rounded bg-muted text-foreground"
    },
    "usage": {
      "global": "Apply font-smoothing defaults already present in index.css; set body font to Karla, headings to Spectral via Tailwind utilities.",
      "heading_rules": "Use sentence case. H1 only once per page (term title). H2 for section headings (Symptoms, Risks, etc.)."
    }
  },
  "color_system": {
    "palette": {
      "background": "#FFFFFF",
      "foreground": "#0A0A0A",
      "muted": "#F4F6F8",
      "border": "#E5E7EB",
      "link": "#1A67D3",
      "link_visited": "#6F42C1",
      "accent": "#E8F3FF",
      "success": "#1B9E77",
      "warning": "#B8860B",
      "destructive": "#B00020"
    },
    "semantic_tokens_hsl": {
      "--background": "0 0% 100%",
      "--foreground": "222 84% 5%",
      "--card": "0 0% 100%",
      "--card-foreground": "222 84% 5%",
      "--accent": "213 100% 96%",
      "--muted": "210 23% 95%",
      "--border": "214 32% 91%",
      "--ring": "217 91% 60%",
      "--link": "217 76% 47%",
      "--link-visited": "263 52% 51%",
      "--success": "162 71% 36%",
      "--warning": "43 89% 36%",
      "--destructive": "354 86% 39%"
    },
    "category_colors": {
      "Pre-op": "#0EA5A3",
      "Surgery Types": "#2563EB",
      "Complications": "#DC2626",
      "Nutrition": "#2E7D32",
      "Anatomy": "#7C3AED",
      "Pharmacology": "#0C4A6E",
      "Aftercare": "#B45309"
    },
    "rules": [
      "Links are blue (#1A67D3); visited links use purple (#6F42C1) for classic wiki discoverability.",
      "Headings and body on white; content areas never use gradients.",
      "Use subtle tints (accent/muted) for sidebars, callouts, and badges.",
      "Avoid saturated dark gradients; follow Gradient Restriction Rule."
    ]
  },
  "layout": {
    "grid": {
      "container": "mx-auto px-4 sm:px-6 lg:px-8",
      "max_widths": {
        "article": "max-w-[72ch]",
        "wide": "max-w-7xl"
      },
      "columns": "12-col desktop grid; content column spans 8, right rail spans 4; mobile is single column"
    },
    "header": "Sticky top header with logo, search, and breadcrumb. A–Z ribbon below header, sticky on scroll.",
    "term_page": "Title, one-sentence definition, metadata strip (last reviewed), ToC (right rail), main content sections, related terms and authority links sidebars.",
    "list_pages": "Alphabet index and category pages use 2–3 column responsive lists with alphabetical dividers.",
    "admin": "Two-column dashboard: left nav (vertical), right content area with tables/cards."
  },
  "texture_and_decor": {
    "noise_overlay_css": ".noise-light::after{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);background-size:3px 3px;pointer-events:none;mix-blend-mode:multiply;}",
    "gradient_usage": "Allowed only for large section backgrounds like hero header stripes, never on content blocks. Max 20% viewport coverage."
  },
  "components": {
    "paths_note": "Use shadcn components from ./components/ui/*.jsx only.",
    "global_header": {
      "uses": ["navigation-menu.jsx", "input.jsx", "breadcrumb.jsx", "separator.jsx", "tooltip.jsx"],
      "tailwind": "sticky top-0 z-40 bg-white/95 backdrop-blur border-b",
      "html_scaffold": "<header class=\"sticky top-0 z-40 bg-white/95 backdrop-blur border-b\"><div class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3\"><a href=\"/\" class=\"text-[15px] font-semibold tracking-tight text-neutral-800\" data-testid=\"header-home-link\">Bariatric Reference</a><div class=\"hidden md:flex items-center gap-2 ml-auto\"><input class=\"w-72 h-9 rounded-md border border-input bg-background px-3 text-sm\" placeholder=\"Search terms\" aria-label=\"Search\" data-testid=\"global-search-input\"/><button class=\"h-9 px-3 rounded-md bg-neutral-900 text-white text-sm\" data-testid=\"global-search-button\">Search</button></div></div><div class=\"border-t bg-white\"><div class=\"mx-auto max-w-7xl overflow-x-auto\"><nav aria-label=\"A–Z index\" class=\"flex gap-1 py-2 px-4\" data-testid=\"az-nav\"></nav></div></div></header>",
      "notes": "On mobile, the search input appears as a single row below the logo. Provide Cmd/ Ctrl+K to open Command palette search."
    },
    "alphabet_bar": {
      "uses": ["toggle-group.jsx", "scroll-area.jsx"],
      "behavior": "Single-select letters A–Z; disabled state for letters without terms; horizontally scrollable on mobile; sticky below header.",
      "react_scaffold_js": "// AlphabetBar.jsx (JSX)\nimport React from 'react';\nimport { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';\nconst letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');\nexport const AlphabetBar = ({ active, disabledMap = {}, onChange }) => (\n  <div className=\"w-full overflow-x-auto\">\n    <ToggleGroup type=\"single\" value={active} onValueChange={(v)=> onChange && v && onChange(v)}\n      className=\"flex gap-1 py-2\" data-testid=\"alphabet-toggle-group\">\n      {letters.map(l => (\n        <ToggleGroupItem key={l} value={l} aria-label={\`Show ${l}\`}\n          disabled={!!disabledMap[l]}\n          data-testid={\`alphabet-item-${l.toLowerCase()}\`}\n          className=\"data-[state=on]:bg-neutral-900 data-[state=on]:text-white\">{l}</ToggleGroupItem>\n      ))}\n    </ToggleGroup>\n  </div>\n);"
    },
    "search": {
      "uses": ["command.jsx", "input.jsx", "sonner.jsx"],
      "behavior": "Header input for quick submit; Command palette (Cmd/Ctrl+K) for fuzzy on-site search using Fuse.js.",
      "react_scaffold_js": "// SearchPalette.jsx\nimport React, { useEffect, useState } from 'react';\nimport { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from './components/ui/command';\nexport const SearchPalette = ({ open, onOpenChange, items, onSelect }) => {\n  useEffect(()=>{\n    const onKey = (e)=>{ if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); onOpenChange(true);} };\n    window.addEventListener('keydown', onKey); return ()=> window.removeEventListener('keydown', onKey);\n  },[onOpenChange]);\n  return open ? (\n    <div role=\"dialog\" aria-modal className=\"fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-24\" data-testid=\"search-palette\">\n      <Command className=\"w-[90vw] max-w-2xl rounded-md border bg-white\">\n        <CommandInput placeholder=\"Search terms…\" data-testid=\"search-palette-input\"/>\n        <CommandList>\n          <CommandEmpty>No results.</CommandEmpty>\n          <CommandGroup heading=\"Terms\">\n            {items.map(it => (\n              <CommandItem key={it.slug} onSelect={()=> onSelect(it)} data-testid={\`search-result-${it.slug}\`}>{it.title}</CommandItem>\n            ))}\n          </CommandGroup>\n        </CommandList>\n      </Command>\n    </div>\n  ) : null;\n};"
    },
    "toc_sidebar": {
      "uses": ["scroll-area.jsx", "separator.jsx"],
      "behavior": "Sticky on desktop; collapsible on mobile; highlights active section via IntersectionObserver.",
      "react_scaffold_js": "// TocSidebar.jsx\nimport React, { useEffect, useState } from 'react';\nexport const TocSidebar = ({ headings = [] }) => {\n  const [active, setActive] = useState('');\n  useEffect(()=>{\n    const els = headings.map(h => document.getElementById(h.id)).filter(Boolean);\n    const io = new IntersectionObserver((entries)=>{\n      const visible = entries.filter(e=> e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];\n      if(visible){ setActive(visible.target.id); }\n    }, { rootMargin: '0px 0px -70% 0px', threshold: [0.1, 0.5, 1]});\n    els.forEach(el=> io.observe(el));\n    return ()=> io.disconnect();\n  },[headings]);\n  return (\n    <aside className=\"sticky top-20 hidden lg:block w-64 text-sm\" aria-label=\"Table of contents\" data-testid=\"toc-sidebar\">\n      <div className=\"font-medium mb-2\">On this page</div>\n      <nav className=\"space-y-1\">\n        {headings.map(h => (\n          <a key={h.id} href={\`#${h.id}\"} className=\"block px-2 py-1 rounded hover:bg-muted\" data-testid={\`toc-link-${h.id}\"}\n             aria-current={active===h.id? 'true':'false'}\n             style={{fontWeight: active===h.id? 600: 400}}>{h.text}</a>\n        ))}\n      </nav>\n    </aside>\n  );\n};"
    },
    "related_terms": {
      "uses": ["card.jsx", "badge.jsx"],
      "pattern": "Right-rail card listing related terms by cosine similarity or shared categories. Each item shows title and badges.",
      "tailwind": "rounded-md border bg-white p-3 space-y-2"
    },
    "authority_links": {
      "pattern": "List of outbound links to NIH, Mayo Clinic, MedlinePlus, WHO; open in new tab with rel=noopener.",
      "tailwind": "list-disc pl-5 [&>li>a]:underline [&>li>a:hover]:text-blue-700"
    },
    "breadcrumbs": { "uses": ["breadcrumb.jsx"], "tailwind": "text-sm text-neutral-600" },
    "badges": {
      "uses": ["badge.jsx"],
      "variants": "Use solid for active filters, outline for passive tags. Colors from category_colors.",
      "example_html": "<span class=\"inline-flex items-center rounded px-2 py-0.5 text-xs bg-blue-50 text-blue-700\" data-testid=\"category-badge\">Surgery Types</span>"
    },
    "data_table": {
      "uses": ["table.jsx", "pagination.jsx", "dropdown-menu.jsx", "alert-dialog.jsx", "sonner.jsx"],
      "pattern": "Admin term table with sortable headers; bulk actions via selection checkboxes; pagination footer.",
      "notes": "All row actions (edit/delete) must have visible focus states and data-testid attributes."
    },
    "forms": {
      "uses": ["form.jsx", "input.jsx", "select.jsx", "textarea.jsx", "switch.jsx", "sonner.jsx"],
      "pattern": "Admin create/edit term with title, slug, categories (multi), summary, body (Markdown), authority links (repeatable), related slugs.",
      "validation": "Client validation + server validation; show inline errors under fields."
    },
    "dialogs": {
      "uses": ["dialog.jsx"],
      "bulk_import": "CSV/JSON import with mapping preview; progress via progress.jsx; toasts on completion."
    }
  },
  "page_templates": {
    "term_page_wire": "<main class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8\"><nav class=\"py-3\" aria-label=\"Breadcrumb\"></nav><article class=\"grid grid-cols-1 lg:grid-cols-12 gap-8\"><div class=\"lg:col-span-8\"><h1 class=\"text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight\" data-testid=\"term-title\">Gastric bypass</h1><p class=\"mt-3 text-neutral-700 max-w-[72ch]\" data-testid=\"term-definition\">A short, plain-language definition…</p><div class=\"mt-4 text-xs text-neutral-500\" data-testid=\"term-meta\">Last reviewed: 2025-01-01 · Category: Surgery Types</div><hr class=\"my-6\"/><section id=\"symptoms\"><h2 class=\"text-base sm:text-lg font-semibold\">Indications</h2><p class=\"mt-2 max-w-[72ch]\">…</p></section><!-- other sections --><section id=\"references\" class=\"mt-8\"><h2 class=\"text-base sm:text-lg font-semibold\">References</h2><ul class=\"list-decimal pl-6 space-y-1\"><li><a href=\"https://www.ncbi.nlm.nih.gov/\" target=\"_blank\" rel=\"noopener\" data-testid=\"authority-link\">NCBI</a></li></ul></section></div><aside class=\"lg:col-span-4 space-y-6\"><div data-testid=\"toc-container\"></div><div class=\"rounded-md border p-3\" data-testid=\"related-terms\"></div><div class=\"rounded-md border p-3\" data-testid=\"authority-links\"></div></aside></article></main>",
    "list_page_wire": "<main class=\"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8\"><header class=\"py-6\"><h1 class=\"text-2xl font-semibold tracking-tight\">All Terms · A</h1></header><section class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4\" data-testid=\"az-section\"><div><h2 class=\"text-sm font-semibold text-neutral-500\">A</h2><ul class=\"mt-2 space-y-1\"><li><a class=\"underline\" href=\"/terms/anastomosis\" data-testid=\"term-link\">Anastomosis</a></li></ul></div><!-- repeat for letters --></section></main>"
  },
  "patterns": {
    "breadcrumbs": "Home / Categories / Term. On mobile collapse middle breadcrumb into ellipsis.",
    "visited_link_style": "Always style visited links; use text-[#6F42C1].",
    "empty_states": "Use skeleton.jsx while loading; 'No results' states with helpful next actions.",
    "error_states": "Use alert.jsx with destructive color and clear guidance.",
    "loading": "Skeletons for table rows, article paragraphs (3–5 lines).",
    "related_terms_logic": "Prefer same-category terms; otherwise cosine similarity on title + description; show up to 6 items.",
    "a_z_navigation": "Route: /a-z/[letter]; highlight current letter; disable letters with 0 terms."
  },
  "motion": {
    "principles": [
      "Use minimal micro-interactions; avoid distracting motion on reading surfaces.",
      "Buttons: color/opacity shift and subtle scale (.99 on press).",
      "Fade-in on article content (150–200ms); staggered list items (40ms)."
    ],
    "framer_motion_example_js": "import { motion } from 'framer-motion';\nexport const FadeIn = ({ children }) => (<motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{duration:0.18}}>{children}</motion.div>);"
  },
  "accessibility": {
    "wcag": "Target AA contrast; 16px base text; 44px min touch targets on mobile.",
    "semantics": "Use landmark roles: header, nav, main, aside; semantic headings in order; aria-current for active ToC item.",
    "keyboard": "All interactive elements tabbable; provide skip-to-content link; letter bar navigable with arrow keys and Home/End.",
    "data_testid": "All interactive and key informational elements MUST include data-testid in kebab-case describing role (e.g., 'global-search-input', 'alphabet-item-a', 'term-title', 'term-meta')."
  },
  "seo_and_aeo": {
    "meta": "Set unique title, meta description; canonical URL; Open Graph basic tags.",
    "structured_data_note": "Use JSON-LD for MedicalEntity or MedicalCondition per page; BreadcrumbList on all terms.",
    "jsonld_example": "<script type=\"application/ld+json\">{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"MedicalEntity\",\n  \"name\": \"Gastric bypass\",\n  \"description\": \"A bariatric surgery that...\",\n  \"url\": \"https://example.com/terms/gastric-bypass\",\n  \"sameAs\": [\"https://medlineplus.gov/\", \"https://www.mayoclinic.org/\"]\n}</script>",
    "llm_aeo": "Include a 'Key Facts' definition list near the top (data-testid='key-facts') with standardized labels so LLMs can extract reliably."
  },
  "tailwind_tokens_and_rules": {
    "add_to_index_css": "In :root, override or extend tokens with link and visited HSL tokens; do not use transition: all; never center .App container.",
    "utility_snippets": {
      "link_class": "text-[color:var(--link)] hover:underline visited:text-[color:var(--link-visited)]",
      "reading_width": "max-w-[72ch]",
      "content_container": "mx-auto px-4 sm:px-6 lg:px-8"
    }
  },
  "admin_panel": {
    "navbar": "Left vertical nav using navigation-menu or a simple list with icons (lucide-react).",
    "dashboard_cards": "Use card.jsx with key metrics: total terms, pending reviews.",
    "term_table": "table.jsx with sortable columns; checkbox selection; pagination.jsx at bottom.",
    "bulk_import": "dialog.jsx with file input; progress.jsx; toasts via sonner.jsx. Include data-testid on all buttons and inputs.",
    "roles": "Admin-only; no user registration. Protect routes in FastAPI + frontend guard."
  },
  "data_testid_conventions": {
    "format": "kebab-case; describe role not appearance.",
    "examples": [
      "header-home-link",
      "global-search-input",
      "global-search-button",
      "alphabet-toggle-group",
      "alphabet-item-a",
      "term-title",
      "term-definition",
      "term-meta",
      "toc-sidebar",
      "toc-link-symptoms",
      "authority-link",
      "admin-bulk-import-button",
      "admin-term-table",
      "admin-save-term-button"
    ]
  },
  "component_path": {
    "breadcrumb": "./components/ui/breadcrumb.jsx",
    "button": "./components/ui/button.jsx",
    "badge": "./components/ui/badge.jsx",
    "navigation_menu": "./components/ui/navigation-menu.jsx",
    "toggle_group": "./components/ui/toggle-group.jsx",
    "command": "./components/ui/command.jsx",
    "input": "./components/ui/input.jsx",
    "select": "./components/ui/select.jsx",
    "textarea": "./components/ui/textarea.jsx",
    "separator": "./components/ui/separator.jsx",
    "scroll_area": "./components/ui/scroll-area.jsx",
    "card": "./components/ui/card.jsx",
    "table": "./components/ui/table.jsx",
    "pagination": "./components/ui/pagination.jsx",
    "dropdown_menu": "./components/ui/dropdown-menu.jsx",
    "dialog": "./components/ui/dialog.jsx",
    "alert": "./components/ui/alert.jsx",
    "alert_dialog": "./components/ui/alert-dialog.jsx",
    "progress": "./components/ui/progress.jsx",
    "skeleton": "./components/ui/skeleton.jsx",
    "sonner": "./components/ui/sonner.jsx",
    "tabs": "./components/ui/tabs.jsx"
  },
  "libraries": {
    "packages": [
      "fuse.js",
      "react-helmet-async",
      "framer-motion",
      "lucide-react"
    ],
    "install": "npm i fuse.js react-helmet-async framer-motion lucide-react",
    "usage_notes": {
      "fuse_js": "Client-side fuzzy search over term titles and summaries. Index once on load; debounce input.",
      "helmet": "Wrap App with HelmetProvider; set per-page <Helmet> title, meta, canonical.",
      "framer_motion": "Only for gentle fades and list reveals; avoid complex motion on reading areas.",
      "lucide": "Use for external-link, search, arrow icons."
    }
  },
  "micro_interactions": {
    "links": "Underline on hover only; visited color applied; focus ring visible (outline-2 outline-blue-500).",
    "buttons": "Hover: bg shade shift; Active: scale-95; Focus: ring-2 ring-offset-2.",
    "toc": "Active section updates as user scrolls via IntersectionObserver.",
    "header": "Hide top border shadow until scrollY > 8 then add subtle shadow."
  },
  "images_and_media": {
    "rules": [
      "Avoid heavy hero imagery; keep pages text-priority.",
      "If using background decor, keep opacity low and never behind dense text.",
      "Lazy-load diagrams; include alt text."
    ]
  },
  "image_urls": [
    {
      "url": "https://images.unsplash.com/photo-1700553498563-5e6513864ef3?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Soft window shadow grid on light surface",
      "category": "Decorative header background (10–15% opacity) for landing/home only"
    },
    {
      "url": "https://images.unsplash.com/photo-1656257225195-b339bc86ab15?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Clean industrial lines, abstract medical feel",
      "category": "Admin dashboard empty state illustration"
    },
    {
      "url": "https://images.unsplash.com/photo-1570401720281-8076c80cb695?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Defocused dot matrix pattern",
      "category": "Category index banner divider (very low opacity)"
    }
  ],
  "code_snippets": {
    "link_styles_tailwind": "a:not(.btn){ color: hsl(var(--link)); text-underline-offset: 3px; } a:hover{ text-decoration: underline; } a:visited{ color: hsl(var(--link-visited)); }",
    "skip_link_html": "<a href=\"#main\" class=\"sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border rounded px-2 py-1\" data-testid=\"skip-to-content\">Skip to content</a>",
    "reading_progress_js": "// Add a top progress bar indicating read position\nwindow.addEventListener('scroll', ()=>{ const el = document.querySelector('[data-reading-progress]'); if(!el) return; const h = document.body.scrollHeight - window.innerHeight; el.style.transform = `scaleX(${Math.min(1, window.scrollY / h)})`; });",
    "reading_progress_html": "<div aria-hidden=\"true\" class=\"fixed top-0 left-0 right-0 h-0.5 bg-transparent\"><div data-reading-progress class=\"origin-left h-full bg-blue-600 transition-[width] duration-150\" style=\"transform:scaleX(0)\"></div></div>"
  },
  "instructions_to_main_agent": [
    "Add Google Fonts links for Spectral, Karla, Source Code Pro in index.html head.",
    "Extend index.css :root with --link and --link-visited HSL tokens; ensure body uses Karla and headings use Spectral.",
    "Build GlobalHeader.jsx using shadcn input + a basic button; wire Cmd/Ctrl+K to SearchPalette.jsx (Command).",
    "Implement AlphabetBar.jsx and mount it below header across public routes; connect to /a-z/[letter] pages.",
    "Create TermPage.jsx using the term_page_wire; ensure data-testid attributes are present as specified.",
    "Implement TocSidebar.jsx and IntersectionObserver logic; mount in right rail on lg+ only.",
    "Style anchor tags using link/visited colors; confirm WCAG AA contrast.",
    "Admin: build TermTable.jsx with table.jsx + pagination.jsx; actions in dropdown-menu.jsx; bulk import dialog with dialog.jsx and progress.jsx; use sonner.jsx toasts.",
    "Add HelmetProvider and set per-page meta titles/descriptions; inject JSON-LD as in jsonld_example.",
    "Do not use transition: all anywhere; specify properties (e.g., transition-colors, transition-opacity).",
    "Never center-align the app container; keep text-left and reading width to max-w-[72ch].",
    "Add data-testid to ALL interactive and key informational elements."
  ],
  "references_and_inspiration": {
    "dribbble": ["https://dribbble.com/tags/wiki", "https://dribbble.com/tags/knowledgebase", "https://dribbble.com/search/wikipedia-redesign"],
    "medical_sites": ["https://www.nhs.uk/conditions/", "https://www.mayoclinic.org/", "https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Medicine-related_articles"]
  },
  "general_ui_ux_design_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
