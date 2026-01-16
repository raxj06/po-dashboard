# PO Dashboard - User Guide

## Quick Commerce Document Upload Platform

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [How to Upload Purchase Orders](#how-to-upload-purchase-orders)
4. [How to Upload GRN Documents](#how-to-upload-grn-documents)
5. [Understanding Upload History](#understanding-upload-history)
6. [Supported Platforms](#supported-platforms)
7. [File Requirements](#file-requirements)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

### What is PO Dashboard?

PO Dashboard is a web-based platform designed to streamline the process of uploading Purchase Orders (PO) and Goods Received Notes (GRN) for quick commerce operations. Instead of manually entering data from documents, simply upload your files and the system automatically extracts and processes the information.

### Key Benefits

- **Save Time**: Automated data extraction eliminates manual data entry
- **Reduce Errors**: AI-powered processing ensures accurate data capture
- **Track Progress**: Real-time status updates show processing status
- **Multi-Platform**: Support for all major quick commerce partners
- **Shared History**: All team members can view upload history

---

## Getting Started

### Accessing the Platform

1. Open your web browser (Chrome, Firefox, Edge, or Safari recommended)
2. Navigate to: **https://po-dashboard-pi.vercel.app**
3. The dashboard loads immediately - no login required

### Dashboard Overview

When you open the platform, you'll see:

| Section | Description |
|---------|-------------|
| **Header** | Shows current mode (PO or GRN) with tab switcher |
| **Upload Zone** | Drag and drop area for your files |
| **Company Selector** | Grid of quick commerce platform buttons |
| **Send Data Button** | Submits your upload for processing |
| **Upload History** | List of recent uploads with status |

---

## How to Upload Purchase Orders

### Step-by-Step Guide

**Step 1: Ensure PO Upload Tab is Selected**
- Look at the top-right of the header
- The "PO Upload" button should be highlighted
- If not, click on "PO Upload"

**Step 2: Upload Your File**
- Drag your PO document and drop it on the upload zone
- OR click "browse files" to select from your computer
- Supported formats: PDF, JPG, CSV, Excel

**Step 3: Select the Target Platform**
- Click on the company button for your order destination
- A checkmark will appear on the selected company
- Options: Zepto, Swiggy Instamart, BigBasket, Flipkart Minutes, Blinkit

**Step 4: Send the Data**
- Click the purple "Send Data" button
- The button becomes disabled while processing
- A loading spinner appears

**Step 5: Wait for Processing**
- Processing typically takes 30-60 seconds
- Check Upload History for status updates
- A toast notification confirms success or failure

---

## How to Upload GRN Documents

### What is a GRN?

A Goods Received Note (GRN) confirms receipt of goods from suppliers. The GRN upload works similarly to PO upload but processes different document fields.

### Step-by-Step Guide

**Step 1: Switch to GRN Mode**
- Click the "GRN Upload" tab in the header
- The header icon and title change to reflect GRN mode

**Step 2: Upload, Select, and Send**
- Follow the same steps as PO upload
- The system automatically uses the GRN processing workflow

---

## Understanding Upload History

### Status Indicators

| Status | Indicator | Meaning |
|--------|-----------|---------|
| **Processing** | 🟡 Yellow spinner | File is being processed |
| **Success** | 🟢 Green checkmark | Data extracted and saved |
| **Failed** | 🔴 Red X | Processing failed |

### History Information

Each history entry shows:
- **File Name**: Original name of uploaded file
- **Type Badge**: PO (blue) or GRN (purple)
- **Platform**: Target company name
- **Date & Time**: When the upload occurred
- **Row Count**: Number of line items processed (on success)

### Automatic Refresh

- History updates automatically every 30 seconds
- Stuck "Processing" entries auto-convert to "Failed" after 2 minutes

---

## Supported Platforms

### Quick Commerce Partners

| Platform | Logo Color | Description |
|----------|------------|-------------|
| **Zepto** | Purple | 10-minute delivery platform |
| **Swiggy Instamart** | Orange | Swiggy's grocery delivery |
| **BigBasket** | Green | Large grocery delivery network |
| **Flipkart Minutes** | Yellow | Flipkart's quick commerce |
| **Blinkit** | Yellow | Formerly Grofers |

### Platform Selection

- Click on a platform button to select it
- Only one platform can be selected per upload
- The selected platform receives a checkmark and accent bar

---

## File Requirements

### Acceptable Formats

| Format | Extension | Best For |
|--------|-----------|----------|
| PDF | .pdf | Scanned documents, invoices |
| JPEG | .jpg, .jpeg | Photos of documents |
| Excel | .xlsx, .xls | Spreadsheet exports |
| CSV | .csv | Comma-separated data files |

### File Size Limit

- **Maximum**: 10 MB per file
- Large files will be rejected with an error message
- Compress or split large documents if needed

### Document Quality Tips

- Ensure text is clearly readable
- Avoid blurry or low-resolution images
- Remove password protection from PDFs
- Use original documents when possible (not photocopies)

---

## Troubleshooting

### Common Issues and Solutions

#### "Upload Failed" Error

**Possible Causes:**
- Document quality too low
- Unsupported document format
- Server temporarily unavailable

**Solutions:**
1. Try a higher quality version of the document
2. Convert to a supported format (PDF recommended)
3. Wait a few minutes and try again

#### "Request Timed Out" Error

**Cause:** Processing took longer than 90 seconds

**Solutions:**
1. Check document is readable
2. Try a smaller file size
3. Upload again - may be temporary server load

#### Upload Stuck on "Processing"

**Cause:** System didn't receive completion signal

**Solutions:**
1. Wait 2 minutes - auto-cleanup will mark as failed
2. Refresh the page and check history
3. Re-upload the file if needed

#### File Rejected on Upload

**Check:**
1. File is under 10 MB
2. File type is PDF, JPG, JPEG, CSV, XLSX, or XLS
3. File is not corrupted

---

## FAQ

### General Questions

**Q: Do I need to create an account?**  
A: No, the platform is accessible without login. All uploads are tracked by the shared history.

**Q: Can multiple people use the dashboard at the same time?**  
A: Yes! All users share the same upload history, so everyone can see team activity.

**Q: How long is upload history kept?**  
A: History is stored indefinitely. The dashboard shows the 50 most recent entries.

**Q: Can I delete an upload from history?**  
A: Not from the interface. Contact your administrator if needed.

### Upload Questions

**Q: Can I upload multiple files at once?**  
A: No, files must be uploaded one at a time. This ensures each document is processed correctly.

**Q: What happens if I upload the wrong file?**  
A: The data will still be processed. You may need to manually correct the output in the destination spreadsheet.

**Q: How do I know which platform to select?**  
A: Select the platform that the PO/GRN is intended for. This determines which spreadsheet receives the data.

### Technical Questions

**Q: Where does the extracted data go?**  
A: Data is automatically added to Google Sheets organized by platform.

**Q: How accurate is the data extraction?**  
A: The AI system is highly accurate but may occasionally misread handwritten or poor-quality text. Always verify important data.

**Q: What times is the system available?**  
A: The platform runs 24/7. Processing speed may vary during peak hours.

---

## Getting Help

### Contact Support

For technical issues or questions not covered in this guide:

- **Email**: [Your support email]
- **Slack**: [Your Slack channel]
- **Phone**: [Your support number]

### Report Issues

When reporting an issue, please include:
1. Screenshot of the error
2. File name that was uploaded
3. Time of the upload attempt
4. Selected platform

---

## Quick Reference Card

### Upload Checklist

- [ ] File is under 10 MB
- [ ] File format is PDF, JPG, CSV, or Excel
- [ ] Correct tab selected (PO or GRN)
- [ ] Platform button selected
- [ ] Document is readable and not password-protected

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | F5 or Ctrl+R |
| Open file dialog | Click "browse files" |

---

*Document Version: 1.0*  
*Last Updated: January 2026*
