# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist specializing in Multimodal AI, Vision-Language Models, and Remote Sensing. Built with semantic HTML, vanilla CSS, and JavaScript.

## Architecture

```
feliren88.github.io/
├── README.md       # Project documentation
├── CLAUDE.md      # This file
├── index.html    # Homepage
├── css/
│   └── styles.css
├── js/
│   ├── main.js       # Core JavaScript
│   ├── components/
│   │   └── nav.js   # Shared navigation
│   └── data/       # Content data
└── pages/
    ├── about.html, skills.html, experience.html
    ├── publications.html, awards.html
    ├── thoughts.html, contact.html
```

## Shared Navigation

All navigation is defined in `js/components/nav.js`. This is the **single source of truth** - modification here updates all pages automatically.

## Code Conventions

### HTML
- Semantic HTML5 elements only
- ARIA labels for accessibility

### CSS
- CSS custom properties (`:root`)
- Mobile-first responsive design
- Grid for layouts, Flexbox for components

### JavaScript
- ES6+ syntax
- IIFE wrapper for DOM rendering

## Common Tasks

### Change Navigation
Edit `js/components/nav.js` - change `NAV_ITEMS` array.

### Add New Content
Edit the appropriate file in `js/data/`.

### Update Styles
Edit `css/styles.css` and bump version in HTML files.

## Deploying

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