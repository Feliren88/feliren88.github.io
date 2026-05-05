# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist specializing in Multimodal AI, Vision-Language Models, and Remote Sensing. Built with semantic HTML, vanilla CSS, and JavaScript.

## Architecture

```
feliren88.github.io/
├── README.md           # Project documentation (start here)
├── CLAUDE.md          # This file
├── index.html         # Homepage (landing with 3D point cloud)
├── css/
│   └── styles.css   # All styles
├── js/
│   ├── main.js      # Core JavaScript
│   └── data/       # External data configurations
│       ├── thoughts.js
│       ├── publications.js
│       ├── awards.js
│       ├── experience.js
│       └── skills.js
└── pages/
    ├── experience.html
    ├── skills.html
    ├── publications.html
    ├── awards.html
    ├── thoughts.html
    └── contact.html
```

## Data-First Architecture

All content is managed through external JavaScript files in `js/data/`. Pages load these data files and render content dynamically using inline JavaScript.

This separation makes it easy to add new content without modifying HTML files.

## Data Files

### thoughts.js
```javascript
var THOUGHTS_DATA = {
  'key': { description: '...', url: '...' }
};
```

### publications.js
```javascript
var PUBLICATIONS_DATA = {
  'key': { tag: '...', title: '...', description: '...', venue: '...', url: '...', abstract: '...' }
};
```

### awards.js
```javascript
var AWARDS_DATA = { 'key': { category: '...', title: '...', year: '...', description: '...', url: '...' } };
var SERVICE_DATA = [{ role: '...', description: '...', urls: [...] }];
```

### experience.js
```javascript
var WORK_EXPERIENCE_DATA = [{ dates: '...', title: '...', location: '...', description: '...' }];
var EDUCATION_DATA = [...];
var PATENTS_DATA = [...];
var TEACHING_DATA = [...];
```

### skills.js
```javascript
var SKILLS_DATA = [{ category: '...', description: '...', skills: ['...'] }];
```

## Code Conventions

### HTML
- Semantic HTML5 elements only
- ARIA labels for accessibility
- Data containers use `id` attributes (e.g., `id="publications-grid"`)

### CSS
- CSS custom properties for theming (`:root`)
- Mobile-first responsive design
- Grid for layouts, Flexbox for components
- `clamp()` for fluid typography
- Respect `prefers-reduced-motion`

### JavaScript
- ES6+ syntax (const/let, arrow functions)
- IIFE wrapper for DOM rendering
- Feature detection before API usage
- JSDoc comments in data files

## Updating Content

Adding new items follows the same pattern across all data files:

1. Open the appropriate file in `js/data/`
2. Add new entry following the format
3. Save file - content renders automatically

## Common Tasks

### Adding a new Medium article
Edit `js/data/thoughts.js` — add to THOUGHTS_DATA object.

### Adding a new publication
Edit `js/data/publications.js` — add to PUBLICATIONS_DATA object.

### Adding a new award
Edit `js/data/awards.js` — add to AWARDS_DATA object.

### Adding work experience
Edit `js/data/experience.js` — add to WORK_EXPERIENCE_DATA array.

### Adding a skill category
Edit `js/data/skills.js` — add to SKILLS_DATA array.

### Updating styles
1. Edit `css/styles.css`
2. Bump `?v=` query param in HTML files

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