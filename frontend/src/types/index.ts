export type SenderRole = 'HR' | 'INTERVIEWER' | 'HIRING_MANAGER' | 'MANAGEMENT' | 'REFERRER';
export type EmailStyle = 'curiosity' | 'recognition' | 'challenge';

export interface GeneratedEmail {
  style: EmailStyle;
  subject: string;
  body: string;
}

export interface GenerateRequest {
  backgroundText: string;
  jobTitle: string;
  senderRole: SenderRole;
  targetLanguage: string;
  variants?: number;
}

export interface GenerateResponse {
  highlights: string[];
  emails: GeneratedEmail[];
}

export interface ExtractResponse {
  extractedText: string;
}
