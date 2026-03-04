# Quick Start Guide

Get the Recruitment Email Generator running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

## Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Configure API Key

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API key
# On Windows:
start .env
# On Mac:
open .env
# On Linux:
nano .env
```

Add your key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3000
NODE_ENV=development
```

### 3. Start Backend

```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:3000
POST /api/extract - Extract text from files
POST /api/generate - Generate personalized emails
```

### 4. Frontend Setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
```

### 5. Open in Browser

Navigate to http://localhost:5173

## Using the App

### Step 1: Upload Background
1. Drag & drop a PDF resume, Word doc, or screenshot
2. OR paste candidate info as text
3. Click "Use This Background"

### Step 2: Configure Email
1. Enter job title
2. Select sender role
3. Choose output language
4. Click "Generate Personalized Emails"

### Step 3: Copy & Send
1. Review the 3 generated email versions
2. Click "Copy Full Email" to copy everything
3. Paste into your email client
4. Send!

## Testing Without Files

Try this sample text in Step 1:

```
John Smith
Senior Backend Engineer with 5 years experience
Previously worked at Google as SRE
Led payment system architecture redesign, handling $10M+ daily transactions
Open source contributor to Kubernetes
Published 3 technical blog posts on microservices
Masters in Computer Science from Stanford
```

Then in Step 2:
- Job Title: "Senior Platform Engineer"
- Sender Role: "Hiring Manager"
- Language: "English"

## Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"
```bash
cd backend
npm install
```

### "Port 3000 already in use"
```bash
# Change port in backend/.env:
PORT=3001
```

### "API key invalid"
- Check .env file has correct key
- Verify no extra spaces or quotes

### "File upload fails"
- Max file size is 10MB
- Supported: PDF, DOCX, DOC, JPG, PNG, WebP
- For PDFs, ensure they're text-searchable (not scanned images)

## Next Steps

- Check the main [README.md](README.md) for full documentation
- Review API endpoints for integration
- Customize prompt templates in `backend/src/routes/generate.ts`

## Performance Tips

- Email generation takes 30-60 seconds (normal, waiting for Claude API)
- Keep candidate background to 500-1000 words for best results
- Use English or major languages for best generation quality

## Development

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm preview
```

### File Structure

- Backend: TypeScript + Express
- Frontend: React 18 + Vite + Tailwind CSS
- No database required (everything in memory)

Enjoy generating personalized recruitment emails!
