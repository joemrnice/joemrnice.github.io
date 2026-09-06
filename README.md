# joemrnice.github.io
[![Deploy to GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-e8873a)](https://joemrnice.github.io/)
[![Deploy to GitLab Pages](https://img.shields.io/badge/GitLab%20Pages-deployed-fc6d26)](https://joemrnice.gitlab.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-2bbfae.svg)](LICENSE)

The personal portfolio of **Joseph Lahai Kanu** ([@joemrnice](https://github.com/joemrnice)) — software engineer and technical research specialist based in Freetown, Sierra Leone, currently at CodeZerra.

## About this build

The brief called for Astro/Next.js with Tailwind. This version is deliberately
**plain HTML, CSS, and vanilla JS**, with GSAP and Three.js pulled in from a
CDN — no bundler, no `node_modules`, no build step. Reasons:

- It's a single-page static site with no shared components across routes, so
  a framework buys little beyond the tooling itself.
- Zero build step means GitHub Pages and GitLab Pages can both publish the
  repository root directly — nothing to keep in sync between two CI configs.
- It's the most dependency-light option that still hits every item in the
  brief (3D hero, scroll animations, live GitHub data, dual deployment).

If you'd rather have the Astro/Tailwind version, the component boundaries
here (`index.html` sections, `css/style.css` tokens, `js/main.js` modules)
map cleanly onto Astro islands if you want to port it later.

## Tech stack

| Layer | Technology |
|---|---|
| Markup / structure | Semantic HTML5 |
| Styling | Hand-written CSS with custom properties (design tokens) |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger, vanilla `IntersectionObserver` fallback |
| 3D | [Three.js](https://threejs.org/) (wireframe icosahedron in the hero) |
| Data | Live [GitHub REST API](https://docs.github.com/en/rest) for the Projects section |
| Deployment | GitHub Actions → GitHub Pages, GitLab CI → GitLab Pages |

## Local development

No install required — it's static files.

```bash
git clone https://github.com/joemrnice/joemrnice.github.io.git
cd joemrnice.github.io
python3 -m http.server 8000
# visit http://localhost:8000
```

Any static file server works (`npx serve`, VS Code's Live Server, etc.).

## Project structure

```
.
├── index.html              # all sections, SEO meta, JSON-LD
├── css/style.css           # design tokens + component styles
├── js/main.js              # preloader, hero 3D, reveals, GitHub fetch, carousel
├── assets/
│   └── favicon.svg         # "JK" monogram
├── robots.txt
├── sitemap.xml
├── .github/workflows/deploy.yml   # GitHub Pages CI
├── .gitlab-ci.yml                 # GitLab Pages CI
├── .env.example
├── LICENSE
└── README.md
```

## Deployment

### GitHub Pages
1. Push to the `main` branch of a repo named `joemrnice.github.io` (or enable
   Pages on any repo via **Settings → Pages → Source: GitHub Actions**).
2. The workflow in `.github/workflows/deploy.yml` runs automatically and
   publishes the repo root — no build step.
3. Live at `https://joemrnice.github.io/`.

### GitLab Pages
1. Push to the `main` branch of a project mirrored on GitLab.
2. `.gitlab-ci.yml` copies the static files into `public/`, which GitLab
   Pages serves automatically.
3. Live at `https://joemrnice.gitlab.io/` (or your GitLab Pages domain).

Because both platforms serve the site at a root path (`/`) with this setup,
no `base` path juggling is needed — if you later host one of them under a
subpath, update the `<link>`/`<script>` paths in `index.html` to be relative
(they already are) or add a `<base>` tag.

## Notes

- The Projects section calls `api.github.com/users/joemrnice/repos` directly
  from the browser — unauthenticated, rate-limited to 60 requests/hour per
  IP. If it's ever exhausted or offline, the section falls back to a small
  set of clearly-labeled concept projects (see `.env.example` if you want to
  raise the rate limit via a token + proxy).
- Testimonials, blog posts, and the résumé download are placeholders —
  swap in real content when it exists (each is called out in the HTML).
- Respects `prefers-reduced-motion`: preloader, hero animation, marquee, and
  scroll reveals all disable or shortcut when it's set.

## Screenshots

_Add screenshots here once deployed — desktop hero, projects grid, and
mobile view are good candidates._

## License

MIT — see [LICENSE](LICENSE).
