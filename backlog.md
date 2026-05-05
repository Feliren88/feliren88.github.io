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
- [x] Professional headshot (high-res, multiple angles) - profile.png uploaded
- [ ] Workplace/conference photos (7-10 images)
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
- [ ] Create author page on Wikipedia
- [ ] Add to WikiData (QID creation)
- [ ] ORCID profile alignment
- [ ] Google Scholar profile optimization
  - Profile photo
  - Verified email at institution
  - Bio with consistent keywords

### Link Building
- [ ] Submit to:
  - Crunchbase (profile creation)
  - ResearchGate
  - Academia.edu
  - Semantic Scholar author profile
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
- [ ] Interactive career timeline with physics
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
1. [x] Professional headshots uploaded (profile.png exists)
2. Publication images/thumbnails
3. [x] Person schema markup — comprehensive JSON-LD with publications, awards, colleagues, languages
4. Executive summary PDF

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

## Timeline Summary

| Month | Focus | Key Deliverable | Status |
|-------|-------|-----------------|--------|
| May 2026 | Visuals + SEO basics | Photo gallery, Person schema | IN PROGRESS |
| June 2026 | Interactive features | Timeline, Skills viz | PENDING |
| July 2026 | Network building | Wikipedia, Guest posts | PENDING |
| August 2026 | Optimization | Analytics, Polish | PENDING |
| September 2026 | Review | Role secured? Knowledge panel? | TARGET |