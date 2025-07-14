# Suessco Cloudflare Worker Deployment

This project deploys your static website to Cloudflare Workers with the URL structure `/suessco/...`.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Login to Cloudflare (if not already logged in):
```bash
npx wrangler login
```

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Development

Test locally:
```bash
npm run dev
```

## URLs

After deployment, your site will be available at:
- `https://your-worker.your-subdomain.workers.dev/suessco/` - Main page
- `https://your-worker.your-subdomain.workers.dev/suessco/show-project-name-and-id/` - Project page
- `https://your-worker.your-subdomain.workers.dev/suessco/show-project-name-and-id/main.css` - CSS file

## Files Structure

- `src/index.js` - Main Worker script that serves static files
- `wrangler.toml` - Cloudflare Worker configuration
- `package.json` - Project dependencies and scripts
- `public/` - Original static files (for reference)