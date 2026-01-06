# Deployment Guide

This project consists of two separate applications that need to be deployed independently:

1. **Mobile App** - Expo React Native app for iOS/Android/Web
2. **API Server** - Node.js/Express backend on Digital Ocean

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (free tier recommended)
- Digital Ocean account
- Apple Developer account (for iOS App Store)
- Google Play Developer account (for Android Play Store)

## Project Structure

```
/
├── mobile/          # Expo mobile application
│   ├── app/        # App routes and screens
│   ├── src/        # Components, services, utils
│   └── package.json
├── api/            # Express API server
│   ├── src/        # Routes, services, middleware
│   └── package.json
└── package.json    # Root workspace config
```

## Part 1: API Server Deployment (Digital Ocean)

### 1.1 Setup PostgreSQL Database

Choose one of these free-tier options:
- **Supabase Free Tier** (500MB, 2GB bandwidth)
- **ElephantSQL Tiny Turtle** (20MB)
- **Railway** (500MB, $5 credit)
- **Neon** (512MB, 3GB bandwidth)

Get your connection string in this format:
```
postgresql://username:password@host:5432/database_name
```

### 1.2 Configure Digital Ocean Droplet

1. Create a new Droplet:
   - Choose Ubuntu 22.04 LTS
   - Basic plan ($6/month recommended)
   - Select a datacenter region close to your users

2. SSH into your droplet:
```bash
ssh root@your_droplet_ip
```

3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install PM2 (process manager):
```bash
npm install -g pm2
```

### 1.3 Deploy API Code

1. Clone or upload your code:
```bash
cd /var/www
git clone your-repo-url
cd your-repo-name/api
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
nano .env
```

Add these variables:
```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

4. Run database migrations:
```bash
npm run migrate
```

5. Build the TypeScript code:
```bash
npm run build
```

6. Start with PM2:
```bash
pm2 start dist/index.js --name chromalife-api
pm2 save
pm2 startup
```

### 1.4 Setup Nginx Reverse Proxy

1. Install Nginx:
```bash
sudo apt install nginx
```

2. Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/chromalife-api
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/chromalife-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 1.5 Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 1.6 Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

Your API should now be accessible at `https://your-domain.com`

## Part 2: Mobile App Deployment

### 2.1 Configure API URL

Update `mobile/.env`:
```
EXPO_PUBLIC_API_URL=https://your-domain.com/api
```

### 2.2 Build for iOS (App Store)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS:
```bash
cd mobile
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

5. Submit to App Store:
```bash
eas submit --platform ios
```

### 2.3 Build for Android (Play Store)

1. Build for Android:
```bash
eas build --platform android
```

2. Submit to Play Store:
```bash
eas submit --platform android
```

### 2.4 Web Deployment (Optional)

1. Build the web version:
```bash
cd mobile
npm run build:web
```

2. Deploy to hosting service:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Or upload `dist/` to any static hosting

## Monitoring and Maintenance

### API Server

Check logs:
```bash
pm2 logs chromalife-api
```

Restart API:
```bash
pm2 restart chromalife-api
```

Monitor resources:
```bash
pm2 monit
```

### Database Backups

Setup automated backups using your database provider's tools or:

```bash
# Create backup script
nano /root/backup-db.sh
```

Add:
```bash
#!/bin/bash
pg_dump $DATABASE_URL > /backups/db-$(date +%Y%m%d).sql
```

Make executable and add to cron:
```bash
chmod +x /root/backup-db.sh
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

## Environment Variables Summary

### API (.env)
```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=https://your-domain.com/api
```

## Troubleshooting

### API Issues

1. Check PM2 status: `pm2 status`
2. View logs: `pm2 logs chromalife-api`
3. Check Nginx: `sudo nginx -t`
4. Check database connection: `psql $DATABASE_URL`

### Mobile App Issues

1. Clear Expo cache: `expo start -c`
2. Rebuild: `eas build --platform ios --clear-cache`
3. Check API connectivity from app

## Updates and CI/CD

### Manual API Update

```bash
cd /var/www/your-repo-name/api
git pull
npm install
npm run build
pm2 restart chromalife-api
```

### Mobile App Update

```bash
cd mobile
eas build --platform all
eas submit --platform all
```

### Automated Deployments (Optional)

Consider setting up GitHub Actions or similar CI/CD for automated deployments on push to main branch.

## Security Checklist

- [ ] Changed all default passwords
- [ ] JWT_SECRET is strong and unique
- [ ] Database has restricted access
- [ ] SSL/HTTPS is enabled
- [ ] Firewall is configured
- [ ] Regular backups are scheduled
- [ ] PM2 is configured to restart on server reboot
- [ ] Environment variables are not committed to git
- [ ] API rate limiting is configured (recommended)
- [ ] CORS is properly configured in API

## Cost Estimate

- Digital Ocean Droplet: $6/month
- PostgreSQL Database: Free tier or $5/month
- Domain name: ~$12/year
- Apple Developer: $99/year
- Google Play Developer: $25 one-time

**Total**: ~$15-20/month + annual fees

## Support

For issues:
1. Check logs first
2. Verify environment variables
3. Test API endpoints manually
4. Check mobile app network requests
