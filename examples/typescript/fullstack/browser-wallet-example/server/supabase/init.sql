-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_catalog table
CREATE TABLE IF NOT EXISTS product_catalog (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('session', 'onetime')),
    duration INTEGER, -- in minutes, for session type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('session', 'onetime')),
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES product_catalog(product_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_product_catalog_product_id ON product_catalog(product_id);
CREATE INDEX IF NOT EXISTS idx_product_catalog_type ON product_catalog(type);
CREATE INDEX IF NOT EXISTS idx_sessions_id ON sessions(id);
CREATE INDEX IF NOT EXISTS idx_sessions_product_id ON sessions(product_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_used ON sessions(used);

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for email_subscriptions
-- Allow all operations for authenticated users (you can restrict this later)
CREATE POLICY "Allow all operations on email_subscriptions" ON email_subscriptions
    FOR ALL USING (true);

-- Create policies for product_catalog
-- Allow all operations for authenticated users (you can restrict this later)
CREATE POLICY "Allow all operations on product_catalog" ON product_catalog
    FOR ALL USING (true);

-- Create policies for sessions
-- Allow all operations for authenticated users (you can restrict this later)
CREATE POLICY "Allow all operations on sessions" ON sessions
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for product_catalog updated_at
CREATE TRIGGER update_product_catalog_updated_at 
    BEFORE UPDATE ON product_catalog 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO product_catalog (product_id, name, price, description, type, duration) VALUES
    ('premium-session', 'Premium 24-Hour Access', '$5.00', 'Full access for 24 hours', 'session', 1440),
    ('quick-access', 'Quick Access', '$0.50', 'One-time access', 'onetime', NULL)
ON CONFLICT (product_id) DO NOTHING;
