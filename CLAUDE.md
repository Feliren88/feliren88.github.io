# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist specializing in Multimodal AI, Vision-Language Models, and Remote Sensing. Built with semantic HTML, vanilla CSS, and JavaScript.

## Architecture

### Directory Structure

```
feliren88.github.io/
├── README.md           # Project documentation
├── CLAUDE.md          # This file
├── css/
│   └── styles.css    # All styles (no splitting)
└── js/
    └── main.js       # All scripts (no splitting)
└── pages/
    ├── index.html        # Home (landing with 3D point cloud)
    ├── experience.html  # Work experience & education
    ├── skills.html     # Technical skills
    ├── publications.html # Research publications
    ├── awards.html    # Awards & honours
    └── contact.html   # Contact information
```

## Code Conventions

### HTML
- Semantic HTML5 elements only
- ARIA labels for accessibility
- Preconnect to Google Fonts
- Versioned assets (`?v=2`)

### CSS
- CSS custom properties for theming (`:root`)
- Mobile-first responsive design
- Grid for layouts, Flexbox for components
- `clamp()` for fluid typography
- Respect `prefers-reduced-motion`

### JavaScript
- ES6+ syntax (const/let, arrow functions)
- Intersection Observer for scroll animations
- RequestAnimationFrame for canvas animations
- Pointer events for mouse tracking
- Feature detection before API usage

## Common Tasks

### Adding a new page
1. Create `pages/pagename.html`
2. Copy header/footer from existing page
3. Update nav with `is-active` class
4. Add content section

### Updating styles
1. Edit `css/styles.css`
2. Bump `?v=` query param in all HTML files

### Deploying
```bash
git add -A
git commit -m "description"
git push origin main
```

## Contact

- Email: vickyfeliren@gmail.com
- LinkedIn: @feliren
- GitHub: @feliren88
- Medium: @feliren