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

## Real photos (optional)

Photos replace parts of the illustration:

- **Husband's photo** appears in the channi after the moon.
- **Memory photos** appear one per memory, high in the night sky above the words, edges fading into the stars.
- **Couple photo** appears in the sky above the letter.

Any photo left out keeps the illustrated scene.

- **`clients.ts` clients:** put photos in `public/clients/<key>/` and list them under `photos` (see the comment in `src/config/clients.ts`).
- **`/create` links:** photos are uploaded to a **private** Vercel Blob store and served through `/api/photo`. Set it up once:
  1. In Vercel, go to your project → **Storage** → **Create** → **Blob** (private), and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
  2. Recommended: add an environment variable `CREATE_PASSCODE`, so only you can upload. Enter it in the passcode field on `/create`.
  3. Redeploy.
  4. For local development, put the same `BLOB_READ_WRITE_TOKEN` in `.env.local` (it is git-ignored) and restart `npm run dev`.

## Editing the story

All text lives in `src/config/story.ts`: the dialogues, blessing, memories, default letter and Karwa Chauth date.
Only the wife keeps the vrat; keep the copy true to that.

## Preview helpers

- `?scene=channi` starts at a scene after "Begin". Scenes: `intro`, `sky`, `terrace`, `couple`, `channi`, `dialogue`, `blessing`, `aarti`, `memory`, `message`, `final`.
- `?auto=1` skips the start screen. Music stays off, because browsers need a tap before playing audio.

## Deploy

Import the GitHub repo into [Vercel](https://vercel.com/new). No environment variables are needed.
