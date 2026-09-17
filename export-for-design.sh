#!/bin/sh
# Bundles the live site into a zip you can upload to Claude Design.
# Includes a brief so the tool knows what already exists and what to keep.
set -e
cd "$(dirname "$0")"

OUT="$HOME/Downloads/comillas-msc-site.zip"
TMP=$(mktemp -d)
DEST="$TMP/comillas-msc-site"
mkdir -p "$DEST"

# ship only what git tracks, so scratch files never leak into the bundle
git ls-files -z | xargs -0 -I{} sh -c 'mkdir -p "$1/$(dirname "{}")" && cp "{}" "$1/{}"' _ "$DEST"

cat > "$DEST/BRIEF.md" <<'BRIEF'
# Comillas Marketing & Strategy Club — current site

Live: https://bdehuerta.github.io/comillas-msc/

## What this is
A static site. No build step, no framework, no dependencies. Three files do
the work: `index.html`, `style.css`, `motion.js`. Please keep it that way —
whatever you hand back has to stay editable by a student with a text editor.

## Language
All user-facing copy is Castilian Spanish (`lang="es-ES"`). Accents are
written as HTML entities. Keep both conventions.

## Structure
1. Announcement bar — welcome-event sign-ups
2. Sticky translucent nav
3. Hero — amber field, etched ICADE facade, already redesigned, DO NOT CHANGE
4. `#pillars` — four numbered editorial columns split by hairline rules
5. `#program` — Market Analysts, two bullet lists
6. `#events` — vertical timeline, five entries
7. `#join` — dark closing band with grain
8. Footer

## Design tokens
Burgundy `#2E0709` / `#45100F` / `#7A1A22` · gold `#F0A824` · cream `#FDF8F1`
Amber hero field `#F0B23A` → `#E8A427` → `#DE9519`

Fonts: Playfair Display (display), DM Sans (UI/body), Cormorant Garamond
(large numerals only — the 01–04 device).

## Constraints that must survive
- `prefers-reduced-motion` disables every animation. Keep it.
- Contrast: burgundy on the amber is 6.09:1. White on amber is 2.03:1 and
  fails, which is why buttons are filled burgundy rather than white.
- The hero `.hero-scrim` layer is what keeps body copy readable over the
  etched bars. Do not remove it.
- `.obj` elements are decorative parallax props, `aria-hidden`, driven by one
  rAF-throttled scroll listener in `motion.js`.
- Headings use one italic-serif emphasis phrase each. That is the signature
  device; keep it.

## Copy voice
Direct, concrete, peer-to-peer. Short sentences, varied length. Explicitly
avoid: "X, no solo Y" constructions, tricolons, empty superlatives, and
uppercase category labels as headings. The club's audience is 19–22 and
reacts badly to copy that reads as generated.

## What still needs real content
Search for `PLACEHOLDER`: the sign-up form URL, five event dates, the meeting
weekday/time/room, and the contact email.

## What to work on
The hero is done. Focus on sections 4–8.
BRIEF

(cd "$TMP" && zip -qr "$OUT" comillas-msc-site)
rm -rf "$TMP"
echo "Listo: $OUT"
du -h "$OUT" | cut -f1
