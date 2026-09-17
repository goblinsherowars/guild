# Goblins Guild Portal

Static bilingual RU/EN portal for the **Goblins** guild in Hero Wars: Alliance.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## GitHub Pages

https://goblinherowars.github.io/guild/

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select your default branch and `/ (root)`.
5. Save. The site uses only relative URLs and requires no build step.

Player data lives in `data/players.js`; translations live in `js/i18n.js`.

Titan portraits live in `assets/titans`: 28 square PNG files named after the English titan name (for example, `Angus.png`, `Sigurd.png`, `Tydus.png`). Level numbers have been removed. These are AI-edited versions of the supplied screenshots, so artwork details can differ from the originals. `Tenebris.png` retains the locked, dark appearance from its source screenshot. See [titan icon processing notes](assets/titans/README.md).

The hero catalog (`heroes.html`) uses all 80 portraits in `assets/heroes`. Names, RU/EN summaries, classes, and source links live in `data/heroes.js`. Image paths preserve the original filename spelling and case; display names use the Hero Wars: Alliance mobile names. The catalog supports bilingual name search and class filtering, and follows the site's RU/EN switch. Source descriptions were checked on 2026-09-09; review the linked guides when updating them. No build step or runtime external API is required.

Dungeon instructions live in separate HTML files: `content/dungeon/ru.html` (Russian) and `content/dungeon/en.html` (English). The Dungeon page loads the file for the selected language. Edit these files to update the guide; no build step is required.

Player hero compositions can use a `heroTeam` array of catalog IDs in `data/players.js`, ordered left to right. All 30 players now have confirmed five-hero compositions from the supplied screenshots, with updated hero and titan power. These render localized hero portraits on the Players and Home pages. Hero composition counts are independent of titan image availability. Hero-team screenshots are no longer used; players without a known composition display the localized empty state.

Player titan compositions use `titanTeam` arrays in `data/players.js`, ordered left to right from the supplied screenshots for all 30 players. `data/titans.js` maps the used titan IDs to English-named PNG files and RU/EN display names. Players and Home render individual titan portraits through `js/titan-team.js`; team screenshots are no longer used. Stars in the reusable portraits are decorative and do not represent each player’s titan rank.

The Titans page (`titans.html`) lists all 28 supplied portraits, grouped into Fire, Water, Earth, Light, Darkness, and Elarite. RU/EN names, short skill summaries, element IDs, and official Alliance source links live in `data/titans.js`. The catalog follows the site language switch and uses `js/titans-page.js`. Summaries and grouping were checked against the official Titan Skills guide on 2026-09-09.

The Teams page (`teams.html`) contains Global Championship defense and attack rankings and recommended guild lineups. The championship lists contain 10 attack and 10 defense teams supplied by the guild, in the supplied ranking order. Only the two guild lineups remain temporary examples. Edit the `defense`, `attack`, and `guild` arrays in `data/teams.js` to replace them with the full list; each lineup contains five IDs from `data/heroes.js`, in display order. Portraits use the shared hero-team component, and headings and hero names follow the RU/EN switch.
