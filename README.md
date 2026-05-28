# Veil of Ash

Static browser RPG prototype for GitHub Pages.

## Files

- `index.html` - game UI markup.
- `styles.css` - bright parchment fantasy UI, responsive layout, SVG styling, animations.
- `app.js` - screen manager, campaign state, hero selection, D&D-style map, tavern/lore encounters, combat, localStorage.

## Deploy

Copy the files from `github-pages-ready` into a GitHub Pages repository root and enable Pages for the branch.

No backend, package manager, build step, or external image dependency is required.

## Current Game Loop

`MAIN_MENU -> CHARACTER_SELECT -> WORLD_MAP -> ENCOUNTER -> WORLD_MAP -> VICTORY/GAME_OVER`

Combat nodes now open a lightweight turn-based battle screen with d20 attacks, class skills, potions, enemy turns, animated damage, and reward claiming after victory.

The map now favors D&D-style travel: taverns, lore scenes, social NPC events, campfires, shops, and fewer forced fights. Tavern and lore nodes are one-time encounters with d20 checks, rumors, companions, and journal discoveries.
