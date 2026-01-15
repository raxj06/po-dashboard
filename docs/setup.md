# Setup Guide

## Prerequisites

### Required Tools
- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **bun**
- **Git**

### Required Accounts & Access
- **Supabase** account (for database)
- **Vercel** account (for deployment)
- **n8n** instance (self-hosted or cloud)
- **Google Cloud** account (for Gemini AI in n8n)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WEBHOOK_URL` | n8n webhook URL for PO processing | `http://your-n8n:5678/webhook/po-process` |
| `VITE_GRN_WEBHOOK_URL` | n8n webhook URL for GRN processing | `http://your-n8n:5678/webhook/grn-process` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIs...` |

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/po-dashboard.git
cd po-dashboard/po-sender-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file in the project root:
```bash
VITE_WEBHOOK_URL=http://localhost:5678/webhook/po-process
VITE_GRN_WEBHOOK_URL=http://localhost:5678/webhook/grn-process
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Supabase Database
Run this SQL in Supabase SQL Editor:
```sql
-- Create the po_history table
CREATE TABLE po_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  upload_type TEXT NOT NULL DEFAULT 'po' CHECK (upload_type IN ('po', 'grn')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'success', 'failed')),
  row_count INTEGER,
  error_message TEXT
);

-- Enable Row Level Security
ALTER TABLE po_history ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access
CREATE POLICY "Allow public read" ON po_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON po_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON po_history FOR UPDATE USING (true);

-- Create index for faster queries
CREATE INDEX idx_po_history_uploaded_at ON po_history(uploaded_at DESC);
```

### 5. Start Development Server
```bash
npm run dev
```
Access at `http://localhost:8080`

## Production Setup

### Vercel Environment Variables
Set these in Vercel Dashboard → Settings → Environment Variables:
- `VITE_WEBHOOK_URL`
- `VITE_GRN_WEBHOOK_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### n8n Configuration
1. Import the PO/GRN processing workflows
2. Configure Gemini AI credentials
3. Configure Google Sheets credentials
4. Set up Supabase credentials for status updates

## Common Setup Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| "Supabase credentials not configured" warning | Missing env vars | Check `.env` file exists with correct values |
| Mixed content error | HTTPS→HTTP blocked | Deploy to Vercel (uses proxy) or use HTTPS for n8n |
| 404 on /api/webhook | API not deployed | Push to Vercel, check `api/` folder exists |
| CORS errors locally | Cross-origin blocked | Use same origin or configure n8n CORS |
