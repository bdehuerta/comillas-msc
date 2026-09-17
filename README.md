# Comillas Marketing & Strategy Club — website

Plain static site. No build step, no dependencies, no framework.
Two files do all the work: `index.html` (content) and `style.css` (design).

## Edit it

Open `index.html` in any text editor and change the words. Search for
`PLACEHOLDER` — every spot that still needs real information is marked
with it.

What needs filling in:

- Stats row (member count, sessions, partners, degrees)
- Event dates and the meeting time/room
- Team names and one-line bios
- Contact email, Instagram URL, LinkedIn URL

## Preview locally

    cd ~/comillas-msc
    python3 -m http.server 8000

Then open <http://localhost:8000>.

## Publish a change

    git add -A && git commit -m "Update events" && git push

GitHub Pages redeploys in about a minute.

## Hosting

- Repo: GitHub, `broundonb/comillas-msc`
- Host: GitHub Pages, deployed from the `main` branch
- Custom domain: set in Settings → Pages, and recorded in the `CNAME` file
