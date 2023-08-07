# Planning Poker
----------
This is an implementation of a simple Planning Poker app that was built with [SkeletonUI](https://www.skeleton.dev/) (Sveltekit & TailwindCSS) and [Supabase](https://supabase.com/) that was inspired by a simple React app created by [mpaulweeks](https://github.com/mpaulweeks/planning-poker).  

This implementation uses Supabase's [Realtime APIs](https://supabase.com/docs/guides/realtime) (essentially websockets) and avoids data persistence and does not require auth. Due to this approach, a few compromises were made with the way state was managed. The room and realtime code could also probably use some cleaning up...and someday tests.  

## TODO
- room passwords
- db support?

## Developing

To run, you will need a `.env` file with the following: 

```text
PUBLIC_SUPABASE_ANON_KEY=""  
PUBLIC_SUPABASE_URL=""
```

Once you've added those and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
