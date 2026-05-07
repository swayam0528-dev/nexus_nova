import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for demo (replace with real DB)
interface QualityNote {
  id: string;
  note: string;
  timestamp: string;
  addedBy: string;
}

interface Order {
  id: string;
  partName: string;
  material: string;
  quantity: number;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  qualityNotes: QualityNote[];
}

const orders: Map<string, Order> = new Map();

// Generate order ID
function generateOrderId(): string {
  return `ORD-${String(orders.size + 1).padStart(4, '0')}`;
}

// Routes

/**
 * POST /api/orders - Create a new order
 */
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { partName, material, quantity, deadline } = req.body;

    if (!partName || !material || !quantity || !deadline) {
      return res.status(400).json({
        error: 'Missing required fields: partName, material, quantity, deadline',
      });
    }

    const newOrder: Order = {
      id: generateOrderId(),
      partName,
      material,
      quantity,
      deadline,
      status: 'Received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.headers['x-user-email'] || 'system',
      qualityNotes: [],
    };

    orders.set(newOrder.id, newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/orders - Get all orders
 */
app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const allOrders = Array.from(orders.values());
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/orders/:id - Get order by ID
 */
app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = orders.get(id);

    if (!order) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/orders/:id - Update order status
 */
app.patch('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = orders.get(id);
    if (!order) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    orders.set(id, order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/orders/:id/notes - Add quality note
 */
app.post('/api/orders/:id/notes', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const order = orders.get(id);
    if (!order) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    if (!note) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const newNote: QualityNote = {
      id: `qn-${Date.now()}`,
      note,
      timestamp: new Date().toISOString(),
      addedBy: req.headers['x-user-email'] || 'system',
    };

    order.qualityNotes.push(newNote);
    order.updatedAt = new Date().toISOString();
    orders.set(id, order);

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/orders/:id - Delete order
 */
app.delete('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!orders.has(id)) {
      return res.status(404).json({ error: `Order ${id} not found` });
    }

    orders.delete(id);
    res.json({ message: `Order ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static frontend files (built React app)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/orders - Create order`);
  console.log(`   GET    /api/orders - Get all orders`);
  console.log(`   GET    /api/orders/:id - Get order by ID`);
  console.log(`   PATCH  /api/orders/:id - Update order status`);
  console.log(`   POST   /api/orders/:id/notes - Add quality note`);
  console.log(`   DELETE /api/orders/:id - Delete order`);
  console.log(`   GET    /api/health - Health check`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});