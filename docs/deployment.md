# Deployment Guide

## Deployment Strategy

The application uses **Vercel** for zero-config deployments with automatic CI/CD.

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend | Vercel | Static site + serverless functions |
| Database | Supabase | Managed PostgreSQL |
| Automation | n8n | Self-hosted on EC2/VPS |

---

## CI/CD Pipeline

### Automatic Deployment (Vercel)

```
1. Developer pushes to main branch
2. Vercel detects push via GitHub integration
3. Build triggered: `npm run build`
4. Static assets deployed to CDN
5. api/ folder deployed as serverless functions
6. Preview URL generated for PRs
```

### Build Commands
```bash
# Development build
npm run build:dev

# Production build
npm run build
```

---

## Environment Differences

| Setting | Development | Production |
|---------|-------------|------------|
| API URL | Direct to n8n | Via `/api/webhook` proxy |
| Protocol | HTTP | HTTPS |
| Supabase | Same instance | Same instance |
| Hot Reload | Enabled | Disabled |

### Production Detection
```typescript
const isProduction = window.location.protocol === 'https:';
```

---

## Deployment Steps

### 1. Initial Vercel Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link
```

### 2. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- `VITE_WEBHOOK_URL`
- `VITE_GRN_WEBHOOK_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Or push to main branch for auto-deploy
git push origin main
```

---

## Rollback Strategy

### Vercel Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Git Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main
```

---

## Monitoring & Logs

### Vercel Logs
```bash
# View logs via CLI
vercel logs

# Or in Dashboard → Functions tab
```

### Supabase Logs
- Dashboard → Logs → API
- Dashboard → Logs → Postgres

### n8n Logs
```bash
# If Docker
docker logs n8n-container

# If PM2
pm2 logs n8n
```

---

## Health Checks

| Check | How | Expected |
|-------|-----|----------|
| Frontend loads | Visit production URL | Page renders |
| Supabase connected | Check console for warnings | No "credentials not configured" |
| Webhook accessible | Upload test file | Status changes to success |
| API proxy works | Check Network tab | 200 response from /api/webhook |

---

## Scaling Considerations

| Scenario | Solution |
|----------|----------|
| High upload volume | Upgrade Supabase plan, n8n server |
| Slow processing | Increase n8n worker count |
| Large files | Increase timeout, use streaming |
| Global users | Enable Vercel Edge, regional Supabase |
