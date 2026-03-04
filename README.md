# AI-Powered Recruitment Email Generator

Generate authentic, personalized recruitment emails that candidates actually want to read—not mass-produced templates.

## Vision

**The Problem**: Generic recruitment emails get ignored. Candidates can spot a template from a mile away.

**The Solution**: Upload a candidate's background → AI extracts key highlights → Generates 3 personalized emails in different styles, each referencing specific experiences from their background.

## Features

- 📄 **Multi-format File Support**: PDF, Word, Images (auto-extracts text using Claude Vision)
- 🤖 **AI-Powered Generation**: Uses Claude Sonnet to analyze backgrounds and generate emails
- 🎨 **3 Email Styles**:
  - Curiosity-driven: "I noticed you..."
  - Achievement recognition: "Your X impressed me..."
  - Challenge-based: "Here's an interesting problem..."
- 🌍 **Multilingual**: Generate emails in any language
- 📋 **Easy Copy/Paste**: Copy full email, subject, or body with one click

## Quick Start

### Prerequisites

- Node.js 18+
- `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com/)

### Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm run dev
# Runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Visit http://localhost:5173 in your browser.

## How It Works

### Step 1: Upload Background
- Drag & drop a PDF resume, Word document, or screenshot
- OR paste candidate info as text
- AI extracts the text automatically

### Step 2: Configure Email
- Enter job title
- Select sender role (HR, Interviewer, Manager, etc.)
- Choose output language

### Step 3: Generate & Copy
- AI generates 3 email variants
- Preview key highlights referenced in each email
- Copy any version or just the subject/body

## API Endpoints

### POST `/api/extract`
Extract text from files or text input.

```bash
# From file
curl -X POST http://localhost:3000/api/extract \
  -F "file=@resume.pdf"

# From text
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"text":"5 years backend experience..."}'
```

Response:
```json
{
  "extractedText": "5 years backend experience..."
}
```

### POST `/api/generate`
Generate personalized emails.

```json
{
  "backgroundText": "5 years backend...",
  "jobTitle": "Senior Backend Engineer",
  "senderRole": "HR",
  "targetLanguage": "en-US",
  "variants": 3
}
```

Response:
```json
{
  "highlights": [
    "5 years backend development",
    "Led payment system architecture redesign",
    "Google SRE experience"
  ],
  "emails": [
    {
      "style": "curiosity",
      "subject": "Your payment architecture work...",
      "body": "Hi [Name], I spent 20 minutes reading your background..."
    },
    ...
  ]
}
```

## Project Structure

```
recruitment-mailer/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server
│   │   ├── config/env.ts            # Config
│   │   ├── middleware/upload.ts     # File upload
│   │   └── routes/
│   │       ├── extract.ts           # Text extraction
│   │       └── generate.ts          # Email generation
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── api/client.ts            # Axios client
    │   ├── types/index.ts           # TypeScript types
    │   └── components/
    │       ├── BackgroundInput.tsx   # Step 1
    │       ├── FileDropzone.tsx      # File upload
    │       ├── SettingsPanel.tsx     # Step 2
    │       ├── GeneratedEmails.tsx   # Step 3
    │       └── EmailCard.tsx         # Email display
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Supported Formats

| Format | Support | Tool |
|--------|---------|------|
| PDF | ✅ | pdf-parse |
| Word (.docx) | ✅ | mammoth |
| Word (.doc) | ✅ | mammoth |
| JPG/PNG/WebP | ✅ | Claude Vision API |
| Plain text | ✅ | Direct input |

Max file size: 10MB

## Supported Languages

- Chinese (中文)
- English
- Japanese (日本語)
- Korean (한국어)
- French (Français)
- Spanish (Español)
- German (Deutsch)

## Performance

- File extraction: 1-5 seconds depending on size
- Email generation: 30-60 seconds (Claude API latency)
- Total time: ~1-2 minutes per candidate

## Troubleshooting

**"ANTHROPIC_API_KEY is required"**
- Make sure `.env` file exists in backend folder
- Verify your API key is correct

**"Failed to extract text"**
- Check file format is supported
- Ensure file is not corrupted
- PDFs must be text-searchable (not scanned images)

**"API connection failed"**
- Verify backend is running on port 3000
- Check frontend proxy in `vite.config.ts`
- Look for CORS errors in browser console

## Email Prompt Strategy

The system uses a two-step Claude approach:

1. **Highlight Extraction**: Analyze the background to find 3-5 most unique points
2. **Email Generation**: Generate 3 emails using those highlights as references

This ensures:
- Emails feel personal ("I read your background")
- Specific details are referenced
- Each version has a distinct style
- Tone is authentic, not templated

## Future Enhancements

- Email template library
- Send emails directly from app
- Track response rates
- Bulk candidate processing
- Custom prompt templates
- Save generated emails

## License

MIT

## Support

For issues or questions, check the docs or open an issue.

---

**Remember**: Great recruitment emails make candidates feel understood. This tool helps you do that at scale.
