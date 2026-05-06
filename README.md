# Vicky Feliren - Personal Website

Personal portfolio website for Vicky Feliren - Applied Scientist specializing in Multimodal AI, Vision-Language Models, and Remote Sensing. Built with Jekyll static site generator.

## Project Structure

```
feliren88.github.io/
├── README.md       # Project documentation
├── CLAUDE.md       # Development guidelines
├── _config.yml     # Jekyll configuration
├── Gemfile         # Ruby dependencies
├── index.html      # Homepage (Jekyll template)
├── sw.js           # Service worker (Jekyll-processed Liquid template)
├── _layouts/
│   ├── default.html  # Base layout with SEO, skip link, font preloads
│   └── page.html     # Page template
├── _pages/         # Jekyll pages (Markdown)
│   ├── about.md
│   ├── skills.md
│   ├── experience.md
│   ├── publications.md
│   ├── awards.md
│   ├── thoughts.md
│   └── contact.md
├── _data/          # YAML data files
│   ├── index.yml
│   ├── about.yml
│   ├── skills.yml
│   ├── experience.yml
│   ├── publications.yml
│   ├── awards.yml
│   ├── thoughts.yml
│   └── contact.yml
├── assets/
│   ├── fonts/      # Manrope + Space Grotesk — latin/latin-ext subsets only
│   └── img/        # profile.webp, profile-450.webp, profile.png, SVGs
├── css/
│   └── styles.css
└── js/
    ├── main.js          # Core JavaScript
    └── components/
        └── nav.js       # Navigation — single source of truth (NAV_ITEMS array)
```

## Technology Stack

- **Jekyll**: Static site generator with Liquid templating
- **HTML5**: Semantic markup with accessibility
- **CSS3**: Custom properties, Grid/Flexbox, responsive design
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **jekyll-seo-tag**: Automatic meta tags
- **jekyll-sitemap**: Auto-generated sitemap

## Performance

- WebP images with `<picture>` srcset; PNG fallback for older browsers
- `fetchpriority="high"` on above-fold hero image
- `loading="lazy"` on all off-screen images
- `<link rel="preload">` for critical font files
- Font `@font-face` declarations limited to latin and latin-ext subsets
- Service worker (`sw.js`) for offline access — cache-first for assets, network-first for HTML

## Accessibility

Targets **WCAG 2.1 AA** compliance:

- Skip-to-content link as first focusable element
- `:focus-visible` keyboard focus indicator on all interactive elements
- Interactive element borders use `--border-ui` (≥ 3:1 contrast ratio)
- `--text` / `--muted` / `--accent` all meet contrast requirements against dark background
- `aria-live="polite"` on dynamic status regions
- Decorative images marked `aria-hidden="true"`

## Structured Data (JSON-LD)

Person schema in `_layouts/default.html` covers:

| Property | Value |
|----------|-------|
| `@type` | Person |
| `@id` | `https://feliren88.github.io/about/` |
| `jobTitle`, `alumniOf`, `worksFor` | Applied Scientist, Monash University |
| `knowsAbout` | 6 AI/ML domains |
| `knowsLanguage` | English, Indonesian |
| `award` | 5 awards (2019–2024) |
| `memberOf` | SEACrowd, ACL, IEEE |
| `colleague` | Risqi Saputra, Taufiq Asyhari |
| `author` | 7 ScholarlyArticle entries with DOI/URLs |
| `sameAs` | 10 academic/social profiles |

## Navigation

All navigation is defined in `js/components/nav.js` via the `NAV_ITEMS` array — modification here updates all pages automatically.

## Content Management

Content is managed through YAML data files in `_data/`. Each page corresponds to a data file:

- `_data/about.yml` — About page content
- `_data/skills.yml` — Expertise skills
- `_data/experience.yml` — Work experience, education, patents, teaching
- `_data/publications.yml` — Research publications
- `_data/awards.yml` — Awards and service
- `_data/thoughts.yml` — Medium writings
- `_data/contact.yml` — Contact information

## Local Development

```bash
bundle install
bundle exec jekyll serve --livereload
```

Site available at `http://localhost:4000`

## Building

```bash
bundle exec jekyll build
```

Output goes to `_site/` directory.

## Deploying

```bash
git add -A
git commit -m "description"
git push origin main
```

GitHub Actions handles Jekyll build automatically.

## Contact

- Email: vickyfeliren@gmail.com
- LinkedIn: @feliren
- GitHub: @feliren88
- Medium: @feliren
