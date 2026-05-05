# Vicky Feliren - Personal Website

Personal portfolio website built with semantic HTML, vanilla CSS, and JavaScript. Deployed via GitHub Pages.

## Project Structure

```
feliren88.github.io/
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── pages/
    ├── index.html      # Home / Landing
    ├── experience.html
    ├── skills.html
    ├── publications.html
    ├── awards.html
    └── contact.html
```

## Technology Stack

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom properties (CSS variables), Grid/Flexbox layouts, keyframe animations
- **JavaScript (ES6+)**: Intersection Observer API, Canvas 2D for 3D point cloud background

## Development

### Local Development

Serve the site locally:

```bash
# Python
python -m http.server 8000

# or npx
npx serve .
```

Access at `http://localhost:8000`

### Build & Deploy

Changes are automatically deployed to GitHub Pages on push to `main` branch.

## Features

- Interactive 3D point cloud background (draggable, multiple shapes)
- Scroll reveal animations
- 3D tilt effect on cards (mouse tracking)
- Responsive design (mobile, tablet, desktop)
- Filterable publications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigable
- Respects `prefers-reduced-motion`