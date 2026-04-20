# MedLedger Deployment Guide

This guide covers deploying MedLedger to various platforms.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended for Frontend)

**Prerequisites:**
- Vercel account
- GitHub repository

**Steps:**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_STELLAR_NETWORK=testnet
   VITE_HORIZON_URL=https://horizon-testnet.stellar.org
   VITE_FREIGHTER_ENABLED=true
   ```
4. Deploy automatically on push

**CLI Deployment:**
```bash
npm install -g vercel
npm run build
vercel --prod
```

### 2. Netlify (Alternative Frontend)

**Steps:**
1. Build the project: `npm run build`
2. Drag and drop `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard

**CLI Deployment:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### 3. Railway (Backend Deployment)

**Steps:**
1. Create Railway account
2. Connect GitHub repository
3. Set environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   STELLAR_NETWORK=testnet
   STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   JWT_SECRET=your-secure-jwt-secret
   ```
4. Deploy from `backend/` directory

### 4. Heroku (Backend Alternative)

**Steps:**
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   cd backend
   heroku create medledger-api
   ```
3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   heroku config:set STELLAR_NETWORK=testnet
   heroku config:set JWT_SECRET=your-secure-jwt-secret
   ```
4. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## 🔧 Production Configuration

### Environment Variables

**Frontend (.env):**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_FREIGHTER_ENABLED=true
VITE_APP_NAME=MedLedger
VITE_APP_VERSION=1.0.0
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
JWT_SECRET=your-very-secure-jwt-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret
2. **CORS**: Update FRONTEND_URL to your actual domain
3. **Rate Limiting**: Adjust rate limits based on expected traffic
4. **HTTPS**: Ensure both frontend and backend use HTTPS
5. **Environment Variables**: Never commit secrets to version control

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Frontend Domain**: Configure in your hosting provider
2. **Backend Domain**: Set up API subdomain (e.g., api.medledger.com)
3. **Update CORS**: Update backend FRONTEND_URL
4. **Update API URL**: Update frontend VITE_API_BASE_URL

### SSL Certificates

Most modern hosting providers (Vercel, Netlify, Railway) provide automatic SSL certificates.

## 📊 Monitoring and Analytics

### Recommended Tools

1. **Uptime Monitoring**: UptimeRobot, Pingdom
2. **Error Tracking**: Sentry, LogRocket
3. **Analytics**: Google Analytics, Plausible
4. **Performance**: Lighthouse, Web Vitals

### Health Checks

The backend includes a health check endpoint:
- URL: `https://your-api-domain.com/health`
- Use for monitoring and load balancer health checks

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy MedLedger

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      # Add your backend deployment steps here
```

## 🐳 Docker Deployment

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:5000/api
  
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)

Add to `public/manifest.json`:

```json
{
  "name": "MedLedger",
  "short_name": "MedLedger",
  "description": "Healthcare Record Verification",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/medical-cross.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

## 🔍 Testing Deployment

### Pre-deployment Checklist

- [ ] All environment variables set correctly
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors
- [ ] API endpoints respond correctly
- [ ] Wallet connection works (both test and real mode)
- [ ] File upload and verification work
- [ ] CORS configured properly
- [ ] SSL certificates active
- [ ] Health check endpoint accessible

### Post-deployment Testing

1. **Functionality Test**: Upload and verify a test record
2. **Performance Test**: Check page load times
3. **Mobile Test**: Test on various devices
4. **Browser Test**: Test on different browsers
5. **Wallet Test**: Test Freighter integration

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check FRONTEND_URL in backend environment
2. **API Not Found**: Verify VITE_API_BASE_URL in frontend
3. **Wallet Connection**: Ensure Freighter extension is installed
4. **Build Errors**: Check Node.js version compatibility
5. **Environment Variables**: Verify all required variables are set

### Debug Commands

```bash
# Check frontend build
npm run build

# Test backend locally
cd backend && npm start

# Check API health
curl https://your-api-domain.com/health

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-api-domain.com/api/records
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review server logs
3. Test locally first
4. Open a GitHub issue with deployment details

---

*Happy Deploying! 🚀*