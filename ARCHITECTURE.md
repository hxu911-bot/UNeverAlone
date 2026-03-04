# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React 18 Frontend)                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Step 1: File Upload / Text Input                 │  │
│  │ → FileDropzone.tsx / BackgroundInput.tsx          │  │
│  └──────────────────┬────────────────────────────────┘  │
│                     │ extractedText                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Step 2: Settings (Job Title, Role, Language)     │ │
│  │ → SettingsPanel.tsx                               │ │
│  └──────────────────┬────────────────────────────────┘ │
│                     │ generateRequest                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Step 3: Display Results                           │ │
│  │ → GeneratedEmails.tsx / EmailCard.tsx             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                     ↑ API calls (axios)
                     ↓
                  Vite Dev Server
                  (Proxies /api to port 3000)
                     
┌─────────────────────────────────────────────────────────┐
│  Express Backend (Node.js)                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │ POST /api/extract                                 │  │
│  │ ├─ Multer file upload                             │  │
│  │ ├─ pdf-parse for .pdf                             │  │
│  │ ├─ mammoth for .docx/.doc                         │  │
│  │ ├─ Claude Vision API for images                   │  │
│  │ └─ Return: { extractedText }                      │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ POST /api/generate                                │  │
│  │ ├─ Extract highlights (Claude)                    │  │
│  │ ├─ Generate 3 email variants (Claude)             │  │
│  │ └─ Return: { highlights[], emails[] }             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                     ↑ HTTPS calls
                     ↓
         Anthropic Claude API (claude-sonnet-4-6)
```

## Data Flow

### Flow 1: File Extraction

```
User uploads file
    ↓
Multer saves to /tmp/uploads
    ↓
Backend detects file type (.pdf, .docx, .jpg, etc)
    ↓
├─ PDF: pdf-parse.parse(buffer)
├─ Word: mammoth.extractRawText(buffer)
└─ Image: Claude Vision API (base64 → text)
    ↓
Return extractedText
    ↓
Frontend displays preview
```

### Flow 2: Email Generation

```
User clicks "Generate"
    ↓
Frontend sends:
  {
    backgroundText: "...",
    jobTitle: "Senior Backend Engineer",
    senderRole: "HR",
    targetLanguage: "en-US"
  }
    ↓
Backend Step A: Extract Highlights
  Claude Prompt: "Extract 3-5 unique highlights from this background"
  Returns: ["5 years backend", "Led payment system redesign", ...]
    ↓
Backend Step B: Generate Emails
  Claude Prompt: "Generate 3 emails in these styles: curiosity, recognition, challenge"
  Uses highlights as context
  Returns JSON with 3 email objects
    ↓
Frontend displays:
  - Key highlights box
  - 3 email cards side-by-side
  - Copy buttons for each variant
```

## Component Hierarchy

```
App.tsx (State manager)
├── BackgroundInput.tsx (Step 1)
│   ├── FileDropzone.tsx
│   └── Tab switcher (File/Text mode)
├── SettingsPanel.tsx (Step 2)
│   ├── Job title input
│   ├── Sender role buttons
│   └── Language dropdown
└── GeneratedEmails.tsx (Step 3)
    ├── Highlights box
    └── EmailCard.tsx × 3
        ├── Subject display
        ├── Body display
        ├── Referenced highlights
        └── Copy buttons
```

## State Management

### Frontend (React Hooks)
- `backgroundText` - extracted candidate background
- `generatedData` - API response (highlights + emails)
- `isLoading` - during API calls
- `error` - error messages

No external state manager needed (small app scope).

### Backend
- No database (stateless)
- Request ↔ Response pattern
- Each request is independent

## API Contract

### POST /api/extract

**Request (multipart/form-data):**
```
file: File (optional)
text: string (optional)
```

**Response:**
```json
{
  "extractedText": "string (1000-10000 chars typical)"
}
```

**Error:**
```json
{
  "error": "No file or text provided"
}
```

### POST /api/generate

**Request (application/json):**
```json
{
  "backgroundText": "string (min 100 chars)",
  "jobTitle": "string (required)",
  "senderRole": "HR|INTERVIEWER|HIRING_MANAGER|MANAGEMENT|REFERRER",
  "targetLanguage": "en-US|zh-CN|ja-JP|etc",
  "variants": 3
}
```

**Response:**
```json
{
  "highlights": ["highlight1", "highlight2", ...],
  "emails": [
    {
      "style": "curiosity|recognition|challenge",
      "subject": "string",
      "body": "string (300-400 words)"
    },
    ...
  ]
}
```

**Error:**
```json
{
  "error": "Missing required fields or API error"
}
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| File upload | < 1s | Local file handling |
| PDF extraction | 1-3s | Depends on file size |
| Image OCR | 2-5s | Claude Vision API |
| Highlight extraction | 10-20s | Claude API call #1 |
| Email generation | 20-40s | Claude API call #2 |
| **Total** | **30-60s** | Typical for full flow |

## Error Handling

### Frontend
- Network errors → display "API connection failed"
- Validation errors → highlight fields in red
- API errors → show message from server

### Backend
- Invalid file type → 400 with error message
- API key missing → 500 at startup
- Claude API errors → 500 with error details
- Multer errors → 413 for file size exceeded

## Security Considerations

- **API Key**: Stored in .env (backend only, never exposed to client)
- **File Upload**: Validated by type + size (10MB max)
- **User Input**: No XSS risk (React auto-escapes)
- **File Cleanup**: Uploaded files deleted after processing
- **CORS**: Enabled for localhost development

## Scalability Limitations

Current implementation is designed for:
- Single user per instance
- Single file processing at a time
- No data persistence
- No authentication

For production:
- Add database for email history
- Implement user authentication
- Add job queue for background processing
- Cache Claude responses
- Rate limiting per user

## Dependencies

### Backend
- `@anthropic-ai/sdk` - Claude API client
- `express` - Web framework
- `cors` - CORS middleware
- `multer` - File upload
- `pdf-parse` - PDF text extraction
- `mammoth` - Word document parsing

### Frontend
- `react` - UI framework
- `vite` - Build tool
- `axios` - HTTP client
- `lucide-react` - Icons
- `tailwindcss` - CSS framework

## File Organization

```
backend/
├── src/
│   ├── index.ts              # Express setup, middleware, routes
│   ├── config/env.ts         # Config from .env
│   ├── middleware/upload.ts  # Multer storage config
│   └── routes/
│       ├── extract.ts        # POST /api/extract handler
│       └── generate.ts       # POST /api/generate handler
└── dist/                     # Compiled JS (after build)

frontend/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Main component & state
│   ├── api/client.ts         # Axios instances
│   ├── types/index.ts        # TypeScript interfaces
│   └── components/           # React components
└── dist/                     # Built files (after build)
```
