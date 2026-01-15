# Troubleshooting Guide

## Common Issues

### 1. Uploads Stuck in "Processing"

**Symptoms**: Status never changes from yellow "Processing" badge

**Root Causes**:
- n8n workflow not responding
- n8n not updating Supabase
- Network timeout exceeded

**Fixes**:
1. Check n8n execution logs for errors
2. Verify n8n has Supabase credentials configured
3. Ensure "Respond to Webhook" node is at end of workflow
4. Wait 2 minutes - auto-cleanup will mark as failed

**Manual Fix** (Supabase SQL):
```sql
UPDATE po_history 
SET status = 'failed' 
WHERE status = 'processing';
```

---

### 2. Mixed Content Error

**Symptoms**: Console shows "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource"

**Root Cause**: Production frontend (HTTPS) calling n8n webhook (HTTP)

**Fixes**:
1. Verify `/api/webhook` proxy is deployed
2. Check Vercel deployment includes `api/` folder
3. Ensure `VITE_WEBHOOK_URL` is HTTP (proxy handles conversion)

---

### 3. "Supabase credentials not configured" Warning

**Symptoms**: Console warning on page load, history doesn't persist

**Root Cause**: Missing or incorrect environment variables

**Fix**:
1. Check `.env` file exists
2. Verify variables start with `VITE_`
3. Restart dev server after changing `.env`
4. For production, check Vercel environment variables

---

### 4. File Upload Rejected

**Symptoms**: Red toast "Invalid file type" or "File too large"

**Root Cause**: File doesn't meet requirements

**Requirements**:
- Types: `.csv`, `.xlsx`, `.xls`, `.pdf`, `.jpg`, `.jpeg`
- Max size: 10MB

**Fix**: Convert file to accepted format or reduce size

---

### 5. Webhook Returns Error

**Symptoms**: Red toast "Upload Failed", status shows "Failed"

**Root Causes**:
- Gemini AI quota exceeded
- Invalid document format
- Google Sheets permissions

**Debug Steps**:
1. Check n8n execution for specific error
2. Verify Gemini API key is valid
3. Check Google Sheets is accessible
4. Try with known-good document

---

## Debug Checklist

### Frontend Issues
- [ ] Console has no errors
- [ ] Network tab shows 200 responses
- [ ] Environment variables loaded (check `console.log(import.meta.env)`)
- [ ] Supabase client initialized

### API Issues
- [ ] `/api/webhook` returns 200
- [ ] FormData contains all fields
- [ ] Timeout not exceeded (90s)
- [ ] Response contains `success: true`

### n8n Issues
- [ ] Workflow is active
- [ ] Webhook URL matches `.env`
- [ ] All credentials valid
- [ ] "Respond to Webhook" node present

### Supabase Issues
- [ ] Table `po_history` exists
- [ ] RLS policies allow operations
- [ ] Anon key has correct permissions

---

## Emergency Recovery

### All Uploads Fail
1. Check n8n server is running
2. Check Supabase is accessible
3. Verify environment variables
4. Test with Postman directly to webhook

### Database Corrupted
```sql
-- View recent entries
SELECT * FROM po_history ORDER BY uploaded_at DESC LIMIT 10;

-- Delete test entries
DELETE FROM po_history WHERE file_name LIKE 'test%';

-- Reset all to failed
UPDATE po_history SET status = 'failed' WHERE status = 'processing';
```

### Complete Reset
```sql
-- Nuclear option: clear all history
TRUNCATE TABLE po_history;
```

### Rollback Deployment
1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
