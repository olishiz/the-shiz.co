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
media/hero.mp4, hero.webm # Full-bleed dark 3D architectural/AI hero loop (1080p, no audio)
media/hero-poster.webp # Hero poster frame (also the reduced-motion fallback)
images/og-image.png # 1200x630 social preview rendered from the wordmark
images/logo.png # Transparent wordmark PNG (JSON-LD logo)
images/clients/*.webp # Client homepage previews
images/testimonials/*.{webp,png} # Client testimonial profile photos
favicon.ico, favicon.svg # "=>" mark; the SVG flips to off-white in dark mode
```

## Brand
- Wordmark = inline SVG "=>" mark (`.brand-mark`) + "The Shiz" in League Spartan 700 (`.brand-name`), used in nav and footer.
- `images/the-shiz-cropped-removebg-preview.png` and other globe logos are retired (unused).
- To regenerate `og-image.png`/`logo.png`, render the same markup in headless Chrome with the self-hosted font.

## Design tokens
Palette matched to cursor.com/home, defined once in `:root` in `css/main.css`:
`--bg #F7F7F4`, `--surface #E6E5E0`, `--text #26251F`, `--muted #6B6B66`, `--muted-soft #84847F`, `--border #CDCDC9`, `--panel #F2F1ED`, `--panel-well #EBEAE5`, `--card #FFFFFF`.
- No separate accent: links/buttons use `--text`; hover is an underline, `--surface`, or a slight opacity change.
- `--muted-soft` (3.5:1) is for large/decorative text only; keep small `--muted` text off `--surface` (4.25:1).
- `--border` is decorative (1.5:1); form controls use `--muted` for their outline.
- Client cards use `--panel #F2F1ED` (muted text 4.7:1) with a `--panel-well #EBEAE5` image backdrop (no small muted text on the well); elevated cards inside `--panel` containers use `--card #FFFFFF` (muted text 5.4:1).
- Buttons are pills: `.button` (dark primary), `.button-secondary` (grey `--surface`), `.button-outline` (thin border, used in the nav).
- Dividers are 1px `--border`, including the rule below the hero title.

## Sections (in order; section labels are unnumbered)
1. **Header** — sticky, logo + nav + "WhatsApp" (green icon) + "Free quote"; hamburger menu below 48rem. The open menu plays a tiny football match under WhatsApp: two penguins, two goals, a new random kickoff each time it opens.
2. **Hero** — full-viewport cosmic canvas (`#hero-cosmos`): star field, flares and a 3D cluster. Sticky cream header sits above it. Centered copy ("Your success is our mission.") with a short lead, a green WhatsApp button ("Message me!") and a ghost "How we help" link. The canvas pauses off-screen, in a hidden tab, and draws one static frame under `prefers-reduced-motion`.
3. **About** — 2-column layout: "We build websites for Malaysian brands" + 4-item checklist on the left, and a `--panel` showcase card on the right with an animated 3D isometric ascending staircase + summit flag
4. **Services** — 5 columns on desktop (`≥72rem`), 3 on tablet (`≥56rem`), 2 on small tablet (`≥40rem`), 1 on mobile, each with a hand-built inline SVG line illustration, serif heading and bullet list: Web Design & Development, AI Automation, Product & Design, Engineering & Cloud, Applied AI
5. **Approach** — left-aligned `.section-head` above an isometric 6-node loop and stage pills. Hovering (fine pointer) or tapping a stage updates the in-flow `#stage-detail` note. There is no modal.
6. **Clients** — preview cards for MQBC, Frankitas and Carbnb (`images/clients/*.webp`) linking to case studies in `works/`. RS Property Services stays a text card (their site does not resolve). No stats row.
7. **Testimonials** — three client quote cards with opening `“` quote mark, quote text, and right-aligned author name/org + rounded profile photo (`images/testimonials/*.webp` + `.png` fallback)
8. **Contact** — a four-step inquiry flow (what you need, budget, how to reply, message) posted to Formspree, with Oliver’s phone, WhatsApp and email beside it
9. **Footer** — brand, sitemap, services, contact, bottom bar (copyright on left + animated cute penguin dribbling a football left-and-right on right) + JSON-LD

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
- Scroll-to-top button: fixed bottom-left (`#scrolltop`, visible when scrolled past 240px)
- Floating WhatsApp button: fixed bottom-right (`#whatsapp-float`, WhatsApp green `#25d366`); WhatsApp icons and the hero "Message me!" button use `#25d366`.
- Case studies: `works/mqbc.html`, `works/frankitas.html`, `works/carbnb.html`, listed at `works/index.html`. Copy stays factual: no invented timelines, metrics, or quotes. Carbnb has no testimonial on this site.
- Never invent clients, numbers, testimonials or services; mark gaps with `TODO(content)` comments

## Clients
| Client | URL | Preview |
|---|---|---|
| MQBC | https://mqbc.com.my | images/clients/mqbc.webp |
| Frankitas | https://www.frankitas.co | images/clients/frankitas.webp |
| Carbnb | https://www.carbnb.my | images/clients/carbnb.webp |
| RS Property Services | rspropservices.com (NXDOMAIN — unlinked placeholder card) | none |

Previews are 1280x800 captures of each live homepage, resized to 800x500 WebP. Re-capture when a client's site changes. Case-study quotes are only the ones already in the testimonials section.

## SEO
- Meta description/keywords, canonical, Open Graph + Twitter card tags in `<head>`
- JSON-LD structured data (`schema.org/ProfessionalService`) in footer
