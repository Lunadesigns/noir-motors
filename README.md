# NOIR MOTORS

Luxury car rental site built from the Figma file. Plain HTML + CSS + JS — no build step.

## Run

Double-click `index.html`. That's it.

(For fonts + clean paths you can also serve it: `npx serve .` or `python -m http.server`.)

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, car visual, 3 features |
| `about.html` | About — story, stats, CTA |
| `collections.html` | Collections — filters, 8 cars, booking panel |
| `contact.html` | Contact — details + enquiry form |
| `faq.html` | FAQs — accordion |

Shared header/footer are duplicated in each file on purpose (no JS dependency for content).

## Interactive bits (`js/main.js`)

- sticky header gets a blurred background on scroll
- hamburger menu under 1024px (Log In / Sign Up included)
- **client access dialog** — Log In / Sign Up open a modal (see `assets/refernaces/image.png`)
- scroll reveal: pure opacity fade (no movement), staggered per element, matching the reference recording
- FAQ accordion: smooth height expansion with the answer fading in; `+` becomes `−` on open
- hero car parallax on scroll (desktop only)
- smooth in-page anchor scrolling (`prefers-reduced-motion` respected)
- collection filters (All / Saloon / Grand Tourer / Supercar / SUV)
- FAQ accordion (one open at a time)
- booking panel: date validation + "available" summary
- enquiry form: validation, and it prefills the vehicle when you arrive from a **Reserve** button (`contact.html?vehicle=Ferrari%20Roma`)

### Login / signup

There's no backend, so accounts are client-side: the dialog validates the fields and stores the
session in `localStorage` (`noir.client`). The header then shows `Welcome, <name>` plus **Log Out**.
Swap the `authForm` submit handler for a real API call when one exists.

Deep links work too: `index.html#login` and `index.html#signup` open the dialog directly.

## Type & colour

- Display: **Playfair Display** (matched to the design's metrics)
- UI: **Inter**, labels/logo: **Jost**
- bg `#0a0a0c`, surface `#121110`, gold `#c7ba8c`, cream `#f4eedf`

All tokens are at the top of `css/styles.css`.

Fonts are **self-hosted** (`assets/fonts/*.woff2`, variable files pulled straight from Google Fonts,
declared in `css/fonts.css`). No network needed — the site looks identical offline.

## Assets

`assets/car-*.png`, `hero-aston.png`, `about-interior.png` were **cropped out of the Figma PNGs at 1x**,
because the file had no separate image exports. They're pixel-1:1 with the cards they sit in, so they look
right at this size, but if you can export the original photos from Figma (select the image fill → Export → 2x),
drop them in with the same names and nothing else needs to change.

## Where it differs from the Figma file

Small clean-ups, all deliberate:

- header buttons are `Log In / Sign Up` on every page (Figma had `Log In / Sign In` on About and only
  `RESERVE` on Collections)
- FAQ items got a `+` toggle (Figma shows none, but an accordion needs an affordance)
- 1272px content grid used throughout (Figma mixed 1272 / 1140 / 1100 containers between pages)
- pages are their natural height instead of the fixed frame heights

## Preview renders

`design/preview/` has desktop + mobile screenshots of every page, next to the original frames in `design/`.
