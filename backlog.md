# Website Optimization Backlog

## OKR (Objectives & Key Results)

### Objective 1: Google Knowledge Panel for "Vicky Feliren"
**Key Results:**
- Wikipedia page or strong WikiData presence
- Structured data markup for person/organization
- High-authority backlinks from academic/institutional sites
- Consistent NAP (Name, Address, Profession) across web

### Objective 2: Applied Scientist Role by September 2026
**Key Results:**
- 50+ unique visitors/week from tech recruiters
- 3+ interview callbacks from website visitors
- Featured in 2+ AI/tech newsletters
- LinkedIn profile traffic increased 3x

---

## Phase 1: Visual Enhancement (2-3 weeks)

### Photography & Brand Assets
- [x] Professional headshot (high-res, multiple angles) - profile.png, profile_2.svg, profile_3.svg uploaded
- [ ] Workplace/conference photos (7-10 images)
- [ ] **Card cover images — Research, Writings, Use Cases** — see RFC-005 below for full implementation plan
- [ ] SEACrowd project screenshots
- [ ] Research project visualizations (ProCANet architecture, flood maps)
- [ ] Teaching/mentoring photos
- [ ] Favicon variations (light/dark mode) - favicon.png, favicon_black.JPG uploaded
- [ ] Open Graph images for social sharing (1200x630px)
- [ ] Twitter card images

### Interactive Visualizations
- [ ] D3.js career timeline (horizontal scrollable)
  - Vertical scroll through career
  - Expandable details on hover/click
  - Color-coded by role type (research, industry, teaching)
- [ ] Publication network graph
  - Co-authorship connections
  - Topic clustering
- [ ] Skills radar chart (interactive toggle by category)
- [ ] Geospatial project map
  - Indonesia flood mapping locations
  - SEACrowd coverage areas
- [ ] Metrics dashboard
  - Papers published (counter animation)
  - Citations (update from Google Scholar API)
  - Projects shipped
  - Students mentored

---

## Phase 2: SEO & Knowledge Panel (3-4 weeks)

### Structured Data Markup
- [x] Person schema (JSON-LD) — comprehensive: name, alternateName, gender, jobTitle, alumniOf, worksFor, image, email, url, description, disambiguatingDescription, knowsAbout, knowsLanguage, award, memberOf, colleague, author (7 ScholarlyArticle entries), sameAs (10 profiles)
- [x] Article schema for each publication — via ScholarlyArticle in Person.author array with publisher and datePublished
- [ ] Organization schema for SEACrowd (standalone, not just memberOf)

### Content Optimization
- [ ] Create author page on Wikipedia — account requested, awaiting approval *(waiting)*
- [ ] **WikiData QID creation** — Wikimedia account now active. Create entity at `wikidata.org` with: name, aliases, occupation (researcher/data scientist), employer (Monash University), educated at (Monash), official website (`vickyfeliren.com`), ORCID, Google Scholar ID, GitHub, LinkedIn, Semantic Scholar ID, sameAs links. This is the single biggest unlock for Google Knowledge Panel and LLM identity resolution — Gemini, ChatGPT, and Perplexity all use WikiData as ground-truth entity reference.
- [ ] **ORCID bidirectional link** — ORCID (`0000-0003-3306-8426`) is in the site's `sameAs` JSON-LD but the ORCID profile must also link back to `vickyfeliren.com` in the "websites" field for the entity graph to close. Verify and add if missing.
- [ ] **OpenAlex duplicate author merge** — Duplicate reported *(awaiting resolution)*. Two entities exist at `openalex.org/works?filter=authorships.author.id:a5051263368`, one with wrong institution. OpenAlex feeds many LLM training pipelines — incorrect institution data propagates to AI answers.
- [x] **Google Search Console — sitemap submitted** — `https://vickyfeliren.com/sitemap.xml` submitted under Sitemaps tab.
- [x] Google Scholar profile optimization — photo added, institutional email verified
- [ ] **Semantic Scholar API auto-sync for publications** — Semantic Scholar profile claimed *(done)*. API auto-sync still pending. Public API, no auth required, author ID `2330264544`. Endpoint proven to work:
  ```
  https://api.semanticscholar.org/graph/v1/author/2330264544/papers
    ?fields=title,year,authors,venue,externalIds,citationCount,abstract,publicationVenue
  ```
  Implement as GitHub Actions weekly cron: diff against `_data/publications.yml`, auto-commit citation count updates and new papers. Citation counts are the main win — stale without automation.
- [x] **IndexNow GitHub Actions step** — Key `8b56dcaacaec497390f14ba4f2706f59`, verification file at `/8b56dcaacaec497390f14ba4f2706f59.txt`, workflow at `.github/workflows/indexnow.yml`. Pings Bing + Yandex + Perplexity 90s after every push to `main`.
  - **BLOCKED: push failed** — OAuth token missing `workflow` scope. Commit `768e204` is ready locally. To push: run `gh auth refresh -s workflow` then `git push origin main`. Alternatively, generate a new PAT with `workflow` scope at GitHub → Settings → Developer Settings → Personal Access Tokens.
- [ ] **Google Rich Results Test** — Run `search.google.com/test/rich-results` on `https://vickyfeliren.com/research/` to confirm `ScholarlyArticle` JSON-LD is parsed correctly. Free, 30 seconds. Fix any errors flagged.
- [ ] **PageSpeed Insights / Core Web Vitals** — Run `pagespeed.web.dev` on homepage. Core Web Vitals (LCP, CLS, INP) directly affect Google ranking. Target: LCP < 2.5s, CLS < 0.1. See RFC-001 in this backlog for the full performance plan.

### Link Building
- [x] Bing Webmaster Tools — site added, sitemap submitted
- [x] Yandex Webmaster — verification file live, site added
- [x] Semantic Scholar — author profile claimed (ID: 2330264544)
- [x] LinkedIn — `vickyfeliren.com` attached to profile
- [x] Perplexity Publisher Program — submitted
- [x] **Crunchbase** — Profile live at `crunchbase.com/person/vicky-feliren`
- [ ] **ResearchGate** — High domain authority, ranks well for researcher name searches. Add profile with link to `vickyfeliren.com` and import publications.
- [ ] **OpenAlex** — Author entity cleanup needed first (see Content Optimization above).
- [ ] **GitHub profile README** — `github.com/feliren88` README should prominently link to `vickyfeliren.com`. GitHub pages are crawled by every major LLM training pipeline.
- [x] **Medium** — Writings are original Medium articles (not cross-posts); writings page correctly links out to each. No canonical action needed.
- [ ] Academia.edu — Academic profile
- [ ] Guest post on:
  - Towards Data Science
  - Medium AI publications
  - SEACrowd blog

---

## Phase 3: Recruiter Experience (2 weeks)

### Resume/Downloadables
- [ ] Executive summary PDF (1 page)
- [ ] Full CV PDF (ATS-friendly)
- [ ] One-pager for each research area
- [ ] Press kit for speaking engagements

### Role-Specific Pages
- [ ] "For Recruiters" landing page
  - Key metrics (quantified achievements)
  - Tech stack badges
  - Salary expectation (optional)
- [ ] "Research Collaboration" page
  - Current interests
  - Ideal collaboration targets
- [ ] "Speaking" page
  - Previous talks
  - Topics offered
  - Contact form

### Conversion Tracking
- [x] Google Tag Manager deployed (container GTM-W4R769D6)
- [ ] Hotjar for heatmaps
- [ ] UTM tracking for LinkedIn posts
- [ ] Contact form submissions tracking

---

## Phase 4: Advanced Interactive Features (3-4 weeks)

### Physics-Based Timeline (Advanced D3)
- [ ] Interactive career timeline with physics — see RFC-004 below
  - Animated particles representing projects
  - Gravity wells at key achievements
  - Drag to explore different time periods
- [ ] Animated SVG transitions
  - Morph between career stages
  - Smooth path animations

### 3D Visualizations (Three.js)
- [ ] Interactive model of ProCANet architecture
- [ ] 3D globe showing SEA research coverage
- [ ] Particle system for research interests

### Gamification Elements
- [ ] "Explore Vicky's Journey" interactive story
  - Choose-your-own-adventure style
  - Branching paths through career
- [ ] Achievement badges (patent, publications, etc.)

---

## Phase 5: Performance & Polish (1-2 weeks)

### Technical Optimization
- [ ] Image optimization (WebP, responsive srcsets)
- [ ] Font optimization (subset, preload)
- [ ] Lazy loading for visualizations
- [ ] Service worker for offline access

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Reduced motion option
- [ ] Dark/light mode toggle
- [ ] Keyboard navigation for visualizations

### Mobile Experience
- [ ] Touch-friendly timeline controls
- [ ] Adaptive visualizations for small screens
- [ ] PWA installation prompt

---

## Success Metrics

### Weekly Tracking
- Unique visitors (target: 100+/week by July)
- Time on site (target: 3+ minutes)
- Bounce rate (target: <40%)
- Organic search traffic

### Monthly Tracking
- Google Search Console impressions
- Referral sources
- Social media engagement
- Email/contact inquiries

### Quarterly Tracking
- Interview callbacks tracked
- Publication citations growth
- Speaking/event invitations
- Network expansion (LinkedIn connections)

---

## Priority Queue (Next 30 Days)

### Must Have (Week 1)
1. [x] Professional headshots uploaded (profile.png, profile_2.svg, profile_3.svg exist)
2. Publication images/thumbnails
3. [x] Person schema markup — comprehensive JSON-LD with publications, awards, colleagues, languages
4. [x] Background images on about/contact pages (profile_2.svg, profile_3.svg)
5. Executive summary PDF

### Should Have (Weeks 2-3)
1. Interactive D3 timeline
2. Skills visualization
3. Google Scholar SEO
4. [x] Analytics setup (GTM)

### Could Have (Month 2)
1. Physics-based timeline
2. 3D visualizations
3. Wikipedia entry
4. Guest blog posts

### Won't Have (Future)
1. AR/VR features
2. Voice navigation
3. AI chatbot

---

## Resources Needed

### Time Investment
- 2-3 hours/week for content updates
- 10-15 hours for major feature releases
- 30 minutes daily for SEO monitoring

### Skills Required
- Basic photo editing
- D3.js/Three.js (learning investment)
- Basic SEO knowledge

### External Help
- Professional photographer (one-time)
- Copy editor for key pages
- Backlink building (network leverage)

---

## Risk Mitigation

### Technical Risks
- Visualization library bloat → Lazy load strategy
- Browser compatibility → Graceful degradation
- Performance impact → Code splitting

### Content Risks
- Inconsistent messaging → Style guide creation
- Outdated information → Quarterly review schedule

### SEO Risks
- Google algorithm changes → Diversify traffic sources
- Knowledge panel rejection → Multiple data sources

---

## RFC-001: 60 FPS Performance Optimization

**Status:** PROPOSED  
**Author:** Vicky Feliren  
**Date:** 2026-05-06  
**Target:** Consistent 60 FPS, Core Web Vitals green across all pages

---

### Problem Statement

The site currently has several compounding performance issues that manifest as jank, especially on mid-range devices and laptops on battery:

1. **2D canvas point cloud at 2800 points** — all projection math runs on the CPU main thread 60× per second. No GPU involvement.
2. **`saveStateSession()` inside the draw loop** — `JSON.stringify` + `sessionStorage.setItem` fires every animation frame (~60×/sec). This is synchronous I/O on the main thread during the hot render path.
3. **No adaptive quality** — same point count and render complexity on a MacBook Pro and a 5-year-old budget laptop.
4. **Synchronous Google Fonts** — `<link href="fonts.googleapis.com/...">` blocks rendering until fonts resolve.
5. **No image format optimization** — assets served as JPEG/PNG with no WebP fallback and no `srcset`.
6. **No CSS containment** — browser cannot skip layout/paint work for isolated components.
7. **No critical CSS** — full stylesheet loaded before first render.
8. **No caching strategy** — static assets re-fetched on every visit.

---

### Goals

| Metric | Current (est.) | Target |
|--------|---------------|--------|
| Animation frame time | ~12–20ms | <16.7ms (60 FPS) |
| First Contentful Paint | ~2.5s | <1.2s |
| Largest Contentful Paint | ~3s | <2.5s |
| Total Blocking Time | unknown | <200ms |
| Cumulative Layout Shift | unknown | <0.1 |
| Lighthouse Performance Score | unknown | 90+ |

---

### Proposed Changes (ordered by impact)

---

#### P0 — Critical (main thread / frame budget)

**1. Remove `saveStateSession()` from the draw loop**

- **File:** `js/main.js`
- **Problem:** `JSON.stringify` + `sessionStorage.setItem` inside `draw()` runs 60×/sec. Serialization cost accumulates across the frame budget.
- **Fix:** Delete the `saveStateSession()` call from `draw()`. Shape and rotation are already saved on shape-click (`saveState()`) and on `beforeunload` (`saveState()`). Session storage saves nothing useful since nothing reads it.
- **Effort:** 10 min. **Impact:** Frees ~1–2ms per frame.

**2. Move point cloud projection to WebGL**

