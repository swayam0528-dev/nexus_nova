# Nexus Nova - Order Management System

A full-stack order management system with NLP chat assistant, built with React, Express, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run both frontend & backend
npm run dev:all

# Or run individually
npm run dev      # Frontend only (port 5173)
npm run server   # Backend only (port 3001)
```

Visit: http://localhost:5173

## 📋 Features

- 💬 **NLP Chat Assistant** - Create orders, update status, add quality notes with natural language
- 📊 **Order Management** - Full CRUD operations for orders
- 🎯 **Real-time Updates** - Instant order status changes
- 🔐 **Secure API** - Google API authentication on all requests
- 📱 **Responsive UI** - Beautiful dark theme with animations
- ⚡ **TypeScript** - Full type safety throughout

## 📦 Tech Stack

### Frontend
- React 18.3.1
- Vite 6.3.5
- TypeScript
- Tailwind CSS
- Motion animations
- Lucide React icons
- Shadcn UI components

### Backend
- Express.js 4.18.2
- Node.js + TypeScript
- CORS enabled
- In-memory database (upgradeable)

## 🏗️ Project Structure

```
nexus_nova/
├── src/
│   └── app/
│       ├── components/
│       │   ├── NLPChat.tsx          # Chat assistant component
│       │   └── ...
│       └── utils/
│           ├── apiClient.ts         # API client with authentication
│           ├── nlpParser.ts         # NLP input parser
│           └── storage.ts           # Local storage utilities
├── server.ts                        # Express backend
├── package.json                     # Dependencies & scripts
└── API_SETUP.md                     # API documentation
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get single order |
| PATCH | `/api/orders/:id` | Update order status |
| POST | `/api/orders/:id/notes` | Add quality note |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/health` | Health check |

See [API_SETUP.md](./API_SETUP.md) for detailed documentation.

## 🤖 Chat Commands

Try saying:
- "Create an order for 50 Bolts made of Steel, deadline 2026-06-15"
- "Update ORD-0001 to Accepted"
- "Add quality note to ORD-0001: All parts passed inspection"
- "Show me all orders"

## 🔐 Authentication

API key (Google API): `AIzaSyBVQMeIxOdWuJ8QvzfcM1c2orR_C-QMsUw`

All requests include:
- `Authorization: Bearer {API_KEY}`
- `X-API-Key: {API_KEY}`

## 🛠️ Development

### Add a New Order Operation

1. Update `src/app/utils/apiClient.ts` with new method
2. Update `server.ts` with new endpoint
3. Add handler in `src/app/components/NLPChat.tsx`
4. Update NLP parser if needed

### Available Scripts

```bash
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run dev:all      # Run both simultaneously
npm run build        # Build for production
```

## 📚 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, etc.
```

### Backend
Deploy `server.ts` to Heroku, Railway, AWS, Google Cloud, etc.

Update `NEXT_PUBLIC_API_URL` for production API endpoint.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT - See LICENSE file for details

## 🔗 Links

- [GitHub Repository](https://github.com/swayam0528-dev/nexus_nova)
- [Live Demo](https://nexus-nova-alpha.vercel.app)
- [API Documentation](./API_SETUP.md)

---

Built with ❤️ by SCcraft21
