# karwachauth

A cinematic Karwa Chauth love-story website: a short animated film a husband sends to his wife as a personal link. It runs on Next.js, Tailwind CSS and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## Making a link for a client

**Fastest (no redeploy):** open `/create` on the deployed site, enter both names (plus an optional letter and dates), then copy the link or send it on WhatsApp.

**Custom link with a personal WhatsApp preview:** add an entry to `src/config/clients.ts`. The key becomes the URL (`priya` → `/priya`). Redeploy after adding it.

Names-only links also work: `/?w=Aarohi&h=Rohan`.

## Editing the story

All text lives in `src/config/story.ts`: the dialogues, blessing, memories, default letter and Karwa Chauth date.
Only the wife keeps the vrat; keep the copy true to that.

## Preview helpers

- `?scene=channi` starts at a scene after "Begin". Scenes: `intro`, `sky`, `terrace`, `couple`, `channi`, `dialogue`, `blessing`, `aarti`, `memory`, `message`, `final`.
- `?auto=1` skips the start screen. Music stays off, because browsers need a tap before playing audio.

## Deploy

Import the GitHub repo into [Vercel](https://vercel.com/new). No environment variables are needed.
