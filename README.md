# PO Dashboard - Quick Commerce Upload System

A modern web application for uploading Purchase Orders (PO) and Goods Received Notes (GRN) to quick commerce platforms. The system processes documents using AI-powered OCR via n8n workflows and stores upload history in Supabase.

## Business Problem Solved

Manual PO/GRN data entry for quick commerce partners (Zepto, Swiggy Instamart, BigBasket, Flipkart Minutes, Blinkit) is time-consuming and error-prone. This dashboard automates the extraction and processing of PO/GRN documents, reducing manual work and improving accuracy.

## Key Features

- **Dual Mode Upload**: Support for both Purchase Orders (PO) and Goods Received Notes (GRN)
- **Multi-Platform Support**: 5 quick commerce platforms - Zepto, Swiggy Instamart, BigBasket, Flipkart Minutes, Blinkit
- **AI-Powered Processing**: Documents processed via n8n workflows using Gemini AI for OCR
- **Real-time Status Tracking**: Shared upload history with processing/success/failed states
- **Auto-Cleanup**: Stuck uploads automatically marked as failed after 2 minutes
- **File Support**: CSV, XLSX, XLS, PDF, JPG, JPEG (max 10MB)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Backend | Vercel Serverless Functions |
| Automation | n8n (self-hosted) |
| AI/OCR | Google Gemini AI |
| Deployment | Vercel |

## Architecture Overview

```
┌──────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                  │     │                 │     │                 │
│  React Frontend  │────▶│  Vercel Proxy   │────▶│   n8n Webhook   │
│                  │     │  (HTTPS→HTTP)   │     │                 │
└────────┬─────────┘     └─────────────────┘     └────────┬────────┘
         │                                                │
         │                                                ▼
         │                                       ┌─────────────────┐
         │                                       │   Gemini AI     │
         │                                       │   (OCR/Parse)   │
         └───────────────────┐                   └────────┬────────┘
                             │                            │
                             ▼                            ▼
                    ┌─────────────────┐         ┌─────────────────┐
                    │                 │         │                 │
                    │    Supabase     │◀────────│  Google Sheets  │
                    │   (History DB)  │         │   (Output)      │
                    └─────────────────┘         └─────────────────┘
```

## Environments

| Environment | URL | Purpose |
|------------|-----|---------|
| Production | https://po-dashboard-pi.vercel.app | Live system |
| Local | http://localhost:8080 | Development |

## Documentation Guide

| Document | Audience | Purpose |
|----------|----------|---------|
| [setup.md](docs/setup.md) | Developers | Local and production setup |
| [architecture.md](docs/architecture.md) | Developers | System design and data flow |
| [workflows.md](docs/workflows.md) | Developers/Ops | Business and technical workflows |
| [api.md](docs/api.md) | Developers | API reference and webhooks |
| [deployment.md](docs/deployment.md) | DevOps | Deployment and CI/CD |
| [troubleshooting.md](docs/troubleshooting.md) | Developers/Ops | Common issues and fixes |
| [faq.md](docs/faq.md) | All | Frequently asked questions |

## Project Owner

**Team**: Joyspoon Tech  
**Repository**: PO-Dashboard/po-sender-pro

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables (copy .env.example to .env)
cp .env.example .env

# Start development server
npm run dev
```

See [docs/setup.md](docs/setup.md) for detailed instructions.
