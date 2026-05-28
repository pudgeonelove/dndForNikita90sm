# Veil of Ash

Static browser RPG prototype for GitHub Pages.

## Files

- `index.html` - game UI markup.
- `styles.css` - dark-fantasy visual system, responsive layout, SVG styling, animations.
- `app.js` - screen manager, campaign state, hero selection, procedural map, encounter navigation, localStorage.

## Deploy

Copy the files from `github-pages-ready` into a GitHub Pages repository root and enable Pages for the branch.

No backend, package manager, build step, or external image dependency is required.

## Current Game Loop

`MAIN_MENU -> CHARACTER_SELECT -> WORLD_MAP -> ENCOUNTER -> WORLD_MAP -> VICTORY/GAME_OVER`

Combat is intentionally still a navigation placeholder; the next step is to plug the turn-based combat module into `ENCOUNTER`.
