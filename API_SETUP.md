# API Setup Guide

## Overview

The Nexus Nova project includes both a frontend (React/Vite) and a backend API (Express.js). This guide will help you get everything running.

## Installation

```bash
# Install all dependencies
npm install
# or
pnpm install
# or
yarn install
```

## Running the Project

### Option 1: Run Both Frontend & Backend Together
```bash
npm run dev:all
```

This command runs both simultaneously:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Option 2: Run Frontend Only
```bash
npm run dev
```

Frontend will be at: http://localhost:5173

### Option 3: Run Backend Only
```bash
npm run server
```

Backend API will be at: http://localhost:3001

## API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-07T08:15:00Z"
}
```

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "partName": "Gear Wheels",
  "material": "Steel",
  "quantity": 50,
  "deadline": "2026-06-15"
}
```

Response (201):
```json
{
  "id": "ORD-0001",
  "partName": "Gear Wheels",
  "material": "Steel",
  "quantity": 50,
  "deadline": "2026-06-15",
  "status": "Received",
  "createdAt": "2026-05-07T08:15:00Z",
  "updatedAt": "2026-05-07T08:15:00Z",
  "createdBy": "system",
  "qualityNotes": []
}
```

### Get All Orders
```
GET /api/orders
```

Response:
```json
[
  { order object },
  { order object }
]
```

### Get Single Order
```
GET /api/orders/:id
Example: GET /api/orders/ORD-0001
```

### Update Order Status
```
PATCH /api/orders/:id
Content-Type: application/json

{
  "status": "In Review"
}
```

Valid statuses: `Received`, `In Review`, `Accepted`

### Add Quality Note
```
POST /api/orders/:id/notes
Content-Type: application/json

{
  "note": "All parts passed inspection"
}
```

### Delete Order
```
DELETE /api/orders/:id
Example: DELETE /api/orders/ORD-0001
```

## Authentication

All API requests include Google API authentication headers:
- `Authorization: Bearer {API_KEY}`
- `X-API-Key: {API_KEY}`

The API key is embedded in `src/app/utils/apiClient.ts`:
```typescript
const API_KEY = 'AIzaSyBVQMeIxOdWuJ8QvzfcM1c2orR_C-QMsUw';
```

## Database

Currently using in-memory storage for demo purposes. To use a real database:

1. Replace the `Map` in `server.ts` with your database connection
2. Update CRUD operations to use your DB client (MongoDB, PostgreSQL, etc.)
3. Consider adding validation and authentication middleware

## Development

### Frontend Technology Stack
- React 18.3.1
- Vite 6.3.5
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Motion animations
- Shadcn UI components

### Backend Technology Stack
- Express.js 4.18.2
- Node.js
- TypeScript (via tsx)
- CORS support

## Troubleshooting

### Port Already in Use
If you get "Port 3001 already in use":
```bash
# Kill process on port 3001
# macOS/Linux:
lsof -ti:3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### CORS Issues
If you see CORS errors, ensure:
1. Backend is running on http://localhost:3001
2. Frontend is running on http://localhost:5173
3. CORS is enabled in `server.ts`

### API Not Responding
1. Check if backend is running: `curl http://localhost:3001/api/health`
2. Check console logs for errors
3. Ensure all dependencies are installed: `npm install`

## Production Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, or similar
```

### Backend Deployment
Deploy `server.ts` to:
- Heroku
- Railway
- DigitalOcean
- AWS (Lambda/EC2)
- Google Cloud Run

Update `NEXT_PUBLIC_API_URL` environment variable with production API URL.

## Support

For issues or questions, check:
- GitHub Issues: https://github.com/swayam0528-dev/nexus_nova/issues
- API logs in terminal when running `npm run dev:all`
- Browser DevTools Network tab for API request details
