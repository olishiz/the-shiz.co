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
Palette matched to cursor.com/home, defined once in `:root` in `css/main.css`:
`--bg #F7F7F4`, `--surface #E6E5E0`, `--text #26251F`, `--muted #6B6B66`, `--muted-soft #84847F`, `--border #CDCDC9`.
- No separate accent: links/buttons use `--text`; hover is an underline, `--surface`, or a slight opacity change.
- `--muted-soft` (3.5:1) is for large/decorative text only; keep small `--muted` text off `--surface` (4.25:1).
- `--border` is decorative (1.5:1); form controls use `--muted` for their outline.
- Client cards use `--panel #F2F1ED` (muted text 4.7:1) with a `--panel-well #EBEAE5` image backdrop (no small muted text on the well).
- Buttons are pills: `.button` (dark primary), `.button-secondary` (grey `--surface`), `.button-outline` (thin border, used in the nav).
- Dividers are 1px `--border`, including the rules around the hero title.

## Sections (in order)
1. **Header** — sticky, logo + nav + "Free quote"; hamburger menu below 48rem
2. **Hero** — serif eyebrow, uppercase display title between 2px rules, lead, CTAs
3. **01 About** — "We build websites for Malaysian brands" + 4-item checklist
4. **02 Services** — Web Design, Web Applications, E-Commerce, SEO
5. **03 Approach** — Commitment, Transparency, Professionalism
6. **04 Clients** — card grid (4 cols ≥72rem, 2 cols ≥40rem, 1 col mobile); each card has a framed browser preview of the client's homepage (`images/clients/*.webp`, 800x500), stats below the grid
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
| Client | URL | Preview |
|---|---|---|
| MQBC | https://mqbc.com.my | images/clients/mqbc.webp |
| Frankitas | https://www.frankitas.co | images/clients/frankitas.webp |
| Carbnb | https://www.carbnb.my | images/clients/carbnb.webp |
| RS Property Services | rspropservices.com (NXDOMAIN — unlinked placeholder card) | none |

Previews are 1280x800 captures of each live homepage, resized to 800x500 WebP. Re-capture when a client's site changes. Card descriptions come from existing testimonials only.

## SEO
- Meta description/keywords, canonical, Open Graph + Twitter card tags in `<head>`
- JSON-LD structured data (`schema.org/ProfessionalService`) in footer
- Footer bottom bar includes keyword anchor: "Web Design & Development in Malaysia"
