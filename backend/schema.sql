CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('admin', 'user', 'donor', 'recipient')) DEFAULT 'user',
    blood_type VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_inventory (
    id SERIAL PRIMARY KEY,
    blood_type VARCHAR(5) UNIQUE NOT NULL,
    units_available INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS donation_requests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    blood_type VARCHAR(5) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'declined', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER REFERENCES users(id),
  blood_type VARCHAR(5) NOT NULL,
  units INTEGER NOT NULL,
  donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial blood inventory if empty
INSERT INTO blood_inventory (blood_type, units_available)
SELECT * FROM (VALUES 
    ('A+', 0), ('A-', 0), 
    ('B+', 0), ('B-', 0), 
    ('AB+', 0), ('AB-', 0), 
    ('O+', 0), ('O-', 0)
) AS v(blood_type, units_available)
WHERE NOT EXISTS (SELECT 1 FROM blood_inventory);
