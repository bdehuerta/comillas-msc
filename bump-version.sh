#!/bin/sh
# GitHub Pages caches assets for ~10 minutes, so edits to style.css or
# motion.js can appear not to have worked. Run this after changing either
# one: it stamps a fresh ?v= on the links so browsers fetch the new copy.
set -e
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M)
sed -i '' -E "s|(href=\"style\.css)(\?v=[0-9]+)?\"|\1?v=$V\"|" index.html
sed -i '' -E "s|(src=\"motion\.js)(\?v=[0-9]+)?\"|\1?v=$V\"|" index.html
echo "Asset version bumped to $V"
