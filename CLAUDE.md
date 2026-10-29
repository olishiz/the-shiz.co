# The Shiz — CLAUDE.md

## Project Overview
Static HTML/CSS/JS website for **The Shiz**, a Malaysian web design & development agency.
Live site: https://the-shiz.co
Repo: https://github.com/olishiz/the-shiz.co

## Tech Stack
- Plain HTML5, CSS3, vanilla JS (no build step, no frameworks)
- Self-hosted fonts in `fonts/` (all SIL OFL): Inter (main sans), League Spartan (hero display, uppercase), Literata (serif for small detail/contact lines). Mono accents use the system mono stack.
- Bootstrap, AOS, Font Awesome, PureCounter etc. remain in `css/` and `scripts/` but are no longer loaded by `index.html`.

## File Structure
```
index.html # Single-page site — all sections here
css/main.css # All styles; design tokens in :root at the top
scripts/main.js # Mobile menu, sticky-header border, reveal-on-scroll, active nav link, copyright year
fonts/ # Self-hosted woff2 + OFL licences
images/og-image.png # 1200x630 social preview
images/the-shiz-cropped-removebg-preview.png # Main logo
```

## Design tokens
Palette sampled from Oliver's name card, defined once in `:root` in `css/main.css`:
`--bg #EAE4CD`, `--surface #F2EDDB`, `--text #1A1612`, `--muted #6B6355`, `--border #CFC7AE`, `--accent #64483A`.
`--border` is decorative only (1.3:1); form controls use `--muted` for their outline. The hero uses 2px `--text` rules as a signature divider (echoing the card).

## Sections (in order)
1. **Header** — sticky, logo + nav + "Free quote"; hamburger menu below 48rem
2. **Hero** — serif eyebrow, uppercase display title between 2px rules, lead, CTAs
3. **01 About** — "We build websites for Malaysian brands" + 4-item checklist
4. **02 Services** — Web Design, Web Applications, E-Commerce, SEO
5. **03 Approach** — Commitment, Transparency, Professionalism
6. **04 Clients** — client list (RS Property, MQBC, Frankitas, Carbnb) + stats
7. **05 Testimonials** — three client quotes (text only)
8. **06 Contact** — contact details + Formspree form
9. **Footer** — brand, sitemap, services, contact, bottom bar + JSON-LD

## Key Details
- Contact person: Oliver Sim, software engineer
- Phone / WhatsApp: `+60 16 869 4900` (`+60168694900`)
- WhatsApp link: `https://api.whatsapp.com/send/?phone=%2B60168694900&text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20web%20design%20services.&type=phone_number&app_absent=0`
- Contact email: hello@the-shiz.co
- Formspree endpoint: `https://formspree.io/f/xdobblql`
- Google Analytics: `G-Y96LVQYJJ6`; Vercel Web Analytics script also loaded

## Conventions
- Sticky header; `html { scroll-padding-top }` clears it for anchor links
- `.reveal` elements fade in on scroll only when JS runs and `prefers-reduced-motion` is not set
- Copyright year is set by `scripts/main.js`
- Floating WhatsApp button: fixed bottom-right (`#whatsapp-float`)
- Never invent clients, numbers, testimonials or services; mark gaps with `TODO(content)` comments

## Clients
| Client | URL |
|---|---|
| RS Property Services | https://rspropservices.com |
| MQBC | https://mqbc.com.my |
| Frankitas | https://www.frankitas.co |
| Carbnb | https://www.carbnb.my |

## SEO
- Meta description/keywords, canonical, Open Graph + Twitter card tags in `<head>`
- JSON-LD structured data (`schema.org/ProfessionalService`) in footer
- Footer bottom bar includes keyword anchor: "Web Design & Development in Malaysia"
