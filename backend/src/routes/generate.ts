import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { config } from '../config/env.js';

const router = Router();
const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});

type SenderRole = 'HR' | 'INTERVIEWER' | 'HIRING_MANAGER' | 'MANAGEMENT' | 'REFERRER';
type EmailStyle = 'curiosity' | 'recognition' | 'challenge';

interface GenerateRequest extends Request {
  body: {
    backgroundText: string;
    jobTitle: string;
    senderRole: SenderRole;
    targetLanguage: string;
    variants?: number;
  };
}

interface GeneratedEmail {
  style: EmailStyle;
  subject: string;
  body: string;
}

interface GenerateResponse {
  highlights: string[];
  emails: GeneratedEmail[];
}

const senderRoleDescriptions: Record<SenderRole, string> = {
  HR: 'HR 部门',
  INTERVIEWER: '面试官',
  HIRING_MANAGER: '用人经理',
  MANAGEMENT: '领导/管理层',
  REFERRER: '内推人'
};

async function extractHighlights(backgroundText: string): Promise<string[]> {
  const response = await client.messages.create({
    model: 'qwen-plus',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `从以下候选人背景中提取3-5个最独特和令人印象深刻的亮点。用中文列出，每行一个，不加序号或符号。

候选人背景：
${backgroundText}

只返回亮点列表，不要其他内容。`
      }
    ]
  });

  const content = response.choices[0]?.message?.content || '';
  if (typeof content !== 'string') return [];

  const highlights = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return highlights;
}

async function generateEmails(
  highlights: string[],
  backgroundText: string,
  jobTitle: string,
  senderRole: SenderRole,
  language: string
): Promise<GeneratedEmail[]> {
  const roleDesc = senderRoleDescriptions[senderRole];

  const prompt = `你是一位顶级招聘文案专家。你写的邮件让候选人感到被真正了解和尊重，而不是群发模版。

候选人的关键亮点：
${highlights.map((h) => `- ${h}`).join('\n')}

招聘职位：${jobTitle}
发件人角色：${roleDesc}
输出语言：${language}

请生成3封风格各异的招聘邮件（每封包括标题和正文），分别是：
1. curiosity（好奇心驱动型）：标题让候选人想知道发件人看到了什么
2. recognition（成就认可型）：真诚认可候选人某项具体成就
3. challenge（挑战邀约型）：以一个有趣的挑战或问题开头

要求：
- 禁止使用"机会"、"职位"、"招募"等常见词汇作为标题
- 正文必须引用至少一个候选人的具体亮点
- 保持语气真诚自然，不像模版
- 结尾用具体、低门槛的方式邀请对话（不要"期待您的回复"）
- 邮件长度：300-400字

请以以下JSON格式返回：
{
  "emails": [
    {
      "style": "curiosity",
      "subject": "标题",
      "body": "正文"
    },
    {
      "style": "recognition",
      "subject": "标题",
      "body": "正文"
    },
    {
      "style": "challenge",
      "subject": "标题",
      "body": "正文"
    }
  ]
}

只返回JSON，不要其他内容。`;

  const response = await client.messages.create({
    model: 'qwen-plus',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = response.choices[0]?.message?.content || '';
  if (typeof content !== 'string') return [];

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.emails || [];
  } catch (error) {
    console.error('Failed to parse email generation response:', error);
    return [];
  }
}

router.post('/generate', async (req: GenerateRequest, res: Response) => {
  try {
    const { backgroundText, jobTitle, senderRole, targetLanguage, variants = 3 } = req.body;

    if (!backgroundText || !jobTitle || !senderRole || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields: backgroundText, jobTitle, senderRole, targetLanguage'
      });
    }

    // Extract highlights
    const highlights = await extractHighlights(backgroundText);

    if (highlights.length === 0) {
      return res.status(400).json({
        error: 'Failed to extract highlights from background text'
      });
    }

    // Generate emails
    const emails = await generateEmails(highlights, backgroundText, jobTitle, senderRole, targetLanguage);

    if (emails.length === 0) {
      return res.status(500).json({
        error: 'Failed to generate emails'
      });
    }

    const response: GenerateResponse = {
      highlights,
      emails
    };

    res.json(response);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate emails'
    });
  }
});

export default router;
