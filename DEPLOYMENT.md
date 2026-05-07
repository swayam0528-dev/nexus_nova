# Deployment Guide

This guide explains how to deploy Nexus Nova (both frontend and backend) to production.

## Architecture

The app consists of:
- **Frontend**: React + Vite SPA
- **Backend**: Express.js server
- **Integration**: Frontend files are served by Express in production

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** (optional, uses defaults):
   ```bash
   cp .env.example .env
   ```

3. **Development**:
   - Run both frontend and backend: `npm run dev:all`
   - Frontend only: `npm run dev`
   - Backend only: `npm run server`

4. **Build**:
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

**Benefits**: Easy setup, free tier, auto-deploys from GitHub

**Steps**:

1. Push your code to GitHub ✓

2. Go to [render.com](https://render.com) and sign up

3. Click **New → Web Service**

4. Connect your GitHub repository (`swayam0528-dev/nexus_nova`)

5. Configure the service:
   - **Name**: `nexus-nova`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server`

6. Add environment variables (optional):
   - `PORT`: (leave blank, Render sets automatically)

7. Click **Create Web Service**

8. Done! Your app will deploy automatically on every push to main

**Frontend URL**: https://your-app.onrender.com
**API URL**: https://your-app.onrender.com/api

---

### Option 2: Railway.app

**Benefits**: Easy, generous free tier, good for full-stack apps

**Steps**:

1. Go to [railway.app](https://railway.app)

2. Click **New Project → Deploy from GitHub repo**

3. Select `swayam0528-dev/nexus_nova`

4. Railway auto-detects Node.js configuration

5. Configure environment:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run server`

6. Deploy!

**Docs**: https://docs.railway.app

---

### Option 3: Heroku (Legacy - Credits Required)

**Note**: Heroku free tier ended Nov 2022. You'll need credits.

**Steps**:

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Login: `heroku login`

3. Create app: `heroku create nexus-nova`

4. Deploy:
   ```bash
   git push heroku main
   ```

5. View logs: `heroku logs --tail`

**Docs**: https://devcenter.heroku.com/articles/getting-started-with-nodejs

---

### Option 4: Separate Deployments (Frontend + Backend)

Deploy frontend and backend to different services.

**Frontend → Vercel**:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Framework: Vite
4. Build Command: `npm run build`
5. Deploy

**Backend → Render/Railway**:
- Set `VITE_API_URL` environment variable to backend URL
- Example: `https://your-backend.onrender.com`

---

## Environment Variables

### Production Deployment

Create environment variables in your deployment platform:

```
PORT=3001          # (Auto-set by Render/Railway)
VITE_API_URL=<your-deployed-backend-url>
```

Example for Render deployment:
- API is served from same domain, so `VITE_API_URL` defaults to current origin

---

## Verifying Deployment

1. **Check API health**:
   ```bash
   curl https://your-app.onrender.com/api/health
   ```

2. **Create test order**:
   ```bash
   curl -X POST https://your-app.onrender.com/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "partName": "Test Part",
       "material": "Steel",
       "quantity": 100,
       "deadline": "2026-06-01"
     }'
   ```

3. **View in browser**: https://your-app.onrender.com

---

## Troubleshooting

### Build Fails: `npm install` exits with 1

- Check `package.json` syntax
- Ensure all dependencies are in npm registry
- Run `npm ci` instead of `npm install`

### Frontend shows 404 for API calls

- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check CORS settings in `server.ts`

### "Cannot find module 'express'"

- Dependencies not installed: run `npm install` locally
- Check `package.json` has all required packages

### Port already in use

- Change `PORT` environment variable
- Kill process: `lsof -ti:3001 | xargs kill -9`

---

## File Structure

```
nexus_nova/
├── src/                    # React frontend source
├── dist/                   # Built frontend (after npm run build)
├── server.ts               # Express backend
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite configuration
├── Procfile                # Deployment configuration
├── .env.example            # Environment variables template
└── DEPLOYMENT.md           # This file
```

---

## Scripts Reference

```bash
npm run dev           # Start Vite dev server (frontend only)
npm run server        # Start Express server (backend only)
npm run dev:all       # Start both frontend and backend
npm run build         # Build frontend (React → dist/)
npm run build:full    # Build both frontend and backend
npm run start         # Start production server (used by Render/Railway)
```

---

## Production Checklist

- [ ] All dependencies in `package.json`
- [ ] No localhost hardcoded (use environment variables)
- [ ] CORS configured correctly in `server.ts`
- [ ] API routes documented
- [ ] Error handling in place
- [ ] Environment variables defined
- [ ] Build succeeds locally: `npm run build`
- [ ] Server starts: `npm run server`
- [ ] Frontend accessible at root path: `/`
- [ ] API accessible at `/api/*`

---

## Next Steps

1. Deploy to Render.com (easiest)
2. Share production URL with team
3. Monitor logs in deployment dashboard
4. Set up continuous deployment on GitHub push

Questions? Check the platform's documentation or create an issue.
