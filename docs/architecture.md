# System Architecture

## Overview

PO Dashboard is a document processing system that extracts data from Purchase Orders and Goods Received Notes using AI, then populates Google Sheets for quick commerce operations.

## Components

### Frontend (React + TypeScript)

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Index.tsx` | `src/pages/` | Main page: file upload, company selection, form submission |
| `FileUploadZone.tsx` | `src/components/` | Drag-and-drop file upload with validation |
| `CompanySelector.tsx` | `src/components/` | Platform selection grid (5 quick commerce partners) |
| `UploadHistory.tsx` | `src/components/` | Real-time status display with auto-refresh |
| `supabaseClient.ts` | `src/lib/` | Supabase database client initialization |

### Serverless API (Vercel Functions)

| Endpoint | File | Purpose |
|----------|------|---------|
| `POST /api/webhook` | `api/webhook.ts` | Proxy for HTTPS→HTTP webhook forwarding |

### Database (Supabase)

**Table: `po_history`**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `file_name` | TEXT | Original filename |
| `platform` | TEXT | Target platform (zepto, swiggy-instamart, etc.) |
| `upload_type` | TEXT | 'po' or 'grn' |
| `uploaded_at` | TIMESTAMPTZ | Upload timestamp |
| `status` | TEXT | 'processing', 'success', or 'failed' |
| `row_count` | INTEGER | Number of rows processed |
| `error_message` | TEXT | Error details if failed |

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **n8n** | Workflow automation | Receives files via webhook |
| **Gemini AI** | Document OCR/parsing | Called by n8n for AI extraction |
| **Google Sheets** | Data output | n8n writes extracted data |
| **Supabase** | History database | n8n updates status on completion |

## Data Flow

### Upload Flow
```
1. User selects file + platform + upload type (PO/GRN)
2. Frontend inserts "processing" entry to Supabase
3. Frontend sends FormData to webhook (via Vercel proxy in production)
4. n8n receives file and triggers workflow
5. Gemini AI extracts structured data from document
6. n8n writes data to Google Sheets
7. n8n updates Supabase status to "success" with row_count
8. Frontend receives response and updates local state
```

### Failure Handling
```
- Network error → Frontend marks as "failed" immediately
- 90-second timeout → Frontend marks as "failed"
- n8n workflow error → n8n updates Supabase to "failed"
- Stuck entries (>2 min) → Auto-cleanup marks as "failed"
```

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Exposed API keys | Use `VITE_` prefix (client-safe anon key only) |
| Direct HTTP webhook | Vercel proxy handles HTTPS→HTTP conversion |
| Unauthenticated access | Supabase RLS policies limit operations |
| File size attacks | 10MB max file size enforced client-side |

## Assumptions

- n8n is self-hosted and accessible via HTTP (proxy handles HTTPS)
- Google Sheets is pre-configured with correct column structure
- Gemini AI has sufficient quota for document processing
- Single-tenant system (no user authentication required)
