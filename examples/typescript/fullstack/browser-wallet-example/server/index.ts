import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { paymentMiddleware, Network, Resource } from "x402-hono";
import { v4 as uuidv4 } from "uuid";
import { createClient } from '@supabase/supabase-js';

config();

// Configuration from environment variables
const facilitatorUrl = process.env.FACILITATOR_URL as Resource || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS as `0x${string}`;
const network = (process.env.NETWORK as Network) || "base-sepolia";
const port = parseInt(process.env.PORT || "3001");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!payTo) {
  console.error("❌ Please set your wallet ADDRESS in the .env file");
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the .env file");
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

// Email subscription interface
interface EmailSubscription {
  email: string;
}

// Session interface for Supabase
interface Session {
  id: string;
  product_id: string;
  created_at: string;
  expires_at: string;
  type: "session" | "onetime";
  used?: boolean;
}

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

// Free endpoint - email waitlist subscription
app.post("/api/waitlist", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body as EmailSubscription;
    
    if (!email || typeof email !== 'string') {
      return c.json({ error: "Valid email is required" }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('email_subscriptions')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return c.json({ 
        success: false, 
        message: "Email already subscribed to waitlist" 
      }, 409);
    }

    // Insert email into database
    const { data, error } = await supabase
      .from('email_subscriptions')
      .insert([
        { 
          email,
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return c.json({ error: "Failed to subscribe email" }, 500);
    }

    return c.json({
      success: true,
      message: "Successfully subscribed to waitlist!",
      email: data.email,
      subscribed_at: data.subscribed_at
    });

  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Free endpoint - set product catalog (now using Supabase)
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

    // Clear existing products and insert new ones
    const { error: deleteError } = await supabase
      .from('product_catalog')
      .delete()
      .neq('id', 0); // Delete all records

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return c.json({ error: "Failed to update product catalog" }, 500);
    }

    // Insert new products
    const productsToInsert = products.map(product => ({
      product_id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      type: product.type,
      duration: product.duration,
      created_at: new Date().toISOString()
    }));

    const { data, error: insertError } = await supabase
      .from('product_catalog')
      .insert(productsToInsert)
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return c.json({ error: "Failed to update product catalog" }, 500);
    }
    
    return c.json({
      success: true,
      message: "Product catalog updated",
      catalog: { products: data }
    });
  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Free endpoint - get current product catalog (now using Supabase)
app.get("/api/product-catalog", async (c) => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return c.json({ error: "Failed to fetch product catalog" }, 500);
    }

    const products = data.map(item => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      description: item.description,
      type: item.type,
      duration: item.duration
    }));

    return c.json({
      catalog: { products }
    });
  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Free endpoint - validate session (now using Supabase)
app.get("/api/session/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return c.json({ valid: false, error: "Session not found" }, 404);
    }

    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    const isExpired = now > expiresAt;
    const isUsed = session.type === "onetime" && session.used;

    if (isExpired || isUsed) {
      return c.json({ 
        valid: false, 
        error: isExpired ? "Session expired" : "One-time access already used",
        session: {
          id: session.id,
          product_id: session.product_id,
          type: session.type,
          created_at: session.created_at,
          expires_at: session.expires_at,
          used: session.used,
        }
      });
    }

    // Mark one-time sessions as used
    if (session.type === "onetime") {
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ used: true })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
      }
    }

    return c.json({
      valid: true,
      session: {
        id: session.id,
        product_id: session.product_id,
        type: session.type,
        created_at: session.created_at,
        expires_at: session.expires_at,
        remainingTime: expiresAt.getTime() - now.getTime(),
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Free endpoint - list active sessions (now using Supabase)
app.get("/api/sessions", async (c) => {
  try {
    const now = new Date().toISOString();
    
    const { data: activeSessions, error } = await supabase
      .from('sessions')
      .select('*')
      .gt('expires_at', now) // Get sessions that haven't expired
      .or('used.is.null,used.eq.false') // Get sessions that haven't been used
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return c.json({ error: "Failed to fetch sessions" }, 500);
    }

    // Filter out expired and used sessions (additional safety check)
    const validSessions = activeSessions.filter(session => {
      const isExpired = new Date() > new Date(session.expires_at);
      const isUsed = session.type === "onetime" && session.used;
      return !isExpired && !isUsed;
    });

    return c.json({ 
      sessions: validSessions.map(session => ({
        id: session.id,
        product_id: session.product_id,
        type: session.type,
        created_at: session.created_at,
        expires_at: session.expires_at,
      }))
    });
  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Dynamic payment endpoint - handles any product from catalog
app.post("/api/pay/:productId", async (c) => {
  try {
    const productId = c.req.param("productId");
    
    // Get product from Supabase
    const { data: productData, error } = await supabase
      .from('product_catalog')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error || !productData) {
      return c.json({ error: "Product not found" }, 404);
    }

    const product = {
      id: productData.product_id,
      name: productData.name,
      price: productData.price,
      description: productData.description,
      type: productData.type,
      duration: productData.duration
    };

    const sessionId = uuidv4();
    const now = new Date();
    
    let expiresAt: Date;
    if (product.type === "session") {
      expiresAt = new Date(now.getTime() + (product.duration || 60) * 60 * 1000); // Convert minutes to milliseconds
    } else {
      expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes for one-time
    }

    // Create session in Supabase
    const sessionData = {
      id: sessionId,
      product_id: product.id,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      type: product.type,
      used: product.type === "onetime" ? false : null,
    };

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single();

    if (sessionError) {
      console.error('Supabase session creation error:', sessionError);
      return c.json({ error: "Failed to create session" }, 500);
    }

    return c.json({
      success: true,
      sessionId,
      message: `${product.name} access granted!`,
      session: {
        id: sessionId,
        product_id: product.id,
        productName: product.name,
        type: product.type,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        validFor: product.type === "session" 
          ? `${product.duration} minutes` 
          : "5 minutes (single use)",
      },
    });
  } catch (error) {
    console.error('Server error:', error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Configure x402 payment middleware dynamically based on product catalog
async function updatePaymentMiddleware() {
  const { data: products } = await supabase
    .from('product_catalog')
    .select('product_id, price');

  const paymentRoutes: Record<string, { price: string; network: Network }> = {};
  
  products?.forEach(product => {
    paymentRoutes[`/api/pay/${product.product_id}`] = {
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
app.use(await updatePaymentMiddleware());

console.log(`
🚀 x402 Payment Template Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Accepting payments to: ${payTo}
🔗 Network: ${network}
🌐 Port: ${port}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Configurable Product Catalog & Email Waitlist
   - Set products via POST /api/product-catalog
   - Subscribe emails via POST /api/waitlist
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