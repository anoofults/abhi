#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Deployment Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20
echo "🟢 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# 4. Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# 5. Install PM2
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 6. Configure Database
echo "🗄️ Configuring Database..."
# Check if user exists, if not create
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='admin'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'admin123';"
# Check if db exists, if not create
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='blood_donation'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE blood_donation OWNER admin;"

# 7. Setup Backend
echo "🔙 Setting up Backend..."
cd backend
npm install
# Generate Prisma Client if used, or just run migrations if any (assuming raw SQL for now based on previous context, but running npm install is key)
# Create .env if not exists (User should ideally provide this, but we'll set defaults)
if [ ! -f .env ]; then
    echo "Creating default .env for backend..."
    echo "PORT=5000" > .env
    echo "DB_USER=admin" >> .env
    echo "DB_PASSWORD=admin123" >> .env
    echo "DB_HOST=localhost" >> .env
    echo "DB_PORT=5432" >> .env
    echo "DB_NAME=blood_donation" >> .env
    echo "JWT_SECRET=your_jwt_secret_key_change_this" >> .env
fi

# Start/Restart Backend with PM2
pm2 stop blood-backend || true
pm2 start server.js --name blood-backend
pm2 save

# 8. Setup Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install
npm run build

# 9. Configure Nginx
echo "🔧 Configuring Nginx..."
# Create Nginx config
sudo tee /etc/nginx/sites-available/blood-donation <<EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root $(pwd)/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/blood-donation /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment Complete!"
echo "🌍 Your app should be live at your server's IP address."