- **File:** `js/main.js` — replace 2D canvas renderer with a WebGL/shader renderer
- **Problem:** 2800 points are projected, sorted by depth, and drawn one-by-one on a 2D canvas. JavaScript sorts an array of 2800 objects every frame. All math is on the CPU.
- **Fix:** Move to raw WebGL with a vertex shader. Each point becomes a vertex attribute. Projection, depth sorting (painter's algorithm or alpha blending), and draw calls happen on the GPU.
  - Use `gl.POINTS` primitive with `gl_PointSize` driven by depth uniform
  - Pass `rotX`, `rotY`, `zoom` as uniforms — no JS projection loop
  - Remove the JS `projected.sort()` call (2800 comparisons/frame)
  - Point animation (lerp toward targets) can stay in JS since it's low-frequency relative to draw
- **Effort:** 1–2 days. **Impact:** Largest single gain. Eliminates JS projection loop and sort entirely.

**3. Adaptive point count**

- **File:** `js/main.js`
- **Problem:** `pointCount = 2800` regardless of device capability.
- **Fix:**
  ```js
  const tier = navigator.hardwareConcurrency >= 8 ? 'high'
             : navigator.hardwareConcurrency >= 4 ? 'mid' : 'low';
  const pointCount = { high: 2800, mid: 1800, low: 1000 }[tier];
  ```
  - Also check `navigator.getBattery()` — drop to `low` tier when `battery.charging === false && battery.level < 0.2`
  - Check `navigator.connection.saveData` — drop to `low` if true
- **Effort:** 30 min. **Impact:** Halves render cost on low-end devices.

**4. Move lerp computation to a Web Worker**

- **File:** new `js/workers/pointcloud.worker.js`
- **Problem:** The lerp loop (`points[i].x += (targets[i].x - points[i].x) * 0.06`) iterates 2800 objects every frame on the main thread.
- **Fix:** Post point positions and targets to a worker each frame. Worker computes lerp, posts back a `Float32Array`. Main thread (or WebGL) consumes the typed array directly.
  - Use `SharedArrayBuffer` + `Atomics` if available for zero-copy transfer
  - Fall back to `postMessage` with `Transferable` typed arrays
- **Effort:** 3–4 hours. **Impact:** Removes lerp math from main thread entirely.

---

#### P1 — High (render blocking / load time)

**5. Non-blocking Google Fonts**

- **File:** `_layouts/default.html`
- **Problem:** Two `<link rel="preconnect">` + one blocking `<link href="fonts.googleapis.com">` delay FCP.
- **Fix:**
  ```html
  <!-- preload the CSS resource -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Space+Grotesk:wght@500;700&display=swap" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="...same URL..."></noscript>
  ```
  - Add `font-display: swap` (already in the Google Fonts URL parameter or set in `css/styles.css`)
  - Long term: self-host fonts via `@font-face` with WOFF2 subsets — eliminates third-party DNS round trip entirely
- **Effort:** 30 min. **Impact:** Removes render-blocking font request. Improves FCP by ~0.5–1s.

**6. Inline critical CSS**

- **File:** `_layouts/default.html`, `css/styles.css`
- **Problem:** Full stylesheet (~X KB) is render-blocking. Above-the-fold content (topbar, hero, brand) only needs a small subset.
- **Fix:**
  - Extract critical CSS (topbar, grid-bg, font declarations, hero layout) into a `<style>` block in `<head>`
  - Load full `styles.css` non-blocking: `<link rel="preload" as="style" onload="this.rel='stylesheet'">`
  - Jekyll plugin `jekyll-postcss` or a build step with `critical` npm package can automate this
- **Effort:** 2–3 hours. **Impact:** Eliminates render-blocking stylesheet. FCP improvement ~0.3–0.8s.

**7. Image optimization**

- **Files:** `assets/img/`
- **Problem:** Profile photo and favicons served as JPEG/PNG. No `srcset`, no WebP.
- **Fix:**
  - Convert all images to WebP with JPEG/PNG fallback via `<picture>`
  - Add `srcset` for responsive sizes: `profile-400.webp 400w, profile-800.webp 800w`
  - Add `loading="lazy"` to all below-fold images
  - Add `fetchpriority="high"` to the LCP image (profile photo)
  - Use `imagemagick` or `sharp` in a build step for automated conversion
- **Effort:** 2–3 hours. **Impact:** Reduces image payload 30–70%. Improves LCP.

---

#### P2 — Medium (runtime paint / layout cost)

**8. CSS containment**

- **File:** `css/styles.css`
- **Problem:** Browser recalculates layout for the entire page when any element changes.
- **Fix:**
  ```css
  .project-card  { contain: layout style; }
  .skill-card    { contain: layout style; }
  .topbar        { contain: layout style; }
  #pointcloud-bg { contain: strict; }  /* canvas: skip layout + paint + size */
  ```
- **Effort:** 30 min. **Impact:** Reduces layout thrashing during scroll-reveal and card expand.

**9. `will-change` for animated elements**

- **File:** `css/styles.css`
- **Problem:** Cards with 3D tilt, reveal animations, and canvas are not promoted to compositor layers, causing paint work on the CPU.
- **Fix:**
  ```css
  .project-card  { will-change: transform; }
  .skill-card    { will-change: transform; }
  #pointcloud-bg { will-change: contents; }
  ```
  - Set `will-change: auto` after animation ends (via JS) to free GPU memory
- **Effort:** 20 min. **Impact:** Composited animations skip paint step entirely.

**10. Throttle `pointerBiasX/Y` updates**

- **File:** `js/main.js`
- **Problem:** `pointermove` fires up to 60–120×/sec, updating bias every event. Only 1 value per frame is needed.
- **Fix:** Read the last pointer position once per `requestAnimationFrame` instead of on every event:
  ```js
  let pendingPointerX = 0, pendingPointerY = 0;
  window.addEventListener("pointermove", (event) => {
    pendingPointerX = event.clientX;
    pendingPointerY = event.clientY;
    // dragging logic stays here
  });
  // In draw():
  pointerBiasX = pendingPointerX / width - 0.5;
  pointerBiasY = pendingPointerY / height - 0.5;
  ```
- **Effort:** 20 min. **Impact:** Eliminates excess event work between frames.

---

#### P3 — Low (caching / polish)

**11. Service Worker for static asset caching**

- **File:** new `sw.js` + registration in `_layouts/default.html`
- **Problem:** CSS, JS, and fonts are re-fetched on every visit. No offline support.
- **Fix:** Cache-first strategy for CSS/JS/fonts. Network-first for HTML pages.
  ```js
  // sw.js
  const CACHE = 'feliren-v1';
  const PRECACHE = ['/css/styles.css', '/js/main.js', '/js/components/nav.js'];
  self.addEventListener('install', e => e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  ));
  ```
- **Effort:** 2–3 hours. **Impact:** Near-instant repeat visits. Enables PWA install prompt.

**12. Preload key assets**

- **File:** `_layouts/default.html`
- **Fix:**
  ```html
  <link rel="preload" href="/assets/img/profile.png" as="image" fetchpriority="high">
  <link rel="preload" href="/js/main.js" as="script">
  ```
- **Effort:** 10 min. **Impact:** LCP image starts loading earlier.

---

### Measurement Plan

Before starting any change, establish a baseline:

1. **Chrome DevTools Performance tab** — record a 5s trace on the home page. Note frame times, scripting, rendering, painting breakdown.
2. **Lighthouse** — run in incognito, capture Performance score and all Core Web Vitals.
3. **`performance.now()` instrumentation** — wrap `draw()` body with timing to measure actual frame budget consumption before/after each change.

After each P0 change, re-run Lighthouse and the DevTools trace to validate improvement before moving to the next item.

---

### Implementation Order

| Priority | Item | Effort | Expected Frame Budget Saved |
|----------|------|--------|-----------------------------|
| P0-1 | Remove saveStateSession from draw loop | 10 min | ~1–2ms/frame |
| P0-2 | Adaptive point count | 30 min | ~5–8ms/frame on low-end |
| P0-3 | Throttle pointermove | 20 min | ~0.5ms/frame |
| P0-4 | WebGL point cloud renderer | 1–2 days | ~8–12ms/frame |
| P0-5 | Web Worker for lerp | 3–4 hrs | ~2–4ms/frame |
| P1-1 | Non-blocking fonts | 30 min | ~0.5–1s FCP |
| P1-2 | Critical CSS | 2–3 hrs | ~0.3–0.8s FCP |
| P1-3 | Image optimization | 2–3 hrs | LCP improvement |
| P2-1 | CSS containment + will-change | 1 hr | Smoother scrolling |
| P3-1 | Service Worker | 2–3 hrs | Instant repeat visits |

---

---

## RFC-002: Site Restructuring — 8 Pages → 5 Pages

**Status:** PROPOSED  
**Author:** Vicky Feliren  
**Date:** 2026-05-07  
**Inspiration:** yoshuabengio.org/en, andrewng.org

---

### Problem Statement

The current nav has 8 items: Home, About, Expertise, Work, Research, Recognition, Writings, Work With Me. This creates three compounding problems:

1. **Cognitive overload for first-time visitors.** Eight options means no clear reading path. A recruiter or collaborator doesn't know whether to click About, Expertise, or Work to answer "who is this person?"

2. **Fragmentation of a single question.** "Who are you?" is split across four pages — bio (About), skills (Expertise), job history (Work), and awards (Recognition). A visitor who wants a complete picture has to make four separate trips.

3. **Homepage duplication.** The homepage currently has a "Research Focus" section AND a "How We Can Work Together" section that are near-identical to sections on the About and Contact pages. The homepage reads like a compressed second About page rather than an entry point.

**Reference analysis:**
- **Bengio (yoshuabengio.org)**: 2 nav items — Research and Blog. Homepage is the bio. Everything about the person lives in one place.
- **Andrew Ng (andrewng.org)**: 4 core pages — About (bio + all ventures), Writing, Research, Contact. "Who are you" is answered in one scroll on the About page.

Both sites feel tidy because they have a clear answer to "what is each page for?" The current site does not.

---

### Proposed New Structure (5 pages)

| Nav Label | URL | Content |
|-----------|-----|---------|
| Home | / | Hero only. Remove "How We Can Work Together" and "What Drives Me" sections. |
| About | /about/ | Bio + Research Focus cards + Expertise (skills) + Track Record (experience + education) + Recognition (awards). |
| Research | /research/ | Publications list — unchanged. |
| Writing | /writings/ | Blog posts — unchanged. |
| Work With Me | /contact/ | Engagement types + contact links. Add "What Drives Me" as opening paragraph. |

**Pages to delete:** `/expertise/`, `/work/`, `/recognition/`

---

### Content Migration Map

| Content | Currently on | Move to |
|---------|-------------|---------|
| Skills grid (6 categories) | `/expertise/` | New "How I Work" section on `/about/` |
| Work experience + education | `/work/` | New "Track Record" section on `/about/` |
| Awards (5 entries) | `/recognition/` | New "Recognition" section on `/about/` |
| "Research Focus" cards | Homepage + About (duplicate) | Keep on `/about/` only; remove from homepage |
| "How We Can Work Together" | Homepage + About (duplicate) | Remove both; Contact already has engagement section |
| "What Drives Me" paragraph | Homepage + About (duplicate) | One copy as intro paragraph on `/contact/`; remove from homepage |
| Internal link `/work/` in `about.yml` hero | Links to deleted page | Change to `#track-record` anchor or remove |

---

### About Page Layout After Merge

One long, scannable page with five anchored sections:

1. **Bio** — existing hero paragraphs (no changes to copy)
2. **Research Focus** — existing 4 cards (moved here from homepage; About is now the canonical home)
3. **How I Work** — skill categories grid pulled from current Expertise page
4. **Track Record** — experience entries + education from current Work page
5. **Recognition** — awards from current Recognition page

Each section gets an `id` anchor so the homepage and other pages can deep-link (e.g., `href="/about/#track-record"`).

---

### Homepage Layout After

Cleaner, faster to scan — it's an entry point, not a second About:

1. **Hero** — name, eyebrow, lead copy, two buttons (already point to `/about/` and `/writings/`)
2. *(Remove)* "How We Can Work Together" section
3. *(Remove)* "What Drives Me" section

Optional: keep or remove the Research Focus cards on the homepage depending on how long the hero feels without them. If kept, they are a teaser pointing to `/about/` — not a full duplicate.

---

### What Does Not Change

- All visual design — CSS, color palette, typography, animations, layout style
- All copy/content — just reorganized across fewer pages, nothing rewritten
- `/research/` and `/writings/` URLs — no broken external links to publications
- `/contact/` URL

---

### Redirects Needed

Add `jekyll-redirect-from` to `Gemfile` (if not present) and set in each deleted page's front matter before deleting the file, so search engines and any external links land gracefully:

```yaml
# _pages/expertise.md (before deletion)
redirect_to: /about/
```

| Old URL | Redirects To |
|---------|-------------|
| /expertise/ | /about/ |
| /work/ | /about/ |
| /recognition/ | /about/ |

---

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| About page becomes very long | Anchor links + sticky section subheadings make it scannable; both Bengio and Ng use long About pages successfully |
| SEO loss on deleted URLs | 301 redirects via `jekyll-redirect-from` preserve link equity |
| Internal links break | Audit `_data/*.yml` and `_pages/*.md` for `/work/`, `/expertise/`, `/recognition/` hrefs before deleting files |
| Homepage feels sparse without two sections | Test both variants; hero + Research Focus cards alone may feel cleaner, not emptier |

---

### Implementation Steps

1. Audit all internal links: `grep -r "/expertise/\|/work/\|/recognition/" _data/ _pages/ _layouts/`
2. Add anchor `id` attributes to new sections in `about.md`
3. Merge Expertise content into a new "How I Work" section in `_pages/about.md` + `_data/about.yml`
4. Merge Work content into a new "Track Record" section in `_pages/about.md`
5. Merge Recognition content into a new "Recognition" section in `_pages/about.md`
6. Update `_data/about.yml`: remove "How We Can Work Together" and "What Drives Me" sections
7. Update `_data/index.yml`: remove "How We Can Work Together" and "What Drives Me" sections
8. Update `_data/contact.yml`: add `intro_extended` field with "What Drives Me" copy as contact page opener
9. Fix internal link in `_data/about.yml` hero: change `/work/` → `#track-record`
10. Update `js/components/nav.js` NAV_ITEMS: remove Expertise, Work, Recognition entries
11. Add `redirect_to` front matter to each page being deleted
12. Delete `_pages/expertise.md`, `_pages/experience.md` (Work), `_pages/awards.md` (Recognition)
13. Bump `styles.css` version query string in `default.html` if any CSS changes are made

---

## Timeline Summary

| Month | Focus | Key Deliverable | Status |
|-------|-------|-----------------|--------|
| May 2026 | Visuals + SEO basics | Photo gallery, Person schema | IN PROGRESS |
| June 2026 | Interactive features | Timeline, Skills viz | PENDING |
| July 2026 | Network building | Wikipedia, Guest posts | PENDING |
| August 2026 | Optimization | Analytics, Polish | PENDING |
| September 2026 | Review | Role secured? Knowledge panel? | TARGET |

---

## RFC-003: About Page — From CV Dump to "Who I Am at a Glance"

**Status:** BRAINSTORM — awaiting design decision  
**Author:** Vicky Feliren  
**Date:** 2026-05-07  
**Feedback received:** "How I Work seems redundant unless you add visualizations. Overall good but first impression seems a bit wordy."  
**Target audience:** Big tech HR (recruiter scan), professors actively seeking PhD students

---

### Diagnosis: Why the Current About Page Feels Crowded

After RFC-002 the About page has seven sections in one scroll: bio (4 paragraphs), Research Focus (4 cards), How I Work (6 skill category cards with bullet lists), Track Record (5 work roles + 2 education + 1 patent + 2 teaching), and Recognition (5 awards + 3 service entries). That is effectively a full CV rendered as prose on one page.

Three root causes:

**1. The bio is 4 paragraphs before anything else loads.** Andrew Ng's entire About bio is ~255 words across 3 short paragraphs. The current bio opens with 4 paragraphs of similar length, then the page continues for another 5 sections. The reader is already fatigued before they reach the research work.

**2. "How I Work" (skills grid) adds noise, not signal.** A big tech hiring manager and a PhD-seeking professor both already know what PyTorch is. A skills list says nothing about your *depth* with it — but a first-author IEEE paper does. The feedback is right: the section is only useful with visualizations (radar chart, proficiency graph, etc.). As a plain bullet list it reads like a LinkedIn skills section, which undermines the researcher framing.

**3. Track Record is full-prose, not scannable.** The experience descriptions average 3–4 sentences each. Multiplied by 5 roles, that is ~600 words of career narrative embedded in a page that is already text-heavy. A recruiter doesn't read this — they scan. If they can't scan, they leave.

**Compounding issue — audience mismatch in tone:** The target audience (big tech HR, PhD supervisors) responds to *demonstrated quality*, not exhaustive completeness. A professor deciding whether to invite you for a PhD interview wants to see two or three research outputs that show intellectual depth, then a short bio that places them in context. An HR director at a big tech company wants: "research ✓, good institutions ✓, shipped things ✓, contact ✓" — in 30 seconds. Both audiences are repelled by length; neither is convinced by it.

The LSE guide states it plainly: *"Visitors will spend a very short time on your site. Content in engaging chunks, not just long lists."* The webflow examples show the pattern: best personal sites lean heavily visual, minimal copy, whitespace does the work.

---

### Design Principles for This Audience

These come directly from the reference guides and the two target sites:

| Principle | What it means here |
|-----------|-------------------|
| **One question per scroll position** | Each section answers exactly one thing a visitor might ask, then stops |
| **Show, don't list** | Research cards should show a publication title + venue, not a skills bullet list |
| **Quality signal over quantity signal** | 3 strong proof-points beat 10 mediocre ones |
| **Confident restraint** | Bengio's homepage has 200 words of bio. Ng's About is 255. Brevity signals you don't need to oversell |
| **Scannability at every level** | A recruiter should be able to reconstruct your career from the page in 15 seconds without reading a single full sentence |

---

### Three Options — Pick One Direction

---

#### Option A: Trim & Breathe (Lowest effort, highest immediate ROI)

**What changes:**
- Bio: cut from 4 paragraphs → 2. Keep the research thread (trustworthy AI + cultural inclusion) and remove or heavily compress the production ML paragraph (it's covered by Track Record).
- Remove "How I Work" (skills grid) entirely. The research cards and experience already demonstrate capability to this audience. If skills need a home, add a single compact line under each experience entry, not a full grid.
- Track Record: show only `dates · role · org name` per entry. Remove all prose descriptions from view by default. The descriptions still exist in the data; a "read more" or hover-expand reveals them for visitors who want depth.
- Recognition: compress to a single horizontal strip of badge-style pills rather than a full card grid.

**What it looks like scroll by scroll:**
1. Hero (unchanged)
2. Bio — 2 paragraphs (~150 words total)
3. Research Focus — 4 cards (unchanged)
4. Track Record — timeline, dates + org + title only
5. Recognition — compact horizontal badges

**Effort:** Small — data changes + CSS tweak for the timeline condensed view.  
**Risk:** The condensed timeline may feel too thin if not designed carefully.

---

#### Option B: Progressive Disclosure (Medium effort — recommended)

**Core idea:** Show a confident summary; let visitors who want depth opt in. This is how both Bengio and Ng handle it — the landing view is clean, depth is available but not forced.

**What changes:**

*Bio area (new):* 2 short paragraphs + a single "stat bar" row immediately below:
```
3 first/major-author papers  ·  4.0/4.0 GPA  ·  5 markets deployed  ·  ACL · IEEE · RSE
```
This is the Andrew Ng "8 million students" pattern — one row of hard facts does more work than a paragraph of prose.

*Research Focus (refined):* 2 wider cards instead of 4 small ones. Fewer, with more breathing room. Each card shows: research area name, 1-sentence description, and the flagship paper title + venue as a link. This is the proof point — not a tag line, an actual paper.

*"How I Work" (removed):* Eliminated. The research cards and experience already show the skills. If a visitor asks "what does she know?", the Research Focus cards and Track Record answer that better than a skills grid. Move any truly unique skills (e.g., conformal prediction, SEACrowd specific tools) to appear as small tags on the relevant experience entry.

*Track Record (condensed + expandable):* Visual timeline — left column: year range. Right column: org name + role title + one-line descriptor (12 words max). No prose by default. A subtle "expand" chevron reveals the full description for visitors who want it. This is scannable in under 10 seconds.

*Recognition (unchanged structure, condensed copy):* Keep the card grid for the featured award (Microsoft Azure APAC Champion), reduce others to title + year + single sentence.

**What it looks like scroll by scroll:**
1. Hero
2. Bio (2 paragraphs + stat bar)
3. Research (2 wider cards with paper links)
4. Track Record (scannable timeline, expand-on-click)
5. Recognition (condensed)

**Effort:** Medium — requires data changes, some new CSS for stat bar and expand/collapse, and some JS for the expand interaction.  
**Risk:** Expand/collapse adds interaction complexity; needs mobile testing.

---

#### Option C: Narrative + Proof Points (Most work, closest to Bengio/Ng)

**Core idea:** Replace the grid-of-sections structure with a single flowing narrative + 3 visual "proof point" cards that each link to evidence. This is closer to how a senior academic site reads.

**What changes:**

*Entire page collapses to:*
1. **Bio narrative** (~200 words, 3 paragraphs) — written as a personal statement, not a list of facts. Reads like a cover letter's first page, not a LinkedIn summary.
2. **Three proof point cards** (large, visual):
   - Card 1: Flagship research — SEA-VL / ProCANet, with journal badge and abstract excerpt
   - Card 2: Production impact — "Deployed to 6 markets, millions of daily transactions" — industry track record in one line
   - Card 3: Community — SEACrowd, "50+ researchers, 5 countries"
3. **Compact career strip** — a single horizontal row: `2021 Jakarta Smart City · 2021–23 GDP Labs · 2022–25 Monash RA · 2025 Artefact → Present SEACrowd + MSc`. One line, scannable, no prose.
4. **Awards** — 3 inline text pills (`APAC Champion 2020 · Cambridge Top 3 2020 · UC Berkeley Best Track 2020`), no cards.

**Effort:** High — requires a narrative rewrite of the bio, new card component for proof points, and letting go of the completeness instinct.  
**Risk:** Highest change from current state; needs the narrative to be very well written to carry the page.

---

### Recommendation

**Start with Option A immediately** (it removes the single biggest problem — the skills grid — with minimal effort and makes the page 30% shorter). Then plan Option B as a follow-on iteration once you've seen how the trimmed page feels.

Option C is the right long-term direction if the goal is to position primarily as a researcher (PhD application, academic audience). If big tech HR is equally important, Option B balances both audiences better.

**The "How I Work" section should be removed in all three options.** It is the clearest signal that the page is over-indexed on completeness over quality. Every reference — LSE guide, webflow examples, Bengio, Ng — points to the same direction: let the research work speak, not the skills list.

---

### Open Questions (needs decision before implementing)

1. **Option A vs B?** Option A is a quick win this week. Option B needs ~1 day of work. Which do you want to do first?
2. **Stat bar (Option B):** Which 4 stats best represent you to *this specific audience*? Proposal: `3 first/major-author papers · 4.0 GPA · 5 markets deployed · ACL · IEEE · RSE` — but you may want to rephrase.
3. **Track Record descriptions:** Keep them hidden behind expand-on-click, or remove them entirely and trust the homepage bio to cover the narrative?
4. **"How I Work" skills — where does it go?** Three choices: (a) delete entirely, (b) move to a collapsed accordion at the bottom of About, (c) keep as a separate `/expertise/` page that's not in the nav but linked from About with "see full skill breakdown →".
5. **Tone of the bio:** Currently writes like a portfolio pitch. Should it be rewritten to read more like an academic personal statement (for professor audience) or kept as-is?

---

## RFC-004: Career Timeline — A Cinematic, Physics-Driven Narrative (D3)

**Status:** READY FOR DELIVERY  
**Author:** Vicky Feliren  
**Date:** 2026-05-07  
**Target page:** `/about/` — replaces the Track Record section  
**Audience:** Big-tech recruiters (30-second scan) and PhD supervisors (depth-seekers)  
**Design language:** Apple-level restraint — quiet field, sparing highlights, editorial typography, motion that means something.

---

### Why This Exists

A list of jobs and dates does not show a researcher with momentum. It shows a CV. This timeline replaces the list with a **single cinematic sequence** that auto-plays a 22-second story when the page loads, then becomes an explorable map. The physics are not decoration — heavier achievements pull harder, parallel tracks overlap, and the visitor *feels* the shape of the career before they read a word.

Every visual choice serves one rule: **the field stays quiet so the highlights can speak.** Three professional moments earn the brightest light on the canvas. Everything else recedes.

---

### Objectives (measurable)

| # | Objective | How we know it landed |
|---|-----------|----------------------|
| 1 | Tell the career story in ≤ 22s without the visitor reading | Auto-play sequence renders the 5 narrative beats, hits 60 FPS on a 2020 MacBook Air |
| 2 | Make 3 hero achievements visually unmistakable | IISF 2024, APAC Champion 2020, SEA-VL ACL 2025 each render with **Highlight Mark** treatment that no other element receives |
| 3 | Be equally crafted in dark and light mode | Both palettes verified ≥ 4.5:1 on text, ≥ 3:1 on UI; Highlight Mark reads as the brightest/darkest point in either canvas |
| 4 | Stay accessible | Keyboard-navigable, screen-readable Track Record fallback, `prefers-reduced-motion` honoured, no-JS fallback intact |
| 5 | Stay fast | Lazy-loaded D3 bundle ≤ 30 KB gzipped, no impact on `/` LCP, `/about/` LCP delta < 200ms |

---

### Narrative Spine — The Five Beats

This is the canonical story. **Copy is final** — the delivery agent uses these strings verbatim. Each beat has an opening state, a held moment, and a transition out. Pacing is closer to a film cut than a webpage animation.

```
PROLOGUE  (0.0 – 1.5s)   |  Empty stage
  Time axis fades in from 0 → 1 opacity over 1200ms (cubic-bezier(0.22, 1, 0.36, 1)).
  No nodes yet. The canvas breathes. Years 2021 → 2026 appear as faint tick marks.

BEAT 1 — Foundation        (1.5 – 5.0s)
  Camera: dwell on left third of canvas
  Enter: Jakarta Smart City node (industry track), then GDP Labs node, 600ms apart
  Held title (top-left, Space Grotesk 18px):  "Production, at city scale."
  Held caption (Manrope 14px, --muted):       "2021. Where it started."
  Exit: 400ms ease-out, camera begins push right

BEAT 2 — Inflection        (5.0 – 9.0s)
  Camera: pushes right, picks up the GDP Labs gravity field
  Enter: ProCANet satellite locks into orbit; particle trail draws between Jakarta and GDP Labs
  Held title:    "The research thread ignites."
  Held caption:  "First publication. ProCANet — IEEE."
  Subtle: ProCANet satellite emits one Highlight Pulse on entry (200ms)

BEAT 3 — Depth   ★ HIGHLIGHT BEAT   (9.0 – 14.5s)
  Camera: dwell — slowest beat by design
  Enter: Monash RA node enters with the highest mass on the canvas (3-year tenure)
  HIGHLIGHT MARK appears on Monash node — IISF 2024 Most Visionary Research
    – Concentric ring expands and holds at 1.4× node radius
    – Mark color steps to the brightest luminance on the canvas
  Held title:    "Three years. First-author IEEE. Most Visionary Research."
  Held caption:  "Monash · ProCANet · IISF 2024"
  This beat lasts 5.5s. Restraint signals importance. Do not shorten.

BEAT 4 — Multiplication    (14.5 – 18.5s)
  Camera: pulls back to show the full canvas
  Enter: SEACrowd node expands on the community track
  Particle burst: 50 particles emit from the SEACrowd node over 600ms, settling into orbit
  Held title:    "SEACrowd. 50+ researchers. A benchmark for Southeast Asia."
  Held caption:  "SEA-VL · ACL 2025"
  HIGHLIGHT MARK on SEA-VL satellite (community-track variant of the highlight palette)

CODA — Now                 (18.5 – 22.0s)
  Camera: settles centred on the full timeline
  Artefact node enters quietly on the right; equilibrium reached
  Held title:    "Today: multimodal AI for the world's underrepresented languages."
  Held caption:  (none — let the canvas hold)
  Auto-play hands off to interactive mode at 22.0s
  A small ✦ "Replay" affordance appears top-right
```

**Pacing rule:** every beat has a *hold* of at least 1.2s before the next transition begins. Apple-level pacing means the visitor's eye lands before the next thing arrives. Do not crossfade beats — cut on a held moment.

---

### The Highlight System — The Most Important Visual Mechanic

The canvas has many particles. Only **three professional moments** ever receive the **Highlight Mark**. This is the central restraint of the design. Highlights are not decoration; they are the editorial voice.

#### Three permitted Highlight Marks

| # | Achievement | Beat | Visual treatment |
|---|------------|------|-----------------|
| 1 | **IISF 2024 — Most Visionary Research** | Beat 3 | Concentric ring, 3s pulse period, 1.4× radius, peak luminance |
| 2 | **SEA-VL — ACL 2025** | Beat 4 | Particle burst (50 particles, 600ms), then steady ring at peak luminance |
| 3 | **Microsoft Azure APAC Champion 2020** | Beat 1 (under-the-line) | Single 200ms ring flash on Jakarta-era industry track, then ambient glow |

No other element earns a Highlight Mark. Other awards live in the Recognition section below the timeline as supporting context.

#### Highlight color tokens — the only "loud" colors on the canvas

The field colors are quiet (steel, navy, teal — all desaturated). The highlight color is one decisive luminance step away from the background. In dark mode it is near-white; in light mode it is near-ink. This is the Apple move: keep the field quiet, then make the peak unmistakable.

```
DARK MODE                   LIGHT MODE
─────────────────           ─────────────────
canvas bg     #070d14       canvas bg     #f0f3f7
field steel   #5d7691       field steel   #3f6490
field warm    #6e89a8       field warm    #2e5070
field teal    #4f8579       field teal    #1e6e5a
muted label   #8b9db5       muted label   #3d506b

★ HIGHLIGHT MARK             ★ HIGHLIGHT MARK
  fill        #eef3fb         fill        #0a1f3a
  ring        #c9d8f0         ring        #1a3a5c
  pulse glow  rgba(238,243,251,0.45)  pulse glow  rgba(10,31,58,0.35)
```

**Field saturation rule:** track colors must sit within 6 ΔE of each other so they read as a family, not as separate categories. The Highlight Mark must sit ≥ 35 ΔE away from every track color. Verify with Chrome DevTools' contrast picker before shipping.

#### Theme switching

Reading the theme: `document.documentElement.dataset.theme` (set by the existing theme button). When the user toggles theme, the timeline's `getColors()` helper re-reads the value and runs a 280ms color crossfade on every D3 selection — fill, stroke, and ring. Particles do not re-spawn. Verify by toggling theme during Beat 3 dwell — it should feel like a lighting change, not a reload.

---

### Visual Grammar — One-Line Reference

| Element | Physics role | Visual encoding |
|---------|-------------|----------------|
| Career role | Node | Circle, radius = √(months tenure) × 6, max 32px |
| Project / paper | Satellite | 4px particle, elliptical orbit around parent node |
| Track lane | Y-axis swim lane | Research (top), Industry (middle), Community (bottom) |
| Time | X-axis | Linear scale, Jan 2021 → present |
| Highlight Mark | Gravity well | Concentric ring + peak-luminance fill — only 3 ever exist |
| Particle trail | Damped force trace | 35% alpha line, fades over 1200ms |
| Beat title / caption | Editorial overlay | DOM elements, not SVG — Space Grotesk + Manrope |

---

### Motion System

All motion uses one of three named easings. The delivery agent must use these by name, not eyeball other curves.

```
emphasized   cubic-bezier(0.22, 1, 0.36, 1)    // beat entries, hero reveals
standard     cubic-bezier(0.4, 0, 0.2, 1)      // hover, theme switch, color crossfade
gentle       cubic-bezier(0.4, 0, 0.6, 1)      // particle drift, idle pulses
```

**Durations** (do not improvise):

| Action | Duration | Easing |
|--------|----------|--------|
| Beat title fade in | 480ms | emphasized |
| Beat title hold | ≥ 1200ms | — |
| Beat title fade out | 320ms | standard |
| Camera push between beats | 1100ms | emphasized |
| Highlight Pulse (one-shot) | 200ms | standard |
| Highlight Mark steady pulse | 3000ms loop | gentle |
| Hover detail panel slide-in | 280ms | standard |
| Theme color crossfade | 280ms | standard |
| Replay button fade in (post-coda) | 600ms | standard |

**Motion budget:** total moving pixels per frame must not exceed 8% of the canvas area during idle. Auto-play may briefly exceed this during particle bursts (Beat 4) for ≤ 600ms. If the budget is exceeded sustainedly, drop the particle count by 25% and re-test.

---

### Interaction Model

After auto-play hands off:

```
IDLE
  Particles drift on gentle easing, ~0.3 units/sec
  Highlight Marks pulse at 3s period
  Replay button visible top-right
  Time scrubber visible bottom (Beat 1 → Coda)

HOVER node
  Other nodes ease to 35% opacity (220ms standard)
  Detail panel slides in from right (desktop) or up from bottom (≤ 1023px)
    Panel content: dates · org · role · one-line impact (≤ 90 chars)
    Panel link: "Read more ↓" — anchors to prose Track Record below the canvas
  Satellites of the hovered node freeze and grow 1.2×

CLICK node (any)
  Same as hover, but state is sticky — dismissed by Escape, click outside, or hovering another node

CLICK Highlight Mark
  Camera pushes to that mark (800ms emphasized)
  Detail panel includes a publication link / external URL
  Back affordance returns to equilibrium

DRAG node
  Overrides simulation for that node only
  Release: rejoins simulation with inherited velocity
  5px drag threshold prevents accidental click→drag transitions

TIME SCRUBBER
  Drag or click jumps to that beat's opening state
  Particles animate from current position — no hard reset
  Keyboard: ←/→ steps one beat

KEYBOARD
  Tab    cycles focus through nodes left → right (chronological)
  Enter  triggers click on focused node
  Esc    dismisses panel, returns to idle
  P      pauses / resumes auto-play
  R      replays from Prologue
```

---

### Responsive Behaviour

| Viewport | Behaviour |
|----------|-----------|
| ≥ 1024px | Full canvas, three swim lanes, full physics, full auto-play |
| 768 – 1023px | Two swim lanes (community merges into research), 60% particle count, panel slides up from bottom |
| < 768px | **Static SVG fallback** — horizontal-scroll timeline with milestone dots and Highlight Marks rendered as static rings. No physics, no auto-play. The narrative still reads. |

The fallback is not a degraded experience — it is a different cinematic. Same copy, same Highlight Marks, just composed for thumb-scroll.

---

### Accessibility (non-negotiable)

- `prefers-reduced-motion: reduce` → skip auto-play entirely; render the Coda equilibrium state with all Highlight Marks visible but not pulsing.
- Every node is `<g role="button" tabindex="0" aria-label="...">` with full text equivalent of date / org / role.
- Beat titles render as DOM `<h3>` (visually hidden when faded out, present in the accessibility tree continuously throughout that beat).
- Time scrubber: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (1–5), `aria-valuetext` (beat name).
- Below the canvas, render the existing prose Track Record as the canonical, screen-reader-friendly source of truth. The canvas is a *presentation layer* over that data.
- No-JS fallback: the prose Track Record is the primary content; the canvas progressively enhances it.
- Color contrast: every label ≥ 4.5:1; every UI ring ≥ 3:1. Verified in both modes.

---

### Technical Architecture

```
_data/timeline.yml                 ← single source of truth (data + copy)
_pages/about.md                    ← mount point + prose Track Record fallback
_layouts/default.html              ← conditional script load on /about/
js/components/timeline.js          ← IIFE entry, ~400 LOC; handles theme, scrubber, replay, a11y
js/lib/d3-timeline-bundle.js       ← rollup'd D3 modules (force, drag, zoom, transition, ease, interpolate-path, scale, selection)
css/styles.css                     ← timeline component styles (append, do not split file)
```

**D3 modules** (rollup `--format iife`, target ≤ 30 KB gz):
`d3-selection`, `d3-scale`, `d3-force`, `d3-drag`, `d3-zoom`, `d3-transition`, `d3-ease`, `d3-interpolate-path`.

**Hybrid renderer:** `<canvas>` for particle trails (cheap fill-rect path); `<svg>` for nodes, Highlight Marks, and labels (DOM-accessible). Both live in the same mount container with `position: absolute` overlays.

**Data binding:** all node data, copy, and beat configuration live in `_data/timeline.yml`. The JS reads from a JSON-serialized blob emitted by Jekyll into a `<script type="application/json" id="timeline-data">…</script>` tag. **No copy lives in JS.**

---

### Deliverables — The Agent's Checklist

The agent picking this up ships these files in this order. Each step has an acceptance check.

#### Step 1 — Data
**Create** `_data/timeline.yml` with:
- `meta:` containing canvas dimensions, beat count, motion easings (mirrors of the Motion System table above)
- `tracks:` array of 3 entries (research, industry, community), each with `dark` and `light` color hex
- `highlight:` object with `dark` and `light` mark color sets (fill, ring, glow)
- `nodes:` array of 6 entries — Jakarta, GDP Labs, Monash RA, SEACrowd, Artefact, plus a placeholder for any role to be confirmed
- `beats:` array of 6 entries (Prologue, Beat 1–4, Coda) with `start_ms`, `end_ms`, `title`, `caption`, `camera`, `enters[]`, `highlight_mark` (if any)
- `acceptance:` data validates against a JSON schema embedded as a comment at top of file

**Acceptance:** `bundle exec jekyll build` succeeds; `_site/about/` HTML contains a `<script type="application/json" id="timeline-data">` block with the full payload.

#### Step 2 — Mount + fallback
**Edit** `_pages/about.md` Track Record section:
- Insert `<div id="career-timeline" role="region" aria-label="Career timeline visualization"></div>` *above* the existing prose list.
- Wrap the existing prose list in `<div class="timeline-fallback" data-fallback="track-record">…</div>` so JS can hide it when the canvas is up. Without JS, the fallback is the page.

**Acceptance:** Disable JS in the browser; the page still reads the full Track Record narrative.

#### Step 3 — Conditional script load
**Edit** `_layouts/default.html`:
- Add a Liquid conditional `{% if page.permalink == '/about/' %}` block in the deferred script section that loads `/js/lib/d3-timeline-bundle.js?v=1` then `/js/components/timeline.js?v=1`, both `defer`.
- Add a `<link rel="preload" as="script" href="/js/lib/d3-timeline-bundle.js?v=1">` only on `/about/`.
- Update `sw.js` PRECACHE array to include both new files.

**Acceptance:** `/` does not download the D3 bundle (verify in Network panel). `/about/` does, and parses ≤ 30 KB gz.

#### Step 4 — Bundle D3
**Create** `js/lib/d3-timeline-bundle.js`:
- Use `rollup --format iife --name d3` with the modules listed above
- Commit the bundled output (no build step in CI yet)
- Document the rollup command in a comment at the top of the file

**Acceptance:** `gzip -c js/lib/d3-timeline-bundle.js | wc -c` ≤ 30720 bytes.

#### Step 5 — Build `timeline.js`
**Create** `js/components/timeline.js` — single IIFE. Internal structure:

```
(function () {
  const data = JSON.parse(document.getElementById('timeline-data').textContent);
  const mount = document.getElementById('career-timeline');
  if (!mount || !window.d3) { return; /* fallback stays visible */ }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = getColors();             // theme-aware
  const layout = computeLayout();         // scales, lanes, mount sizing
  const renderer = createRenderer();      // canvas + svg overlay
  const sim = createSimulation();         // d3-force config
  const beats = createBeatSequencer();    // chapter timing
  const ui = createUI();                  // scrubber, replay, panel, keyboard

  document.querySelector('.timeline-fallback')?.setAttribute('hidden', '');
  if (reducedMotion) beats.skipToCoda(); else beats.play();

  observeThemeChanges();                  // 280ms color crossfade on toggle
  observeResize();                        // re-layout on viewport changes
})();
```

**Acceptance:**
- Auto-play runs end-to-end and lands on the Coda equilibrium
- Hover, click, drag, scrubber, keyboard all behave as specified
- Theme toggle during Beat 3 produces a 280ms color crossfade with no particle re-spawn
- `prefers-reduced-motion: reduce` skips to Coda immediately
- No console errors in either mode, on Chrome / Firefox / Safari

#### Step 6 — Styles
**Append to** `css/styles.css`:
- `.timeline-mount` — sizing, `contain: strict`, `position: relative`, dark + light surface backgrounds
- `.timeline-beat-title`, `.timeline-beat-caption` — Space Grotesk 18 / Manrope 14, color tokens, fade transitions
- `.timeline-detail-panel` — slide-in panel, glassy `--surface` background, `--border-ui` 1px border
- `.timeline-scrubber`, `.timeline-replay-btn` — interactive controls, full focus rings via `:focus-visible`
- `.timeline-fallback[hidden]` — hidden when JS upgrades the page
- `@media (max-width: 767px)` — collapse to static SVG fallback

Bump CSS version: `styles.css?v=N` → `styles.css?v=N+1` in `_layouts/default.html` and `sw.js` PRECACHE.

**Acceptance:** Lighthouse passes ≥ 90 Performance and ≥ 95 Accessibility on `/about/` in both themes.

#### Step 7 — Verification pass
Before declaring done, the agent runs through this manually:

- [ ] Auto-play story reads cleanly on first load, dark mode
- [ ] Auto-play story reads cleanly on first load, light mode
- [ ] Theme toggle during Beat 3 produces a smooth color crossfade
- [ ] Three Highlight Marks are visually unmistakable; no fourth element competes
- [ ] Hover panel never overlaps a Highlight Mark when it appears
- [ ] Time scrubber returns to any beat's opening state cleanly
- [ ] `prefers-reduced-motion` honored on macOS, iOS, and Windows
- [ ] Mobile fallback is a complete narrative, not a stub
- [ ] No-JS page still reads the full Track Record
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] No console errors, warnings, or layout shift > 0.05

---

### Out of Scope (do not gold-plate)

- 3D rendering, WebGL, Three.js — pure 2D D3 only
- Audio cues / sound design
- Server-side analytics on beat completion
- Editing tool / CMS for the timeline data
- Animation timeline editor — the beats are coded, not authored visually
- Sharing a single beat as a deep-linked URL (`/about/#beat-3`) — defer to a future RFC
- Adding more than 3 Highlight Marks. The restraint is the design.

---

### Editorial Voice Reference

When in doubt, read these two pages for tone and pacing:
- **yoshuabengio.org/en** — confident restraint, minimal copy
- **andrewng.org** — long form, but every line earns its place

When in doubt visually, model after:
- The **AirPods Pro** product page transitions (Apple) — push-and-dwell camera motion, never crossfade
- **Stripe Sessions** event pages — editorial typography over restrained motion
- **Linear's changelog** — quiet field, occasional decisive accent

Do not model after: dashboard demos, parallax-heavy portfolios, or any "data viz showcase" reel. Those are noisy. This is a story.

---

## RFC-005: Card Cover Images — Research, Writings, Use Cases

**Status:** READY FOR DELIVERY
**Author:** Vicky Feliren
**Date:** 2026-05-12
**Target pages:** `/research/`, `/writings/`, `/usecases/`
**Scope:** Add a cover image slot to every card across all three pages. Images are optional — cards without an image fall back gracefully to the existing layout.

---

### Why

Cards without images are text-only. A cover image gives each card:
- A visual anchor that communicates the work at a glance (satellite map, paper figure, article cover art)
- Higher click-through when shared on social (Open Graph uses the same image)
- Stronger visual hierarchy on the page — the eye lands on the image before the title

All three pages share the same `.project-card` component, so a single CSS addition covers all three.

---

### Image Specs (all three pages)

| Property | Value |
|----------|-------|
| Aspect ratio | 16:9 |
| Display size | 100% card width × auto height (CSS-controlled) |
| Format | WebP only (site convention) |
| Fallback | No image field = card renders without image (no broken layout) |
| Alt text | Required — set in data YAML per card |
| Loading | `lazy` on all card images (below fold) |
| Width/height attrs | Required to prevent layout shift |

---

### Step 1 — Prepare images

Create one 16:9 WebP cover image per card and place in `assets/img/cards/`:

```
assets/img/cards/
├── research-mining.webp          ← Multi-modal mining segmentation
├── research-sea-vl.webp          ← SEA-VL multicultural VLM benchmark
├── research-flood-procanet.webp  ← ProCANet flood segmentation
├── research-conformal.webp       ← Conformal prediction for VLMs
├── research-iwa.webp             ← IWA flood paper
├── research-mangrove.webp        ← Mangrove detection
├── research-gdp.webp             ← GDP Labs production ML
├── writings-map-territory.webp   ← "We all think our map is the territory"
├── writings-conformal-prod.webp  ← "Your model just killed someone's grandmother"
├── writings-letting-go.webp      ← "The art of letting go"
├── writings-meditation.webp      ← "Meditation. 7 days. No phone."
├── writings-trustworthy-ai.webp  ← "My initial exploration on Trustworthy AI"
├── writings-phoenix.webp         ← "Phoenix Protocol"
├── writings-privacy.webp         ← "Privacy Matters"
├── writings-mental-health.webp   ← "Mental Health Matters"
└── usecase-<key>.webp            ← one per use case entry in usecases.yml
```

**Good image sources per type:**
- **Research**: paper figures, architecture diagrams, satellite imagery screenshots, result visualisation from the paper PDF
- **Writings**: Medium article cover art (visible at the top of each Medium post) — screenshot and export as WebP
- **Use Cases**: architecture diagrams, output maps, result screenshots from the project

**Conversion command** (if you have PNG/JPG source):
```bash
cwebp -q 82 source.png -o output.webp
# or with ImageMagick:
magick source.png -quality 82 output.webp
```

Target file size: **≤ 80 KB per image** (compress aggressively — these are card thumbnails, not hero images).

---

### Step 2 — Add `image` field to data YAML files

**`_data/publications.yml`** — add `image` and `image_alt` to each entry:
```yaml
- key: mining-multispectral
  image: /assets/img/cards/research-mining.webp
  image_alt: "Satellite imagery segmentation output showing mining footprints in colour-coded classes"
  # ... rest of fields unchanged
```

**`_data/thoughts.yml`** — add `image` and `image_alt` to each entry:
```yaml
- title: "We all think our map is the territory"
  image: /assets/img/cards/writings-map-territory.webp
  image_alt: "Abstract illustration of overlapping maps representing different cultural worldviews"
  # ... rest unchanged
```

**`_data/usecases.yml`** — add `image` and `image_alt` to each use case entry under `items:`:
```yaml
- key: flood-procanet
  image: /assets/img/cards/usecase-flood-procanet.webp
  image_alt: "ProCANet flood segmentation output on Sentinel-1 SAR imagery showing flood extent in blue"
  # ... rest unchanged
```

Both fields are optional. Cards without `image` render exactly as they do today.

---

### Step 3 — Update page templates

**`_pages/publications.md`** — add the image block inside `<article class="project-card reveal">`, before the tag:
```liquid
{% if pub.image %}
<img src="{{ pub.image }}" alt="{{ pub.image_alt }}" class="card-cover" width="640" height="360" loading="lazy">
{% endif %}
<p class="tag">{{ pub.tag }}</p>
```

**`_pages/thoughts.md`** — same pattern:
```liquid
{% if post.image %}
<img src="{{ post.image }}" alt="{{ post.image_alt }}" class="card-cover" width="640" height="360" loading="lazy">
{% endif %}
```

**`_pages/usecases.md`** — same pattern on each use case card:
```liquid
{% if item.image %}
<img src="{{ item.image }}" alt="{{ item.image_alt }}" class="card-cover" width="640" height="360" loading="lazy">
{% endif %}
```

---

### Step 4 — Add CSS

Append to `css/styles.css` (bump version `?v=N` → `?v=N+1` in `default.html` and `sw.js`):

```css
.card-cover {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
  margin: -1.2rem -1.2rem 1rem -1.2rem;  /* bleed to card edges, space below */
  width: calc(100% + 2.4rem);            /* compensate for card padding */
}
```

Adjust the negative margin values to match `.project-card` padding (currently `1.2rem` — verify in `styles.css` at the `.project-card` rule before shipping).

---

### Step 5 — Verify

- [ ] Cards with images display correctly in dark and light mode
- [ ] Cards without `image` field render identically to today (no broken layout)
- [ ] Images are lazy-loaded (verify in Network panel — they should not appear in initial load waterfall)
- [ ] No layout shift — `width`/`height` attrs are present on every `<img>`
- [ ] Mobile: images still fill card width correctly at ≤760px
- [ ] Lighthouse Performance still ≥ 90 on `/research/` — card images are lazy so they should not affect LCP

---

### Implementation order

1. Prepare all images (biggest time investment — can be done in batches, one page at a time)
2. Add YAML fields for whichever page you have images for
3. Update the template for that page
4. Add CSS (one change covers all three pages)
5. Repeat for next page

Start with **Writings** — Medium article cover images are easy to screenshot and the page has the most cards, so the visual improvement is most immediately obvious.

---

## RFC-007: Writings Page — Dates, Reorder, Tags

**Status:** DELIVERED — 2026-05-23
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target page:** `/writings/`
**Estimated effort:** ~1.5 hours total

---

### Problem Statement

The Writings archive currently has no publication dates, no ordered hierarchy, and no way for a visitor to filter by interest. Every article carries equal visual weight regardless of when it was written or who it's written for. A 2022 personal reflection and a 2025 conformal prediction deep-dive look identical. This is wrong — and fixable in an afternoon.

Three compounding effects:
1. **No dates = no return reason.** Returning visitors cannot tell if anything changed. The conformal prediction essay is fresher and more relevant than the social media reflection; nothing signals that.
2. **Weak opening = high bounce.** The current first card ("We all think our map is the territory") is a good essay but not the strongest hook. The list is currently ordered by data entry, not by pull.
3. **Flat list = no hunt reward.** A recruiter who wants only engineering pieces has to scroll past personal essays. Variable reward via filtering (Eyal's Hook Model, information-foraging) is left on the table.

---

### Change 1: Date stamp every article

Add a `date` field to each entry in `_data/thoughts.yml`:

```yaml
- title: "Your model just killed someone's grandmother"
  date: "2025-03"
  url: "..."
```

Render in the template as `Mar 2025` next to the card header. Format: `Mon YYYY` (3-letter month, 4-digit year). Update `_pages/thoughts.md` to output:

```liquid
{% if post.date %}
<span class="card-date">{{ post.date | date: "%b %Y" }}</span>
{% endif %}
```

Add `.card-date` to `css/styles.css`: `color: var(--muted); font-size: 0.78rem; font-family: var(--font-mono, monospace);`

**Acceptance:** Every card shows a date. No card shows a broken or missing date.

---

### Change 2: Reorder — front-load the three highest-pull titles

The opening three articles should cover three distinct visitor motivations: moral stake, idea-promise, professional self-interest. Proposed top-3 order in `_data/thoughts.yml`:

1. **"Your model just killed someone's grandmother"** — moral stake + consequentialist framing (Loewenstein information gap)
2. **"We all think our map is the territory"** — idea-promise with global relevance
3. **"Quality and Reliability for AI Engineers"** — professional self-interest for the primary audience

Reorder the YAML array. No template changes needed.

**Acceptance:** The Writings page leads with the three entries above, in this order.

---

### Change 3: Tag every article — Engineering / Research / Personal

Add a `tag` field to each `_data/thoughts.yml` entry:

```yaml
- title: "Your model just killed someone's grandmother"
  tag: Engineering
```

Three permitted values: `Engineering`, `Research`, `Personal`.

**Template:** Add a filter bar above the article list in `_pages/thoughts.md` (same pattern as the existing filter on `/research/`):

```html
<div class="filter-bar" role="group" aria-label="Filter writings">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="Engineering">Engineering</button>
  <button class="filter-btn" data-filter="Research">Research</button>
  <button class="filter-btn" data-filter="Personal">Personal</button>
</div>
```

Wire to the existing JS filter pattern used on the research page — `data-tag` on each card, `data-filter` on each button, toggle `.hidden` via the same event listener approach.

**CSS:** Reuse `.filter-btn` styles already in `styles.css`. Add `.card-tag-pill` if you want a visible tag badge on each card itself.

**Acceptance:** Clicking "Engineering" hides Personal and Research cards. Filter persists on scroll. "All" restores full list.

---

### Implementation order

1. Add `date` and `tag` fields to all 11 entries in `_data/thoughts.yml` (30 min)
2. Reorder the YAML to put the three top-pull essays first (5 min)
3. Update `_pages/thoughts.md` to render date + filter bar (30 min)
4. Add `.card-date` CSS and wire filter JS (20 min)
5. Bump `styles.css` version string in `default.html` and `sw.js`

---

## RFC-008: About Page — CTA Hierarchy, "This Month" Block, Tech Stack Trim, Talks Section

**Status:** PARTIAL DELIVERY — 2026-05-23 (modules 2, 3, 4 delivered; module 1 CTA pending decision)
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target page:** `/about/`
**Estimated effort:** ~2.5 hours (modules 1–4 only; email opt-in is RFC-012)

---

### Problem Statement

The About page currently does five jobs simultaneously and has no dated signal. Four independent modules address distinct problems; none depends on the others and each can be shipped separately.

---

### Module 1 — Hero CTA hierarchy

**Problem:** Three equal-weight buttons (Research, Use Cases, Writings) create the paradox of choice. No single action dominates.

**Fix:** Promote Use Cases to primary visual weight; demote Research and Writings to secondary text-style links.

- Change the Use Cases button: keep `.btn btn-primary` (filled, full padding)
- Change Research and Writings: add `.btn-ghost` class — text-weight with subtle underline, no background fill

**Why Use Cases as primary:** It carries the future conformal prediction demo (RFC-009). Making it primary now seeds the expectation and creates a return trigger once the demo lands.

**CSS:** Add `.btn-ghost { background: transparent; border: none; text-decoration: underline; padding: 0.4rem 0.6rem; color: var(--accent); }` to `styles.css`. Adjust to match existing type scale.

**Effort:** 20 min. **Risk:** Low — visual-only change, no content or data changes.

---

### Module 2 — "This Month" block (replaces or augments "Currently:")

**Problem:** The current `Currently:` section has no date. Returning visitors cannot tell if it changed. Without a timestamp, the return reason evaporates.

**Fix:** Add `_data/now.yml` as the data source. Render a dated block with a visible `last_updated` label.

```yaml
# _data/now.yml
last_updated: 2026-05-23
items:
  - "Wrapping the uncertainty chapter of my M.Sc. thesis"
  - "Reviewing for IGARSS 2026"
  - "Drafting a CommonLID follow-up for SEA scripts"
  - "Reading: Vovk and Shafer on conformal prediction"
```

**Template** (in `_pages/about.md` or `_data/about.yml` section):

```liquid
{% assign now = site.data.now %}
<section class="section-block now-block">
  <h2>This month <span class="now-date">— updated {{ now.last_updated | date: "%b %-d, %Y" }}</span></h2>
  <ul>
    {% for item in now.items %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
</section>
```

**CSS:** `.now-date { font-size: 0.78rem; color: var(--muted); font-weight: 400; }`

**Update cadence:** Every 4–8 weeks. Change `last_updated` date + refresh `items` list. The visible date is what creates the return reason.

**Effort:** 45 min including first content entry. **Risk:** Low — isolated data file, does not touch existing sections.

---

### Module 3 — Tech stack trim: 41 items → 25 items in 5 clusters

**Problem:** A 41-item flat skills list reads as junior. It signals "I know the names of tools" rather than depth. Recruiters and professors respond to quality signals, not quantity.

**Fix:** Cut to ~25 items across 5 clusters of 5. Cluster headings carry the chunking weight (Miller's law).

**Proposed 5 clusters and contents** (adjust to match actual `_data/skills.yml` structure):

| Cluster | Keep |
|---------|------|
| Modeling | PyTorch, TensorFlow, scikit-learn, Diffusion Models, Knowledge Distillation |
| Vision-Language & Uncertainty | Conformal Prediction, Vision-Language Models, Semantic Segmentation, Cultural Benchmarking, Causal Inference |
| Serving & Infrastructure | Kubernetes, Docker, GCP (Vertex AI, BigQuery), AWS (EC2, SageMaker), vLLM / SGLang |
| Data & Pipelines | Apache Spark, dbt, Vector Database, Google Earth Engine, Kafka |
| Reliability & Evaluation | LLM-as-a-Judge, MLflow, Weights & Biases, LangSmith, A/B Testing |

**Remove:** Tableau, Streamlit, d3, Plotly, Matplotlib, Scala, R, Intel OpenVINO, OpenCV, LangChain/LangGraph, RAG & Agentic Workflows, Pose Estimation, Multispectral Imaging, Human-in-the-Loop Evaluation, Calibration Drift Monitoring, Latency Benchmarking (16 items cut).

Removed items are demonstrably true but do not add differentiation for the target audience. If a specific role requires one of them, they belong in a cover letter, not a portfolio homepage.

**Effort:** 45 min (edit `_data/skills.yml` + adjust cluster labels in the page template). **Risk:** Low — data-only change; removed items are not deleted, just unlisted.

---

### Module 4 — Talks section

**Problem:** Teaching and Professional Service exist, but speaking engagements and podcast appearances have no home. The absence of a Talks section is also a missed commitment device.

**Fix:** Add a `Talks` block as a sibling section to Teaching in `_data/experience.yml` (or a standalone `_data/talks.yml`).

**If no confirmed talks exist yet**, ship the heading with a placeholder entry:

```yaml
talks:
  - title: "First confirmed talk slot"
    venue: "Open"
    date: "Q3 2026"
    note: "Available for conference talks, podcasts, and panel invitations."
```

The empty-but-dated section serves two purposes: it is a commitment device for you (now there's a slot to fill), and it is a scarcity signal for visitors who are considering inviting you.

**Template:** Render identically to the existing Teaching section structure.

**Effort:** 20 min. **Risk:** None — additive only.

---

### Open questions before implementing

1. Which module to ship first? Recommended order: 2 (now.yml) → 3 (tech stack trim) → 1 (CTA) → 4 (Talks).
2. Does `Currently:` section get replaced entirely, or does `This Month` sit alongside it?
3. Tech stack trim: review the proposed cluster contents against `_data/skills.yml` and flag any items that should stay.

---

## RFC-009: Use Cases Page — Conformal Prediction Interactive Demo

**Status:** PROPOSED — Week 2 target
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target page:** `/usecases/`
**Estimated effort:** ~8 hours (6h Hugging Face Space build + 30min embed + 1.5h polish)

---

### Why This Page, Why This Demo

The Use Cases URL already promises applied artifacts. A conformal prediction demo lands in the right semantic context — it is the methodology claim made interactive. The IKEA effect compounds here: every slider drag is an act of investment. Visitors who configure their own prediction set will remember the site for months, not minutes (Eyal's Hook Model: investment → stored value → return trigger).

If the full interactive demo is too heavy this quarter, ship a **static walkthrough first** (three images, three pre-computed prediction sets at three α values, rendered as a comparison grid). Static today, interactive next quarter.

---

### Minimum Viable Demo — Specification

**Backend (Hugging Face Space, Gradio)**

- **Input:** Image upload with 3 sample images preloaded (satellite flood map, cultural scene, natural image). Visitors can play without uploading.
- **Slider:** Coverage target α ∈ [0.80, 0.99], step 0.01
- **Output:**
  - Prediction set C(x): the smallest set of class labels such that P(y ∈ C(x)) ≥ 1 − α on the calibration distribution
  - Empirical coverage on a held-out calibration set (so the guarantee is shown, not hand-waved)
  - Set size (number of labels included) to make the efficiency tradeoff visible

**Core function:**

```python
from typing import Tuple, List
import numpy as np

def conformal_prediction_set(
    softmax_scores: np.ndarray,
    calibration_scores: np.ndarray,
    alpha: float,
) -> Tuple[List[int], float]:
    """Return the prediction set and the empirical threshold.

    Args:
        softmax_scores: Shape (num_classes,). Predicted class probs for one test input.
        calibration_scores: Shape (n_cal,). Nonconformity scores on held-out cal set,
            computed as 1 - p_true.
        alpha: Target miscoverage rate in (0, 1).

    Returns:
        prediction_set: Sorted list of class indices included in C(x).
        q_hat: The (1 - alpha) quantile threshold used.
    """
    n = calibration_scores.shape[0]
    q_level = np.ceil((n + 1) * (1 - alpha)) / n
    q_hat = float(np.quantile(calibration_scores, q_level, method="higher"))
    nonconformity = 1.0 - softmax_scores
    prediction_set = sorted(np.where(nonconformity <= q_hat)[0].tolist())
    return prediction_set, q_hat
```

**Model:** Use a pretrained EfficientNet-B0 or ViT-B/16 from `timm` — small enough to run on CPU on a free HF Space. Calibration set: a 500-image held-out split of ImageNet-1k (or a custom cultural image set if available). This keeps the demo honest — the empirical coverage shown is real.

**Gradio UI layout:**

```
[ Sample Images: Flood Map | Cultural Scene | Natural ]   [ Upload your own ]
[ Coverage target α: ——●—— 0.90 ]
─────────────────────────────────────────────────────
[ Prediction Set ]        [ Coverage Stats ]
  Labels: {cat, lynx}      Empirical coverage: 91.2%
  Set size: 2              Calibration n: 500
  q̂ threshold: 0.23        Target α: 0.90
```

---

### Embedding in Use Cases

Once the Space is live at `https://huggingface.co/spaces/feliren/<space-name>`:

```html
<!-- In _pages/usecases.md, at top of page or in a featured section -->
<section class="section demo-embed reveal">
  <h2>Try it: Conformal Prediction</h2>
  <p class="subtitle">Drag the slider. Watch the guarantee hold.</p>
  <iframe
    src="https://feliren-<space-name>.hf.space"
    frameborder="0"
    width="100%"
    height="520"
    loading="lazy"
    title="Conformal prediction interactive demo"
  ></iframe>
</section>
```

**CSS:** `.demo-embed iframe { border-radius: 8px; border: 1px solid var(--line); min-height: 480px; }`

---

### Static fallback (Week 1 option)

Before the Space is built, ship a static comparison grid showing the coverage vs. set-size tradeoff across three α values on three pre-selected images. Three 16:9 result cards side-by-side (or stacked mobile). This gives the Use Cases page a technical artifact immediately without the HF Space build time.

Data can be pre-computed locally and hardcoded as a `_data/demo_results.yml`.

---

### Acceptance criteria

- [ ] Three sample images preloaded; visitor can start without uploading
- [ ] Slider at α=0.95 produces a larger set than α=0.80 for the same image (coverage/efficiency tradeoff is visible)
- [ ] Empirical coverage on calibration set is shown and updates with slider
- [ ] Space runs on CPU-only (free HF tier); first inference < 4 seconds
- [ ] Iframe renders at all viewport widths without horizontal scroll
- [ ] `loading="lazy"` — iframe does not delay page LCP

---

## RFC-010: Research Page — Author List Collapse + Citation Badges

**Status:** PROPOSED
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target page:** `/research/`
**Estimated effort:** ~2 hours

---

### Problem Statement

Two independent issues on the Research page reduce scannability and leave third-party social proof uncaptured.

---

### Change 1 — Collapse long author lists by default

**Problem:** The ACL 2025 co-author list is 90+ names. On mobile it occupies multiple screen heights before the visitor reaches the abstract or venue. This is visual noise at the worst possible position — the top of the card.

**Fix:** Default to showing first 3 authors + "et al." with a `Show all authors` toggle.

In `_pages/publications.md`, replace the flat author render with:

```liquid
{% assign author_count = pub.authors | size %}
{% if author_count > 4 %}
  <span class="authors-short">{{ pub.authors | slice: 0, 3 | join: ", " }}, et al.</span>
  <button class="authors-toggle" aria-expanded="false" data-target="authors-{{ pub.key }}">Show all {{ author_count }} authors</button>
  <span class="authors-full hidden" id="authors-{{ pub.key }}">{{ pub.authors | join: ", " }}</span>
{% else %}
  <span class="authors-short">{{ pub.authors | join: ", " }}</span>
{% endif %}
```

Wire a small inline `<script>` (or add to `main.js`) to toggle `.hidden` and flip `aria-expanded` on click.

**CSS:** `.authors-toggle { background: none; border: none; color: var(--accent); font-size: 0.78rem; cursor: pointer; padding: 0; margin-left: 0.3rem; } .authors-full.hidden { display: none; }`

**Acceptance:** ACL 2025 card shows "Vicky Feliren, [Author 2], [Author 3], et al." by default. "Show all 90 authors" toggle expands inline. Toggle is keyboard accessible (`Enter`, `Space`).

---

### Change 2 — Citation count badge (hand-updated v1, automated v2)

**Problem:** Citation counts are third-party social proof currently left on the table. A `Cited by N` badge per paper costs nothing to display and adds immediate credibility signal.

**v1 — Hand-updated (ship this quarter):**

Add a `citations` field to `_data/publications.yml`:

```yaml
- key: procanet-flood
  citations: 4
  # ... rest of fields
```

Render as a badge in the card:

```liquid
{% if pub.citations %}
<span class="citation-badge" title="Google Scholar citation count">Cited by {{ pub.citations }}</span>
{% endif %}
```

**CSS:** `.citation-badge { display: inline-block; background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.72rem; color: var(--muted); margin-left: 0.4rem; }`

Update quarterly. Check `scholar.google.com/citations?user=R2LVQ7AAAAAJ`.

**v2 — Automated (Phase 2, see also Phase 2 SEO backlog):**

The existing Semantic Scholar API backlog item (`/graph/v1/author/2330264544/papers?fields=citationCount`) covers this. Once the GitHub Actions cron is wired, the `citations` field updates automatically on each weekly run.

**Acceptance (v1):** At least 3 papers show citation count badges. No badge appears on papers with 0 citations (omit the field for unpublished/preprint papers).

---

### Optional — Collapse abstracts by default

Currently abstracts expand the page significantly. The one-sentence description above each abstract already summarises the key finding.

**Option:** Wrap abstract in a `<details>` / `<summary>` HTML element — no JS required, accessible by default:

```liquid
{% if pub.abstract %}
<details class="abstract-toggle">
  <summary>Read abstract</summary>
  <p>{{ pub.abstract }}</p>
</details>
{% endif %}
```

**CSS:** `details.abstract-toggle summary { cursor: pointer; color: var(--accent); font-size: 0.85rem; } details.abstract-toggle[open] summary { color: var(--muted); }`

This is a quality-of-life improvement, not a conversion change. Ship only if the page feels too long after the author collapse is in place.

---

## RFC-011: Contact Page — Three-Tier Friction Model

**Status:** DELIVERED — 2026-05-23 (Calendly CTA hidden until calendly_open: true + calendly_url set in contact.yml)
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target page:** `/contact/`
**Estimated effort:** ~1 hour (content changes, no new components)

---

### Problem Statement

The current "Work With Me" page is email-only with no availability signal, no pre-filtering of serious inquiries, and no way for casual visitors to engage without cold-emailing. Every visitor faces the same friction regardless of their intent. This misses the self-sorting behavior that converts casual interest into concrete asks.

Three contact tiers — low, medium, high friction — let visitors self-select. Cialdini's scarcity principle and Norman's feedback principle both apply: clear availability + constrained slots signal value, reduce cold-email hesitation, and filter for serious asks.

---

### Tier 1 — Low friction: Email with scope signal

Add a short paragraph before the email link that tells visitors:
- What you respond to: research collaboration, speaking invitations, mentorship inquiries, AI consulting
- What you don't respond to: recruitment for full-time roles before Q4 2026, unsolicited LinkedIn connections without prior email

```yaml
# _data/contact.yml — add field
email_scope: "I respond to: research collaboration, conference talks, AI consulting, and PhD supervision inquiries. I don't respond to: cold recruitment outreach before Q4 2026."
```

Render above the email link. One paragraph. No bullet list needed.

---

### Tier 2 — Medium friction: Calendly with scarcity signal

Add a 15-minute Calendly link for lightweight sync conversations. The scarcity signal is the key:

```
📅 15-min intro call — Two slots per month. Currently open: June 2026.
```

Drive from `_data/contact.yml`:
```yaml
calendly_url: "https://calendly.com/feliren/15min"
calendly_slots_label: "Two slots per month. Currently open: June 2026."
calendly_open: true
```

Render as a secondary CTA button below the email link. Hide the button when `calendly_open: false`.

Update `calendly_slots_label` each month when updating the "This Month" block (RFC-008 Module 2).

---

### Tier 3 — High friction / low cost: Async intake form

For consulting and research collaboration inquiries that need pre-qualification before a call. Use Tally.so (free tier, works with static sites, zero iframe footprint):

Three pre-qualifying questions:
1. What are you working on and where does AI fit?
2. What's your timeline and budget range (if applicable)?
3. How did you find this page?

```yaml
# _data/contact.yml
intake_form_url: "https://tally.so/r/<form-id>"
intake_form_label: "Consulting & collaboration inquiry"
```

Render as a tertiary text-style link below the Calendly button. Not a primary CTA — it is for self-selected serious asks.

---

### Availability headline

Add one line at the top of the Contact page, below the page heading, before any other content:

```
Currently open for: one consulting engagement (Q3 2026), two mentorship slots, conference talks through end of year.
```

Drive from `_data/contact.yml`:
```yaml
availability_headline: "Currently open for: one consulting engagement (Q3 2026), two mentorship slots, conference talks through year-end."
```

Update when availability changes. This is the first thing a visitor reads — it answers the implicit question "is this person even reachable?" before they scroll.

**Effort:** 1 hour — all content changes in `_data/contact.yml` + template updates in `_pages/contact.md`. No new components.

---

### Acceptance

- [ ] Availability headline is the first text after the page heading
- [ ] Email tier includes the scope signal paragraph
- [ ] Calendly CTA is visible when `calendly_open: true`, hidden when `false`
- [ ] Tally form link present as a tertiary option
- [ ] All external links open in `target="_blank" rel="noreferrer"`
- [ ] Mobile: all three tiers are readable and tappable without horizontal scroll

---

## RFC-012: Email Opt-In — Newsletter via Buttondown

**Status:** PROPOSED
**Author:** Vicky Feliren
**Reviewed by:** Claude Opus
**Date:** 2026-05-23
**Target placement:** Below Insights section on homepage (`/`)
**Estimated effort:** ~1.5 hours

---

### Why

The Hook Model (Eyal) currently has no investment loop on the site. Visitors arrive, read, leave. No trigger brings them back unless they manually return. An email opt-in closes the loop: the next essay becomes a fresh external trigger for every subscriber. A 2% opt-in rate on 100 weekly visitors = 2 new subscribers/week. At 52 weeks, that is 100 subscribers after one year of consistent essays — a warm audience for every job application, collaboration ask, or paper announcement.

Buttondown is the right choice: free under 100 subscribers, single `<form>` embed, no tracking pixels, consistent with the site's minimalist aesthetic. ConvertKit is also viable.

---

### Copy

```
One essay a month on trustworthy AI, conformal prediction, and Southeast Asian ML.
No spam. Unsubscribe in one click.

[ Your email ]  [ Subscribe → ]
```

Value promise is specific (topic + frequency). Objection pre-handled (no spam + easy exit). No incentive bribe needed — the content is the value.

---

### Implementation

**Step 1 — Create Buttondown account** at buttondown.email. Set publication name, reply-to email.

**Step 2 — Embed form** in `index.html` (or `_data/index.yml` if the homepage sections are data-driven):

```html
<section class="section opt-in reveal">
  <h2>Monthly dispatch</h2>
  <p class="subtitle">One essay on trustworthy AI, conformal prediction, and Southeast Asian ML. No spam.</p>
  <form
    action="https://buttondown.email/api/emails/embed-subscribe/feliren"
    method="post"
    target="_blank"
    class="opt-in-form"
  >
    <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
    <button type="submit" class="btn btn-primary">Subscribe →</button>
  </form>
</section>
```

Replace `feliren` with the actual Buttondown username.

**Step 3 — CSS:**

```css
.opt-in-form {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.opt-in-form input[type="email"] {
  flex: 1 1 220px;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--border-ui);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
}
.opt-in-form input[type="email"]::placeholder { color: var(--muted); }
@media (max-width: 480px) {
  .opt-in-form { flex-direction: column; }
  .opt-in-form .btn { width: 100%; }
}
```

**Placement:** Immediately below the Insights section, above the Let's Collaborate section. The Insights section shows recent essays; the opt-in is the natural next action for a visitor who just read three article summaries.

---

### Acceptance

- [ ] Form submits to Buttondown without page reload (opens confirmation tab via `target="_blank"`)
- [ ] Input field is keyboard-navigable and screen-reader labelled (`aria-label`)
- [ ] Mobile: form stacks to single column, button full-width at ≤ 480px
- [ ] Dark and light mode: input background and text are readable
- [ ] Empty submit shows browser `required` validation (no custom JS needed)

---

## Weekend Sequencing — Two-Weekend Execution Plan

*From the Claude Opus review, 2026-05-23. Sequenced by effort-to-impact within each session.*

### Weekend 1 (~6 hours) — No new features, only sharpening existing pages

| # | Task | RFC | Est. |
|---|------|-----|------|
| 1 | Date stamp every Writings entry | RFC-007 | 20 min |
| 2 | Tag Writings entries Engineering / Research / Personal | RFC-007 | 20 min |
| 3 | Reorder Writings — lead with top-3 pull titles | RFC-007 | 5 min |
| 4 | Wire Writings filter bar (reuse research page JS pattern) | RFC-007 | 30 min |
| 5 | Trim tech stack: 41 → 25 items in 5 clusters | RFC-008 M3 | 45 min |
| 6 | Build `_data/now.yml`, render "This Month" dated block | RFC-008 M2 | 45 min |
| 7 | Add Talks section (even if first entry is placeholder) | RFC-008 M4 | 20 min |
| 8 | Promote Use Cases CTA to primary weight | RFC-008 M1 | 20 min |
| 9 | Collapse author lists behind toggle on Research | RFC-010 | 45 min |
| 10 | Add citation count badges (hand-updated v1) | RFC-010 | 30 min |
| 11 | Availability headline + three-tier contact structure | RFC-011 | 60 min |

### Weekend 2 (~10 hours) — The demo, the newsletter, the badges

| # | Task | RFC | Est. |
|---|------|-----|------|
| 1 | Build Hugging Face Space with CP demo | RFC-009 | 6 hr |
| 2 | Embed iframe on Use Cases | RFC-009 | 30 min |
| 3 | Create Buttondown account + embed form below Insights | RFC-012 | 90 min |
| 4 | Write first newsletter essay, queue for month-end | — | 60 min |
| 5 | Hand-update citation counts from Google Scholar | RFC-010 | 30 min |

---

## RFC-006 — Landing Page Research: Insights & Backlog (May 2026)

**Sources reviewed:** Unbounce Anatomy, Stellar Content Guide, Figma Resource Library, OptimizePress Elements, Zapier Examples, Unbounce High-Converting Examples, Unicorn Platform 2026 Architecture, Mailchimp Resources. (CXL and Neil Patel returned 403.)

**Scope:** Map conversion-focused landing page best practices to vickyfeliren.com. The homepage acts as a personal brand landing page whose primary conversion goal is: (1) get researchers/collaborators to contact, (2) drive to Research/Writings pages.

---

### What the research says (principles that apply here)

1. **Single primary CTA above the fold** — every high-converting page has exactly one CTA in the hero. Multiple competing actions (Research, Contact, Writings, Skills) dilute click-through.
2. **Availability signal** — visitors want to know immediately if you're open to opportunities. Most personal sites omit this and lose relevant inbound.
3. **Problem → Solution framing** — the hero copy should state the audience's problem before introducing the solution (you). "Multimodal AI is unreliable and culturally narrow" → "I build trustworthy systems that work for everyone."
4. **Proof adjacent to claims** — testimonials, stats, and venue logos belong *immediately after* the claim they support, not in a separate "awards" section buried below the fold.
5. **CTA after every major section** — conversion research shows repeating the CTA after each content block significantly increases total clicks without feeling spammy.
6. **Scannable credibility stats** — 3–4 bold numbers (publications, years, venues, hackathon wins) give visitors a fast trust signal without reading paragraphs.
7. **Venue trust badges** — logos or bold venue names (IEEE, ACL, Remote Sensing of Environment) near the hero perform better than plain text lists.
8. **Objection block** — a short FAQ on the contact page that pre-answers "what's your availability?", "what do you charge?", "what kind of projects?" removes friction before a cold message.
9. **Message consistency** — the hero headline, SEO description, OG image text, and JSON-LD description should all reinforce the same core USP. Currently these say subtly different things.
10. **Mobile hero CTA sizing** — tap targets on mobile should be ≥ 44px height. The current `.btn` may fall short at small viewports.

---

### P1 — Quick wins (< 1 day each)

- [ ] **Single primary CTA in hero** — keep "View Research →" as the *only* primary button; demote "Work With Me →" to a secondary link (outline style or text link). The contact page is already in the nav; the hero shouldn't compete with itself.
- [ ] **Availability badge** — add a small `●  Open to collaborations` pill near the hero eyebrow or below the profile image. Driven by a new `available: true` field in `_data/index.yml`. Renders as a green dot + text, hidden when `false`.
- [ ] **Scannable stats row** — add a `<ul class="hero-stats">` below the hero meta with 3–4 numbers: `N publications`, `N+ years research`, `N hackathon wins`, `N venues`. Driven by `_data/index.yml stats:` list. Single-line on desktop, wraps on mobile.
- [ ] **Message consistency audit** — align hero `lead1`, `description` in front matter, JSON-LD `description`/`disambiguatingDescription`, and OG description. All should say: *trustworthy multimodal AI for underrepresented cultures and geographies.*
- [ ] **Mobile CTA tap target** — audit `.btn` height at 375px viewport. Ensure `min-height: 44px` and `padding` produce a target ≥ 44px tall.
- [ ] **CTA after Insights section** — the existing "View all writings →" link is small. Promote it to a full `btn btn-secondary` button below the insights grid.

---

### P2 — Moderate effort (1–3 days each)

- [ ] **Problem → Solution hero reframe** — rewrite `lead1` in `_data/index.yml` to open with the problem: *"Most AI systems fail at the margins — wrong culture, wrong geography, wrong language."* Then introduce the solution in `lead2`. Requires copy iteration; test with a few trusted reviewers before shipping.
- [ ] **Proof-adjacent venue badges** — in the hero or immediately below the stats row, add a compact strip of logos/text: `Published in IEEE · ACL · Remote Sensing of Environment`. Drives immediate credibility without scrolling to Recognition.
- [ ] **FAQ / objection block on Contact page** — add a `_data/contact.yml` `faq:` list. Render as an accordion or simple `<dl>` before the contact form. Cover: availability, collaboration types, response time, what you're *not* open to.
- [ ] **Featured publication highlight** — surface one flagship paper near the top of the Research page (or homepage Research preview) with abstract snippet, venue badge, and "Read paper →" CTA. Moves the strongest proof point above the fold.
- [ ] **Section CTAs** — after Track Record and after Recognition on the homepage, add a secondary CTA: "See full research →" and "Work with me →". Repeat the conversion invitation at natural scroll-stop points.
- [ ] **"As seen in" media strip** — a minimal `Venue:` strip (IEEE / ACL / RSE logos or text-badges) placed between the hero and the about text acts as a fast trust anchor. Common pattern on high-converting personal/consultant pages.
- [ ] **Use Cases page restructure** — frame each use case in Problem → Approach → Result format. Add a CTA at the end of each case. This converts the page from a portfolio into a consulting pitch.

---

### P3 — Longer projects (1–2 weeks each)

- [ ] **Contact form (Formspree or similar)** — currently the "Work With Me" page is email-only. A form with subject-line presets ("Research collaboration", "Speaking", "Consulting") reduces friction and increases conversion. Formspree free tier supports static sites.
- [ ] **Video introduction (60–90 s)** — a short "who I am and what I work on" video embedded in the hero or About section increases time-on-page and personal connection. High lift but highest conversion impact on personal brand pages.
- [ ] **Testimonials / endorsements** — even 2–3 short quotes from collaborators or supervisors (Risqi Saputra, Taufiq Asyhari) would significantly boost trust. Add as `_data/testimonials.yml`, render on homepage below Let's Collaborate.
- [ ] **Writings pagination** — the Writings page currently renders all articles. Add client-side pagination (show 6, "Load more" button) to keep the page fast as the list grows.
- [ ] **OG image optimization** — the current OG image is the profile photo. A designed OG card (name + role + tagline on a branded background) performs better in link previews on LinkedIn/Twitter. Generate with a script or Figma export.
- [ ] **Structured data for writings** — add `BlogPosting` JSON-LD blocks to the Writings page, auto-generated from `_data/thoughts.yml`. Enables Google rich results for articles.
- [ ] **Inline critical CSS** — styles.css (5.8 KiB) is render-blocking. Inlining ~1 KiB of critical CSS (above-fold variables + hero layout) and loading the rest async would push FCP under 2 s on slow 4G. Significant but complex; requires a build step or manual extraction.
- [ ] **Cloudflare proxy** — adding Cloudflare in front of GitHub Pages enables: custom HTTP security headers (CSP, HSTS, COOP, X-Frame-Options), edge caching with longer TTLs, image optimization, and potentially real User Analytics. Zero-cost at free tier for this traffic level.
- [ ] **hreflang for Indonesian audience** — if content is ever published in Indonesian (Medium supports this), add `<link rel="alternate" hreflang="id">` tags. Low effort if the structure is in place early.

---

### Already done (May 2026)

- [x] Heading hierarchy fix (h3 → h2 sections, h4 → h3 cards) — Accessibility 100
- [x] SW null Accept header guard — Best Practices console error fixed
- [x] **Insights section** on homepage — latest 3 writings with "View all →"
- [x] **Let's Collaborate section** on homepage — engagement tags + CTA
- [x] **Footer banner** — brand + description + social left / nav right two-column layout
- [x] Footer copyright simplified (removed "Monash University, Melbourne")
- [x] "Quality and Reliability for AI Engineers" article added to `_data/thoughts.yml`

---

## RFC-013: Site-Wide Visual Refinement Audit

**Status:** DELIVERED — 2026-06-11 (code complete; browser visual QA in both themes still pending — no Ruby/browser on the implementation host)
**Author:** Claude (visual review of all pages + `css/styles.css` v28)
**Date:** 2026-06-11
**Scope:** Whole-site visual quality — hierarchy, color, consistency, and polish. Complements RFC-001 (performance), RFC-003 (About content), RFC-005 (card images). Items here are visual/CSS only; no content rewrites.

---

### Diagnosis — the three big patterns

1. **No focal point: everything is a card.** Hero, timeline items, skill cards, project cards, contact cards, award cards, and service items all share the identical treatment — `1px var(--line)` border, ~1rem radius, `var(--surface)` glass background, the same `--shadow` (`styles.css:255–267`). When every element is elevated, nothing is. The eye has nowhere to land first.

2. **Flat typographic hierarchy.** Section `h2` headings render at 1.1rem in the accent color — *smaller than the card `h3` titles inside them* (1.12rem). Meanwhile ~20 distinct font sizes exist between 0.65rem and 1.35rem, many ad hoc (0.66, 0.67, 0.68, 0.72, 0.73, 0.74, 0.75, 0.76, 0.78…). The site reads as one continuous texture of small text rather than scannable sections.

3. **Monochrome flatness.** The entire palette is one desaturated steel-blue hue. `--accent` (#7792af) is barely distinguishable from `--muted` (#8b9db5), so links, headings, tags, and CTAs all carry the same visual weight. The primary CTA button is a translucent tint of the same hue — it does not pop. (This is the same "quiet field needs a decisive peak" insight RFC-004 already applies to the timeline — the rest of the site never got the peak.)

---

### P0 — Quick wins (≤ 1 hour each)

- [x] **Add a brand wordmark to the topbar.** The `.brand` style exists in `styles.css:206` but no element uses it — `default.html`'s topbar is `justify-content: flex-end`, leaving the top-left corner empty on every page. Add `<a class="brand" href="/">Vicky Feliren</a>` (or a "VF" monogram) and switch the topbar to `space-between`. Free brand recognition on every page view, zero new CSS.
- [x] **Make section headings anchor the page.** Bump `.about-section h2`, `.t-section-title`, `.insights-hd h2` from 1.1rem to ~1.5–1.75rem and switch from accent color to `var(--text)` (keep the eyebrow pattern for the accent pop). A recruiter scanning the homepage should be able to find Track Record / Recognition / Insights from headline size alone.
- [x] **Give the primary CTA a real accent.** Pick one slightly warmer/brighter accent (even just a higher-chroma step of the existing blue, e.g. #8fb4e3 dark / #2563a8 light) used *only* for `.btn-primary` and the availability dot. Everything else stays in the quiet steel family. One decisive color, used once per viewport.
- [x] **Remove hover-lift from non-interactive elements.** `.timeline li:hover` lifts and glows (`styles.css:492–496`) but timeline items aren't links — false affordance. Reserve `translateY` hovers for clickable cards only.
- [x] **Delete the duplicated/broken CSS block.** `styles.css:145–162` repeats `*`, `html`, and `body` rules already defined at 99–143; the *first* `body` background also has a typo (`at -8%28%`, line 140) that invalidates its whole `background` declaration — it only works because the duplicate re-declares it. Keep one clean copy.
- [x] **Fix CLS on homepage insight cards.** `.insight-card-img` in `index.html` has no `width`/`height` attributes (RFC-005 specifies them for `.card-cover` but the insights grid uses its own class). Add `width="640" height="360"` + keep `loading="lazy"`.

### P1 — Consistency pass (half a day total)

- [x] **Tokenize the radius and type scales.** Border radii currently include 1rem, 0.85rem, 10px, 8px, 0.65rem, 0.5rem, 0.45rem, 0.35rem, 0.3rem. Define 3 tokens (`--radius-lg: 12px`, `--radius-md: 8px`, `--radius-sm: 4px`) and a 6-step type scale (e.g. 0.75 / 0.85 / 1 / 1.2 / 1.5 / clamp-display), then sweep. Mechanical change, large coherence payoff.
- [x] **Light-mode QA sweep for hardcoded dark colors.** Several rules bypass the theme variables and assume dark mode: `.loc` (#7e95b1), `.skill-card li` (`rgba(17,31,46,0.7)` bg + #9bb0c8), `.lab-foot span`, `.btn-secondary` (`rgba(18,31,47,0.62)`), `.shape-btn` (`rgba(16,26,39,0.74)`), `.card-toggle` (`rgba(18,30,46,0.68)`), and the heavy `rgba(0,0,0,0.28)` hover shadows. In light mode these render as muddy dark chips. Replace with vars or add `html[data-theme="light"]` overrides; verify every interactive state in both themes.
- [x] **Demote one layer of card chrome.** Pick a hierarchy: (a) hero = the only glass-surface box, (b) project/use-case/insight cards = border + surface, no shadow until hover, (c) timeline/award/service entries = borderless list rows with a hairline divider (the award-pills on the homepage already do this well — extend that pattern). This single change fixes the "everything is a card" monotony.
- [x] **Consolidate page-level `<style>` blocks into `styles.css`.** `index.html` (~130 lines), `contact.md`, and `usecases.md` each carry their own style block, plus scattered inline `style=""` attributes (hero leads, contact intro, column titles). Move them into the stylesheet under page-scoped comments. Improves caching, kills drift (the insight-card and card-cover image styles have already diverged), and makes the token sweep above possible.
- [x] **Vary the section rhythm on the homepage.** Every section uses the identical `margin-top: 2.5rem; border-top: 1px var(--line)` divider, producing a uniform "ruled notebook" cadence. Give the two conversion sections distinct treatment: Insights keeps the rule; Let's Collaborate gets more breathing room (e.g. `padding: 4rem 0`) and a soft radial wash behind it so the final CTA feels like a destination, not another row.
- [x] **Calm the hero box.** The hero card currently stacks: photo + social row + eyebrow + h1 + pronouns + two leads + buttons + "Right now" pills + the point-cloud shape picker. Two cuts: (1) move the shape picker out of the hero — a small ✦ icon button beside the theme toggle that pops the four options keeps the easter egg without spending hero real estate; (2) replace the inline `style="font-size:1.32rem…"` lead with a `.lead--xl` class using `clamp(1.05rem, 2vw, 1.3rem)` so it scales on mobile. Also consider `clamp(150px, 22vw, 225px)` for the profile photo so it doesn't dominate small screens.

### P2 — Larger polish (1–2 days)

- [x] **Background layer audit.** Four ambient layers compete on every page: grid texture + animated point cloud + two radial gradients + per-card `backdrop-filter` blur. Test removing the grid (`opacity 0.17` over a point cloud at `0.22` is mostly noise) and keeping point cloud + one gradient. Fewer layers = calmer field = the new accent reads stronger. (Pairs with the RFC-001 WebGL work — fewer layers is also cheaper.)
- [x] **Compress oversized assets.** `assets/img/tech-in-asia-ai-rules.webp` is 733 KB and `profile_3_bg.webp` is 220 KB — both far above the ≤80 KB card-image budget set in RFC-005. Resize/re-encode; verify `profile_3_bg.webp` and `profile_2_bg.webp` are even referenced anywhere before keeping them.
- [x] **Unify the three card-image implementations.** `.card-cover` (RFC-005), `.insight-card-img` (homepage), and the use-case cards (no image slot yet) should share one cover-image component: same aspect ratio (16:9), same edge-bleed margin trick, same dimensions/lazy attributes. One class, three pages.
- [x] **Differentiate the Research page venue line.** `.venue` is italic accent at 0.78rem — visually identical weight to the tag and the author line, so the most credibility-bearing fact on the card (IEEE / ACL / RSE) disappears. Render venue as a small bordered badge (the `.note-badge` style already exists) so it reads at a glance; pairs with the RFC-010 citation badges.
- [x] **Empty-state and density check on Use Cases.** 19 cards in a 320px-min grid with up to ~10 tech tags each is the densest page on the site. Cap visible tech tags at ~5 with a "+N" overflow chip, and consider featuring the top 3 cases (wider cards, RFC-005 cover images) above the uniform grid.

---

### Delivery notes (2026-06-11)

- **Tokens added** to `:root`: `--cta`/`--cta-text` (dark `#8fb4e3`, light `#2563a8`), `--shadow-hover`, `--radius-lg/md/sm` (12/8/4px), and a 7-step type scale (`--fs-2xs` 0.7rem → `--fs-heading` clamp). All sub-1rem font sizes and all non-pill border radii in `styles.css` now use tokens.
- **Hero CTAs:** first button (Research) renders `btn-primary`, the rest `btn-secondary` — consistent with RFC-006 P1 ("View Research as the only primary"). If RFC-008 M1 later decides Use Cases should be primary, reorder `_data/index.yml buttons:`.
- **Shape picker** moved to a ✦ popover in the topbar (next to the theme toggle); `main.js` binds `.shape-btn` by class so no JS changes were needed beyond a small open/close script in `default.html`. Hidden on coarse pointers and ≤760px, matching the point-cloud visibility rules.
- **Timeline/award/service rows:** timeline entries are now borderless rows with hairline dividers; remaining cards keep border+surface and earn shadow on hover; the hero is the only resting-shadow surface.
- **Grid background layer removed** (`.grid-bg` div + CSS). Revert = restore the div in `default.html` and the 10-line rule (see git history) if the field feels too flat.
- **Assets:** `tech-in-asia-ai-rules.webp` 732 KB → 45 KB (was losslessly encoded; re-encoded lossy q80, same 1024×576). `profile_3_bg.webp` stays 220 KB — RGBA transparency is already at its compression floor; it is also unreferenced by any template (only docs), so consider deleting instead.
- **Use Cases density:** tech tags capped at 5 with a "+N" dashed chip. The "feature top 3 cases" idea is deferred — it needs the RFC-005 cover images first.
- **`about.md` not touched:** it has `redirect_to: /` so its duplicate style block is dead code; clean up when deleting the page.
- **CSS version bumped** v28 → v29 in `default.html` and `sw.js` PRECACHE.
- Remaining unchecked items below need a real browser (screenshots, Lighthouse, CLS) — run after the next deploy.

---

### Verification (after each batch)

- [ ] Screenshot homepage, Research, Use Cases, Writings, Contact in **both themes** at 1440px / 768px / 375px and compare against current
- [ ] Lighthouse Accessibility stays 100 (heading sizes/colors must keep ≥ 4.5:1 contrast)
- [ ] No CLS regression from image/typography changes (target < 0.1)
- [x] `grep -n "style=" _pages/*.md index.html` returns no presentational inline styles after the consolidation pass
- [x] README.md updated with Lighthouse scores and May 2026 changelog