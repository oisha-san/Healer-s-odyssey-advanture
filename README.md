# Healer's Odyssey — Resonance of Corruption

A USMLE Step 1/2 RPG study game with 16 worlds and 540+ clinical questions.

## GitHub Pages Setup

1. Push this repo to GitHub
2. Settings → Pages → Deploy from branch: `main` / `root`
3. Game live at `https://yourusername.github.io/healers-odyssey/`

## File Structure

```
index.html          ← HTML shell (edit for layout changes)
css/style.css       ← All styles (edit for visual changes)
js/story.js         ← Dr. Lau lore, VN dialogue scenes
js/worlds.js        ← 16 worlds × questions (edit to add/fix questions)
js/engine.js        ← Game logic, saves, cloud sync
```

## Cloud Save Sync (JSONBin.io)

1. Sign up free at jsonbin.io
2. Copy your Master API Key
3. In-game: header ☁ icon → paste key → SAVE & PUSH
4. On another device: same key + Bin ID → PULL FROM CLOUD

## Adding New Questions

Edit `js/worlds.js` — find the world and mission, add to `questions:[]` array.
Each question: `{q:"question text", o:["A","B","C","D"], a:"correct option", exp:"explanation"}`
