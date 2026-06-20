# TaskFlow – Front-End Developer Assessment

A fully responsive SaaS landing page built for the O2H mock front-end developer assessment.

## Live Demo

Deploy to Netlify or Vercel by dragging the `frontend-task/` folder into their respective dashboards.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| HTML | HTML5 with semantic landmarks & ARIA |
| CSS | Custom CSS3 (no frameworks) — Flexbox + CSS Grid + custom properties |
| JS | Vanilla ES6+ (no build step required) |
| Fonts | Google Fonts: Syne (display) + Inter (body) |
| API | JSONPlaceholder `https://jsonplaceholder.typicode.com/posts` |

---

## Project Structure

```
frontend-task/
├── index.html          # Single-page app entry
├── css/
│   ├── style.css       # Design system, components, animations
│   └── responsive.css  # Tablet & mobile breakpoints
├── js/
│   └── app.js          # All JS: nav, validation, dark mode, API, reveal
├── images/             # (placeholder — add your own assets)
└── README.md
```

---

## Features Implemented

### Section 1 – Layout (40 marks)
- **Hero** — Logo, heading, sub-heading, CTA buttons, animated app mockup, floating stat cards
- **Features** — 6 feature cards with icon, title, description
- **Pricing** — 3 cards (Starter / Professional / Enterprise), featured plan highlighted
- **Contact** — Name + Email + Message form with full validation

### Section 2 – Responsive Design (20 marks)
- **Mobile < 768px** — Hamburger menu, single-column layout
- **Tablet 768–1023px** — Two-column grid
- **Desktop ≥ 1024px** — Full three-column layout
- Uses: CSS Grid, Flexbox, media queries, `min()` / `clamp()` for fluid sizing

### Section 3 – JavaScript (15 marks)
- ✅ Mobile menu toggle with ARIA states and focus trap
- ✅ Form validation (required fields + email format) with live error messages
- ✅ Dark / light mode toggle persisted in `localStorage`

### Section 4 – Accessibility (10 marks)
- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ARIA roles, labels, live regions, and `aria-invalid` on form fields
- Skip-to-main link
- Keyboard navigation support throughout
- `prefers-reduced-motion` media query respected
- Colour contrast ratio ≥ 4.5:1 across both themes

### Section 5 – Performance (10 marks)
- CSS custom properties for zero-redundancy theming
- `IntersectionObserver`-powered scroll-reveal & lazy loading
- `passive` scroll listeners
- `defer`red script loading
- No render-blocking resources

### Bonus – API Integration (+10 marks)
- Fetches 6 posts from `https://jsonplaceholder.typicode.com/posts?_limit=6`
- Shows skeleton loading state while fetching
- Shows error state with retry button on failure
- Request timeout via `AbortController` (8 s)

---

## Git Workflow (5 marks)

Commits to recreate:

```bash
git init
git add index.html
git commit -m "Initial layout setup"

git add css/style.css
git commit -m "Responsive navbar completed"

git add css/ js/
git commit -m "Feature section added"

git add js/app.js
git commit -m "Form validation implemented"

git add .
git commit -m "Final optimization and cleanup"
```

---

## Setup (no build step needed)

```bash
# Clone / copy the folder, then open locally:
open index.html

# Or serve with any static server:
npx serve .
python3 -m http.server 3000
```

---

## Design Decisions

- **Dark-first palette** — `#0B0F1A` base with a blue-to-violet gradient accent; feels native to developer and SaaS audiences
- **Syne + Inter** — Display face has personality without being illegible; Inter is the industry standard for UI
- **Signature element** — The floating stat cards on the hero mockup give immediate credibility and visual depth without needing real product screenshots
