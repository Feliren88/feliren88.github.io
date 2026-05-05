# Vicky Feliren - Personal Website

Personal portfolio website built with semantic HTML, vanilla CSS, and JavaScript. Deployed via GitHub Pages.

## Project Structure

```
feliren88.github.io/
├── README.md              # Project documentation
├── CLAUDE.md             # Development guidelines
├── index.html           # Homepage (landing)
├── css/
│   └── styles.css     # All styles
├── js/
│   ├── main.js       # Core JavaScript (3D point cloud, animations)
│   ├── components/
│   │   └── nav.js   # Shared navigation - SINGLE SOURCE OF TRUTH
│   └── data/       # External data configurations
│       ├── thoughts.js
│       ├── publications.js
│       ├── awards.js
│       ├── experience.js
│       └── skills.js
└── pages/
    ├── about.html      # About Vicky
    ├── skills.html     # Expertise
    ├── experience.html # Work experience
    ├── publications.html # Research
    ├── awards.html    # Recognition
    ├── thoughts.html  # Writings (Medium)
    └── contact.html # Contact
```

## Technology Stack

- **HTML5**: Semantic markup with accessibility
- **CSS3**: Custom properties, Grid/Flexbox, keyframe animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks

## Navigation (Single Source of Truth)

All navigation is defined in `js/components/nav.js`. This ensures consistent naming across all pages.

To change navigation labels or order, edit `js/components/nav.js`:

```javascript
var NAV_ITEMS = [
  { href: 'index.html', label: 'Home', page: '/' },
  { href: 'about.html', label: 'About', page: '/about' },
  { href: 'skills.html', label: 'Expertise', page: '/expertise' },
  { href: 'experience.html', label: 'Work', page: '/work' },
  { href: 'publications.html', label: 'Research', page: '/research' },
  { href: 'awards.html', label: 'Recognition', page: '/recognition' },
  { href: 'thoughts.html', label: 'Writings', page: '/writings' },
  { href: 'contact.html', label: 'Contact', page: '/contact' },
];
```

## Data Configuration

Content is managed through external JavaScript data files in `js/data/`.

### Adding New Content

**Thoughts (Medium)** — `js/data/thoughts.js`:
```javascript
var THOUGHTS_DATA = {
  'article-key': { description: '...', url: 'https://...' }
};
```

**Publications** — `js/data/publications.js`:
```javascript
var PUBLICATIONS_DATA = {
  'key': { tag: '...', title: '...', description: '...', venue: '...', url: '...', abstract: '...' }
};
```

**Awards** — `js/data/awards.js`:
```javascript
var AWARDS_DATA = { 'key': { category: '...', title: '...', year: '...', description: '...', url: '...' } };
var SERVICE_DATA = [{ role: '...', description: '...', urls: [...] }];
```

**Experience** — `js/data/experience.js`:
```javascript
var WORK_EXPERIENCE_DATA = [{ dates: '...', title: '...', location: '...', description: '...' }];
var EDUCATION_DATA = [...];
var PATENTS_DATA = [...];
var TEACHING_DATA = [...];
```

**Skills** — `js/data/skills.js`:
```javascript
var SKILLS_DATA = [{ category: '...', description: '...', skills: ['...'] }];
```

## Development

```bash
python -m http.server 8000
# or
npx serve .
```

Access at `http://localhost:8000`

## Features

- Interactive 3D point cloud background (draggable, multiple shapes)
- Scroll reveal animations
- Shared navigation - consistent across all pages
- Responsive design
- Data-driven content rendering

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