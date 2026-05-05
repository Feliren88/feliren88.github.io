# Vicky Feliren - Personal Website

Personal portfolio website built with semantic HTML, vanilla CSS, and JavaScript. Deployed via GitHub Pages.

## Project Structure

```
feliren88.github.io/
├── README.md              # Project documentation
├── CLAUDE.md             # Development guidelines
├── index.html           # Homepage (landing)
├── css/
│   └── styles.css       # All styles
├── js/
│   ├── main.js         # Core JavaScript (animations, interactions)
│   └── data/
│       ├── thoughts.js     # Medium blog articles config
│       ├── publications.js  # Publications config
│       ├── awards.js     # Awards & service config
│       ├── experience.js # Work, education, patents, teaching config
│       └── skills.js     # Skills config
└── pages/
    ├── experience.html  # Work experience & education
    ├── skills.html  # Technical skills
    ├── publications.html # Research publications
    ├── awards.html # Awards & honours
    ├── thoughts.html # Medium blog articles
    └── contact.html # Contact information
```

## Technology Stack

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Custom properties (CSS variables), Grid/Flexbox layouts, keyframe animations
- **JavaScript (ES6+)**: No frameworks, vanilla JS only

## Data Configuration

All content is managed through external JavaScript data files in `js/data/`. This separates content from presentation, making updates easier.

### Adding New Content

Each data file follows a specific format with JSDoc comments:

**Thoughts (Medium articles)** — `js/data/thoughts.js`:
```javascript
var THOUGHTS_DATA = {
  'article-key': {
    description: 'Custom description',
    url: 'https://medium.com/@feliren/article-slug'
  }
};
```

**Publications** — `js/data/publications.js`:
```javascript
var PUBLICATIONS_DATA = {
  'key': {
    tag: 'TAG',
    title: 'Title',
    description: 'Short description',
    venue: 'Venue, Year',
    url: 'https://...',
    abstract: 'Full abstract'
  }
};
```

**Awards** — `js/data/awards.js`:
```javascript
var AWARDS_DATA = {
  'key': {
    category: 'CATEGORY',
    title: 'Award Title',
    year: 'YEAR',
    description: 'Description',
    url: 'https://...' // optional
  }
};

var SERVICE_DATA = [
  { role: 'Role', description: 'Description', urls: [...] }
];
```

**Experience** — `js/data/experience.js`:
```javascript
var WORK_EXPERIENCE_DATA = [
  { dates: 'DATE', title: 'Role — Company', location: 'Location', description: '...' }
];

var EDUCATION_DATA = [...];
var PATENTS_DATA = [...];
var TEACHING_DATA = [...];
```

**Skills** — `js/data/skills.js`:
```javascript
var SKILLS_DATA = [
  { category: 'Category', description: '...', skills: ['Skill 1', 'Skill 2', ...] }
];
```

## Development

### Local Development

```bash
# Python
python -m http.server 8000

# or npx
npx serve .
```

Access at `http://localhost:8000`

## Features

- Interactive 3D point cloud background (draggable, multiple shapes)
- Scroll reveal animations
- 3D tilt effect on cards (mouse tracking)
- Responsive design (mobile, tablet, desktop)
- Filterable publications
- External data config for easy content updates

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