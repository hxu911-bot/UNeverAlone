import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import { config } from '../config/env.js';

const router = Router();
const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

interface ExtractRequest extends Request {
  file?: Express.Multer.File;
  body: {
    text?: string;
  };
}

async function extractPdfText(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);
  return data.text;
}

async function extractWordText(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value;
}

async function extractImageText(filePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');
  const ext = path.extname(filePath).toLowerCase();
  let mediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  if (ext === '.png') mediaType = 'image/png';
  else if (ext === '.webp') mediaType = 'image/webp';

  const response = await client.messages.create({
    model: 'qwen-vl-plus',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${base64}`
            }
          },
          {
            type: 'text',
            text: 'Please extract all text from this image. Return only the extracted text, no explanations.'
          }
        ]
      }
    ]
  });

  const content = response.choices[0]?.message?.content || '';
  return typeof content === 'string' ? content : '';
}

router.post('/extract', async (req: ExtractRequest, res: Response) => {
  try {
    let extractedText = '';

    if (req.file) {
      const filePath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();

      try {
        if (ext === '.pdf') {
          extractedText = await extractPdfText(filePath);
        } else if (['.docx', '.doc'].includes(ext)) {
          extractedText = await extractWordText(filePath);
        } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          extractedText = await extractImageText(filePath);
        }
      } finally {
        // Clean up uploaded file
        fs.unlink(filePath, () => {});
      }
    } else if (req.body.text) {
      extractedText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No file or text provided' });
    }

    res.json({ extractedText });
  } catch (error) {
    console.error('Extract error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to extract text'
    });
  }
});

export default router;
