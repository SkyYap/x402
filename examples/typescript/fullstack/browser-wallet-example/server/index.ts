import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { paymentMiddleware, Network, Resource } from "x402-hono";
import { v4 as uuidv4 } from "uuid";

config();

// Configuration from environment variables
const facilitatorUrl = process.env.FACILITATOR_URL as Resource || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS as `0x${string}`;
const network = (process.env.NETWORK as Network) || "base-sepolia";
const port = parseInt(process.env.PORT || "3001");

if (!payTo) {
  console.error("❌ Please set your wallet ADDRESS in the .env file");
  process.exit(1);
}

const app = new Hono();

// Enable CORS for frontend
app.use("/*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
  credentials: true,
}));

// Product catalog interface
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  type: "session" | "onetime";
  duration?: number; // in minutes, for session type
}

interface ProductCatalog {
  products: Product[];
}

// Simple in-memory storage for sessions and product catalog
interface Session {
  id: string;
  productId: string;
  createdAt: Date;
  expiresAt: Date;
  type: "session" | "onetime";
  used?: boolean;
}

const sessions = new Map<string, Session>();
let currentProductCatalog: ProductCatalog = { products: [] };

// Free endpoint - health check
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    message: "Server is running",
    config: {
      network,
      payTo,
      facilitator: facilitatorUrl,
    },
  });
});

// Free endpoint - set product catalog
app.post("/api/product-catalog", async (c) => {
  try {
    const body = await c.req.json();
    const { products } = body as ProductCatalog;
    
    if (!Array.isArray(products)) {
      return c.json({ error: "Invalid product catalog format" }, 400);
    }

    // Validate products
    for (const product of products) {
      if (!product.id || !product.name || !product.price || !product.type) {
        return c.json({ error: "Invalid product format" }, 400);
      }
      
      if (product.type === "session" && !product.duration) {
        return c.json({ error: "Session products must have duration" }, 400);
      }
    }

    currentProductCatalog = { products };
    
    return c.json({
      success: true,
      message: "Product catalog updated",
      catalog: currentProductCatalog,
    });
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }
});

// Free endpoint - get current product catalog
app.get("/api/product-catalog", (c) => {
  return c.json({
    catalog: currentProductCatalog,
  });
});

// Free endpoint - validate session
app.get("/api/session/:sessionId", (c) => {
  const sessionId = c.req.param("sessionId");
  const session = sessions.get(sessionId);

  if (!session) {
    return c.json({ valid: false, error: "Session not found" }, 404);
  }

  const now = new Date();
  const isExpired = now > session.expiresAt;
  const isUsed = session.type === "onetime" && session.used;

  if (isExpired || isUsed) {
    return c.json({ 
      valid: false, 
      error: isExpired ? "Session expired" : "One-time access already used",
      session: {
        id: session.id,
        productId: session.productId,
        type: session.type,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        used: session.used,
      }
    });
  }

  // Mark one-time sessions as used
  if (session.type === "onetime") {
    session.used = true;
    sessions.set(sessionId, session);
  }

  return c.json({
    valid: true,
    session: {
      id: session.id,
      productId: session.productId,
      type: session.type,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      remainingTime: session.expiresAt.getTime() - now.getTime(),
    },
  });
});

// Free endpoint - list active sessions (for demo purposes)
app.get("/api/sessions", (c) => {
  const activeSessions = Array.from(sessions.values())
    .filter(session => {
      const isExpired = new Date() > session.expiresAt;
      const isUsed = session.type === "onetime" && session.used;
      return !isExpired && !isUsed;
    })
    .map(session => ({
      id: session.id,
      productId: session.productId,
      type: session.type,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    }));

  return c.json({ sessions: activeSessions });
});

// Dynamic payment endpoint - handles any product from catalog
app.post("/api/pay/:productId", async (c) => {
  const productId = c.req.param("productId");
  const product = currentProductCatalog.products.find(p => p.id === productId);

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  const sessionId = uuidv4();
  const now = new Date();
  
  let expiresAt: Date;
  if (product.type === "session") {
    expiresAt = new Date(now.getTime() + (product.duration || 60) * 60 * 1000); // Convert minutes to milliseconds
  } else {
    expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes for one-time
  }

  const session: Session = {
    id: sessionId,
    productId: product.id,
    createdAt: now,
    expiresAt,
    type: product.type,
    used: product.type === "onetime" ? false : undefined,
  };

  sessions.set(sessionId, session);

  return c.json({
    success: true,
    sessionId,
    message: `${product.name} access granted!`,
    session: {
      id: sessionId,
      productId: product.id,
      productName: product.name,
      type: product.type,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      validFor: product.type === "session" 
        ? `${product.duration} minutes` 
        : "5 minutes (single use)",
    },
  });
});

// Configure x402 payment middleware dynamically based on product catalog
function updatePaymentMiddleware() {
  const paymentRoutes: Record<string, { price: string; network: Network }> = {};
  
  currentProductCatalog.products.forEach(product => {
    paymentRoutes[`/api/pay/${product.id}`] = {
      price: product.price,
      network,
    };
  });

  return paymentMiddleware(
    payTo,
    paymentRoutes,
    {
      url: facilitatorUrl,
    },
  );
}

// Apply initial payment middleware
app.use(updatePaymentMiddleware());

console.log(`
🚀 x402 Payment Template Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Accepting payments to: ${payTo}
🔗 Network: ${network}
🌐 Port: ${port}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Configurable Product Catalog
   - Set products via POST /api/product-catalog
   - Pay for products via POST /api/pay/:productId
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️  This is a template! Customize it for your app.
📚 Learn more: https://x402.org
💬 Get help: https://discord.gg/invite/cdp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

serve({
  fetch: app.fetch,
  port,
}); 