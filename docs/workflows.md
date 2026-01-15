# Workflows

## Core Business Workflows

### 1. PO Upload Workflow

**Trigger**: User clicks "Send Data" with PO tab selected

**Flow**:
1. User selects PDF/image file
2. User selects target platform (Zepto, Swiggy, etc.)
3. User clicks "Send Data"
4. System inserts `processing` entry to Supabase
5. File + metadata sent to n8n PO webhook
6. n8n extracts data via Gemini AI
7. Data written to Google Sheets (platform-specific sheet)
8. Status updated to `success` with row count
9. User sees success toast notification

**Outcome**: PO data extracted and added to operations spreadsheet

---

### 2. GRN Upload Workflow

**Trigger**: User clicks "Send Data" with GRN tab selected

**Flow**:
1. User switches to "GRN Upload" tab
2. User selects GRN document
3. User selects platform
4. System sends to GRN-specific webhook
5. n8n processes GRN with different extraction schema
6. Data written to appropriate sheet

**Outcome**: GRN data extracted for inventory reconciliation

---

## User-Initiated Workflows

### File Selection
```
Trigger → User drags file or clicks upload zone
Action  → Validate file type (.csv, .xlsx, .xls, .pdf, .jpg, .jpeg)
        → Validate file size (max 10MB)
        → Display file name in upload zone
Outcome → File ready for submission OR error toast shown
```

### Platform Selection
```
Trigger → User clicks platform button
Action  → Highlight selected platform
        → Store platform ID in state
Outcome → Platform ready for submission
```

### Tab Switching
```
Trigger → User clicks PO/GRN tab
Action  → Update active tab state
        → Clear selected file and platform
        → Change header icon and title
Outcome → Form reset for new upload type
```

---

## Automated Workflows

### History Fetch (On Page Load)
```
Trigger → Component mounts
Action  → Query Supabase for last 50 entries
        → Order by uploaded_at DESC
        → Map database fields to frontend types
Outcome → History list populated
```

### Auto-Cleanup (Every 30 Seconds)
```
Trigger → Interval timer
Action  → Find entries with status='processing' older than 2 minutes
        → Update status to 'failed' in Supabase
        → Refresh history list
Outcome → Stuck entries cleaned up automatically
```

---

## Error and Retry Flows

### Network Error
```
Trigger → Fetch throws error
Action  → Update Supabase status to 'failed'
        → Update local state to 'failed'
        → Show error toast
Outcome → User can retry upload
```

### Timeout (90 Seconds)
```
Trigger → AbortController times out
Action  → Abort fetch request
        → Update Supabase status to 'failed'
        → Show timeout-specific toast message
Outcome → User informed, can retry
```

### Workflow Error (n8n)
```
Trigger → n8n returns success:false or error:true
Action  → Throw error in frontend
        → Mark as failed in Supabase
        → Show error toast
Outcome → User sees failure, can retry with corrected document
```

### Stuck Entry Cleanup
```
Trigger → Entry stays 'processing' for >2 minutes
Action  → Background cleanup marks as 'failed'
        → History refreshes to show updated status
Outcome → No permanently stuck entries
```
