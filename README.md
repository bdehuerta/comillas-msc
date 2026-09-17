# Comillas Marketing & Strategy Club — website

Plain static site. No build step, no dependencies, no framework.
Three files do the work: `index.html`, `style.css`, `motion.js`.

Live: <https://bdehuerta.github.io/comillas-msc/>

## Design

Structure and typography follow the Comillas PE&VC Club site as a reference:
light-dominant layout, one dark CTA band, editorial columns split by hairline
rules rather than boxed cards, and an italic-serif emphasis phrase in every
heading.

Fonts: Playfair Display (headings), Plus Jakarta Sans (body),
Cormorant Garamond (large numerals).

## Colours

The whole palette is eight variables at the top of `style.css`, sampled from
the club crest. Change them and everything follows:

    --brand-deepest  #3d0607   darkest burgundy, dark CTA band
    --brand-deep     #6c0c0c   crest burgundy, buttons
    --brand          #8a1418   italic emphasis
    --gold           #f0a824   crest gold, rules and highlights
    --gold-deep      #b8790c   gold that stays legible on white

Dark mode is derived from the same tokens and follows the OS setting.

## What still needs filling in

Search for `PLACEHOLDER`:

- `PLACEHOLDER_FORM_URL` — the sign-up form, used by three CTAs
- Stat numbers — the four `<span class="num" data-fill="number">` em-dashes
- `PLACEHOLDER BRAND` — partner names in the marquee, plus the note under it
- Event dates, meeting weekday/time/room
- Board names and one-line bios
- `PLACEHOLDER@example.com` in the footer

Instagram and LinkedIn are already linked in the hero, the join band and the
footer.

## Motion

`motion.js` handles scroll reveals (IntersectionObserver, 90ms sibling
stagger), the hero entrance on load, and the stat count-up. It only animates
numeric stats, so the em-dash placeholders are left alone. Everything is
disabled under `prefers-reduced-motion`.

## Logo files

The crest is stored as transparent PNGs, cut from the original JPEG by
masking everything outside the circle:

    logo.png      512px, used for the hero watermark and og:image
    icon-96.png    96px, the nav and footer mark
    icon-180.png  180px, apple-touch-icon
    icon-32.png    32px, favicon

## Image credits

The photographic props are CC0 (public domain, commercial use permitted),
downloaded from PurePNG and downscaled and quantised locally:

    objects/racquet-photo.png     purepng.com/photo/29138  (2.0MB -> 24KB)
    objects/sunglasses-photo.png  purepng.com/photo/29740  (568KB -> 20KB)

The remaining props and the ICADE facade are drawn as SVG in this repo, so
they carry no licensing obligations at all.

## Preview locally

    cd ~/comillas-msc
    python3 -m http.server 8000

Then open <http://localhost:8000>.

## Publish a change

    git add -A && git commit -m "Update events" && git push

GitHub Pages redeploys in about a minute.

If you changed `style.css` or `motion.js`, run `./bump-version.sh` first and
commit that too. GitHub Pages caches those files for about ten minutes, so
without it your change can look like it did not work when it actually did.

## Hosting

- Repo: `bdehuerta/comillas-msc`
- Host: GitHub Pages, deployed from `main`
- Custom domain: not yet set. Buy it, add a `CNAME` file containing the bare
  domain, and set it in Settings → Pages.
