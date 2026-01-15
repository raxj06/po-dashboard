# Frequently Asked Questions

## Developer FAQs

### Why does the frontend use a proxy for webhooks?
The production site is served over HTTPS (Vercel), but the n8n server uses HTTP. Browsers block "mixed content" requests from HTTPS to HTTP for security. The `/api/webhook` serverless function acts as an HTTPS→HTTP bridge.

### Why is there a 2-minute auto-cleanup?
If n8n crashes or the workflow fails before responding, the frontend can't know the status. The cleanup prevents entries from being permanently stuck as "Processing".

### Why are environment variables prefixed with `VITE_`?
Vite only exposes variables to the client that start with `VITE_`. This is a security feature to prevent accidentally exposing server-side secrets.

### Can I add more quick commerce platforms?
Yes! Edit `src/components/CompanySelector.tsx`:
1. Add logo to `src/logos/`
2. Add new entry to `companies` array
3. Platform ID will be sent to webhook

### How do I test locally without n8n?
You can mock the webhook response by temporarily changing the fetch URL to return test data, or use a tool like Mockoon.

---

## Operations FAQs

### How do I know if an upload succeeded?
Check the Upload History section:
- 🟡 Yellow "Processing" = In progress
- 🟢 Green "Success • X rows" = Completed
- 🔴 Red "Failed" = Error occurred

### What happens if I upload the same file twice?
Both uploads will be processed separately. The system doesn't deduplicate files - each upload creates a new entry.

### Can I delete history entries?
Not from the UI. Use Supabase Dashboard or SQL:
```sql
DELETE FROM po_history WHERE id = 'uuid-here';
```

### What file types are supported?
- Documents: PDF
- Images: JPG, JPEG
- Spreadsheets: CSV, XLSX, XLS

### What's the maximum file size?
10MB per file. Larger files will be rejected with an error toast.

---

## Business FAQs

### Why do some uploads fail?
Common reasons:
- Document quality too low for AI to read
- Unexpected document format
- n8n server temporarily unavailable
- Gemini AI quota exceeded

### Can multiple people use the dashboard simultaneously?
Yes! The history is shared across all users (stored in Supabase). Everyone sees the same upload history.

### How long is history kept?
Indefinitely, unless manually deleted. The UI shows the last 50 entries.

### Which platforms are supported?
- Zepto
- Swiggy Instamart
- BigBasket
- Flipkart Minutes
- Blinkit

---

## Known Limitations

| Limitation | Description | Workaround |
|------------|-------------|------------|
| No authentication | Anyone with URL can access | Restrict via network/VPN |
| Single file upload | One file per submission | Merge PDFs before upload |
| No retry button | Can't retry failed uploads | Re-upload the file |
| Fixed platforms | Can't add platforms from UI | Edit source code |
| No file preview | Can't see file before sending | Open file locally first |

---

## Why Does It Work This Way?

### Why Supabase instead of localStorage?
LocalStorage is per-browser - history wouldn't be shared across devices or users. Supabase provides a shared database accessible from anywhere.

### Why n8n instead of serverless functions?
n8n provides a visual workflow builder, making it easy for non-developers to modify the data extraction logic. It also handles retries, error handling, and integrations with minimal code.

### Why Vercel for hosting?
- Zero-config deployment from Git
- Free tier sufficient for this use case
- Built-in serverless functions
- Edge network for fast global access
- Preview deployments for testing

### Why Gemini AI for OCR?
- High accuracy with handwritten and printed text
- Handles complex document layouts
- Returns structured JSON directly
- Cost-effective compared to alternatives
