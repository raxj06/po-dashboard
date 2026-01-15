# API Reference

## External APIs

### Supabase Database API
| Endpoint | Purpose | Auth |
|----------|---------|------|
| `POST /rest/v1/po_history` | Insert new history entry | Anon Key |
| `GET /rest/v1/po_history` | Fetch history entries | Anon Key |
| `PATCH /rest/v1/po_history` | Update entry status | Anon Key |

**Client**: `@supabase/supabase-js` library (see `src/lib/supabaseClient.ts`)

---

## Internal APIs (Vercel Functions)

### POST `/api/webhook`

**Purpose**: Proxy requests to n8n webhooks (HTTPS→HTTP)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `target` | string | Yes | URL-encoded destination webhook URL |

**Request**:
- Method: `POST`
- Body: `FormData` (file + metadata)
- Content-Type: `multipart/form-data`

**Response**:
```json
{
  "success": true,
  "rowCount": 5,
  "message": "Processed successfully"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": true,
  "message": "Proxy request failed"
}
```

---

## n8n Webhooks

### PO Processing Webhook
**URL**: `VITE_WEBHOOK_URL` environment variable

**Payload (FormData)**:
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The PO document |
| `platform` | string | Target platform ID |
| `fileType` | string | MIME type |
| `fileExtension` | string | File extension |
| `uploadType` | string | Always "po" |
| `uploadedAt` | string | ISO timestamp |
| `historyId` | string | UUID from Supabase for status updates |

**Expected Response**:
```json
{
  "success": true,
  "rowCount": 10
}
```

---

### GRN Processing Webhook
**URL**: `VITE_GRN_WEBHOOK_URL` environment variable

**Payload**: Same as PO webhook, but `uploadType` = "grn"

---

## Webhook Events

### Upload Started
**Event**: Frontend inserts to Supabase
```sql
INSERT INTO po_history (file_name, platform, upload_type, status)
VALUES ('invoice.pdf', 'zepto', 'po', 'processing');
```

### Upload Success
**Event**: n8n updates Supabase
```sql
UPDATE po_history 
SET status = 'success', row_count = 10
WHERE id = 'uuid-here';
```

### Upload Failed
**Event**: Frontend or n8n updates Supabase
```sql
UPDATE po_history 
SET status = 'failed'
WHERE id = 'uuid-here';
```

---

## Rate Limits & Constraints

| Service | Limit | Impact |
|---------|-------|--------|
| Supabase (Free Tier) | 500MB database, 2GB bandwidth | Monitor usage |
| Vercel (Hobby) | 100GB bandwidth/month | Sufficient for normal use |
| Gemini AI | Varies by plan | May throttle document processing |
| n8n (Self-hosted) | No limit | Depends on server resources |

---

## Response Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Parse response, check success field |
| 400 | Bad request | Show error toast |
| 405 | Method not allowed | Should not occur |
| 500 | Server error | Show error toast, mark as failed |
| Timeout | No response in 90s | Mark as failed |
