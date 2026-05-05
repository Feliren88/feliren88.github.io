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

## Timeline Summary

| Month | Focus | Key Deliverable | Status |
|-------|-------|-----------------|--------|
| May 2026 | Visuals + SEO basics | Photo gallery, Person schema | IN PROGRESS |
| June 2026 | Interactive features | Timeline, Skills viz | PENDING |
| July 2026 | Network building | Wikipedia, Guest posts | PENDING |
| August 2026 | Optimization | Analytics, Polish | PENDING |
| September 2026 | Review | Role secured? Knowledge panel? | TARGET |