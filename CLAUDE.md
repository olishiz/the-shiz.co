# The Shiz — CLAUDE.md

## Project Overview
Static HTML/CSS/JS website for **The Shiz**, a Malaysian web design & development agency.
Live site: https://the-shiz.co
Repo: https://github.com/olishiz/the-shiz.co

## Tech Stack
- Plain HTML5, CSS3, vanilla JS (no build step)
- Bootstrap 5 (local, `./css/bootstrap.min.css`)
- Bootstrap Icons + Font Awesome (local)
- AOS (Animate on Scroll) — local
- PureCounter — local
- Fonts: Nunito Sans via Google Fonts

## File Structure
```
index.html          # Single-page site — all sections here
css/
  main.css          # Primary custom styles
  bootstrap.min.css
  aos.css
  font-awesome/
  bootstrap-icons/
scripts/
  main.js           # Custom JS (AOS init, scrolltop visibility)
  bootstrap.bundle.min.js
  aos.min.js
  purecounter.min.js
  imagesloaded.pkgd.min.js
  masonry.pkgd.min.js
images/
  logo/             # Client logos
  illustrations/    # SVG illustrations
  testimonials/     # Testimonial profile photos
  the-shiz-cropped-removebg-preview.png  # Main logo
```

## Sections (in order)
1. **Header / Nav** — fixed navbar, collapses on mobile
2. **Hero** — tagline, Free Quote CTA
3. **About** — two subsections: "Malaysian brands" + "Long Term Partnership" tabs
4. **Services** — Web Design, Web App, E-Commerce, SEO
5. **Our Clients** — 4 client cards (RS Property, MQBC, Frankitas, Carbnb)
6. **Stats** — PureCounter animated numbers
7. **Testimonials** — client quotes
8. **Contact** — Formspree form + WhatsApp CTA
9. **Footer** — 4-column layout with sitemap, services, contact + JSON-LD SEO

## Key Details
- WhatsApp number: `+60168694900`
- WhatsApp link: `https://api.whatsapp.com/send/?phone=%2B60168694900&text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20web%20design%20services.&type=phone_number&app_absent=0`
- Contact email: hello@the-shiz.co
- Formspree endpoint: `https://formspree.io/f/xdobblql`
- Google Analytics: `G-Y96LVQYJJ6`

## Conventions
- All sections use class `.section` which provides `scroll-margin-top: 5rem` to clear the fixed navbar
- Mobile navbar auto-closes on link tap, then smooth-scrolls to target (script at bottom of index.html)
- Copyright year is dynamic via JS `new Date().getFullYear()`
- Floating WhatsApp button: fixed bottom-right (`#whatsapp-float`)
- Scroll-to-top button: fixed bottom-left (`#scrolltop`)
- Client logos fetched via `https://logo.clearbit.com/<domain>` for external clients (e.g. carbnb.my)

## Clients
| Client | URL | Logo file |
|---|---|---|
| RS Property Services | https://rspropservices.com | images/logo/rs-logo-modified.jpg |
| MQBC | https://mqbc.com.my | images/logo/my-qt-flag-modified.jpg |
| Frankitas | https://www.frankitas.co | images/logo/frankitas.png |
| Carbnb | https://www.carbnb.my | clearbit API |

## SEO
- JSON-LD structured data (`schema.org/ProfessionalService`) in footer
- Meta tags in `<head>` — update description/keywords if needed
- Footer bottom bar includes keyword anchor: "Web Design & Development in Malaysia"
