CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT,
  service_type VARCHAR(16) NOT NULL CHECK (service_type IN ('Hotspot','PPPoE')),
  mikrotik_profile VARCHAR(100),
  package_name VARCHAR(120) NOT NULL,
  total_gb NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_gb >= 0),
  used_gb NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (used_gb >= 0),
  price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  expires_at DATE,
  status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','expired')),
  router_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS renewal_requests (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(80) NOT NULL,
  payment_reference VARCHAR(120),
  status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_renewals_status ON renewal_requests(status, created_at DESC);
