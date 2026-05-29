# Veil of Ash

Static browser RPG prototype for GitHub Pages.

## Files

- `index.html` - game UI markup.
- `styles.css` - bright parchment fantasy UI, responsive layout, SVG styling, animations.
- `app.js` - screen manager, campaign state, hero selection, D&D-style map, tavern/lore encounters, combat, localStorage.
- `assets/` - local intro video, music, voiceover, and class/tavern/story images.

## Deploy

Copy the files from `github-pages-ready` into a GitHub Pages repository root and enable Pages for the branch.

No backend, package manager, build step, or external image dependency is required.

## Current Game Loop

`INTRO -> MAIN_MENU -> CHARACTER_SELECT -> STAT_ALLOC -> WORLD_MAP -> ENCOUNTER -> WORLD_MAP -> VICTORY/GAME_OVER`

Combat nodes now open a lightweight turn-based battle screen with d20 attacks, class skills, potions, enemy turns, animated damage, and reward claiming after victory.

The map now favors a longer D&D-style journey: taverns, lore scenes, social NPC events, campfires, shops, elites, and a stronger dragon-lich boss. Tavern and lore nodes are one-time encounters with d20 checks, rumors, XP, and journal discoveries.

The game starts with a click-to-play cinematic gate so browsers allow narration and music. After the player presses Play, the book video, voiceover, music, and story image sequence run before the main menu. Character selection uses supplied class art, followed by a 10-point skill allocation screen. The campaign includes XP, levels, inventory, random item drops, subclass stat modifiers, a lore journal, and first-person combat with no hero sprite on the battlefield.
