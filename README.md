# Portfolio Quest

An original 2D platformer built as a portfolio site for **Faiq Zharfan** — Full-Stack WordPress Developer.

Run, jump and explore four worlds themed around the sections of a classic resume: **About**, **Skills**, **Work**, and **Contact**. Hit blocks to read About Me / Skills content, jump into pipes to open project cards, stomp bugs, collect coins, and reach the flag (or castle) at the end of each world.

All characters, enemies, items and tiles are **original pixel art generated procedurally in code** (see `js/gfx/pixelart.js`) — no third-party game assets or Nintendo IP are used. The genre mechanics (run/jump/stomp/coins/pipes/flagpole) are a generic platformer convention, reinterpreted with an original dev-themed skin (bugs to stomp, coffee-cup power-ups, etc).

## Play

Open `index.html` in a browser (or serve the folder statically — e.g. GitHub Pages). No build step required.

- **Move:** Arrow keys / WASD
- **Jump:** Up / W / Space
- **Enter a pipe:** stand on top, press Down
- Touch controls appear automatically on touch devices.
- Click **"Classic Resume"** (top-right) at any time for a plain, accessible/SEO-friendly version of all the content — no game required.

## Structure

```
index.html            entry point
style.css             overlay UI (panels, HUD chips, touch controls)
js/
  main.js             Phaser game config + touch/DOM wiring
  vendor/phaser.min.js  vendored Phaser 3 build (no CDN dependency)
  data/content.js     portfolio content (about, skills, projects, contact)
  gfx/                procedural pixel-art sprite generation
  entities/           Player, Bug, Coin, ContentBlock, Pipe, Flagpole, PowerUp
  levels/levels.js     level layouts for the 4 worlds
  scenes/              Boot, Title, World (generic runner), WorldClear, GameOver
  ui/Panels.js          HTML overlay panels/modals for content + classic resume
  audio/Sfx.js          tiny WebAudio-based 8-bit sound effects
  state/GameState.js    lives/coins/score persisted across worlds
```

## Updating content

Edit `js/data/content.js` — about text, skills, projects and contact links all live there and flow through to both the in-game panels and the Classic Resume view.
