import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GeneratedEmail, EmailStyle } from '../types/index.js';

interface EmailCardProps {
  email: GeneratedEmail;
  highlights: string[];
  onTranslate?: (email: GeneratedEmail, targetLanguage: string) => void;
  isTranslating?: boolean;
}

const styleLabels: Record<EmailStyle, string> = {
  curiosity: 'Curiosity-Driven',
  recognition: 'Achievement Recognition',
  challenge: 'Challenge-Based'
};

export function EmailCard({
  email,
  highlights,
  onTranslate,
  isTranslating
}: EmailCardProps) {
  const [copiedState, setCopiedState] = useState<'full' | 'subject' | 'body' | null>(null);

  const copyToClipboard = (text: string, type: 'full' | 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const fullEmail = `${email.subject}\n\n${email.body}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {styleLabels[email.style]}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
        {email.subject}
      </h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {email.body}
        </p>
      </div>

      {highlights.length > 0 && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-medium text-amber-900 mb-2">Referenced Candidate Highlights:</p>
          <div className="text-xs text-amber-800 space-y-1">
            {highlights.slice(0, 2).map((highlight, idx) => (
              <p key={idx}>• {highlight}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => copyToClipboard(fullEmail, 'full')}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors"
        >
          {copiedState === 'full' ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied Full Email
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Full Email
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => copyToClipboard(email.subject, 'subject')}
            className="flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium text-blue-700 transition-colors"
          >
            {copiedState === 'subject' ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Subject
              </>
            )}
          </button>

          <button
            onClick={() => copyToClipboard(email.body, 'body')}
            className="flex items-center justify-center gap-1 py-2 px-3 bg-green-50 hover:bg-green-100 rounded text-xs font-medium text-green-700 transition-colors"
          >
            {copiedState === 'body' ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Body
              </>
            )}
          </button>
        </div>

        {onTranslate && (
          <button
            onClick={() => onTranslate(email, 'en-US')}
            disabled={isTranslating}
            className="py-2 px-3 bg-purple-50 hover:bg-purple-100 rounded text-sm font-medium text-purple-700 transition-colors disabled:opacity-50"
          >
            Translate to English
          </button>
        )}
      </div>
    </div>
  );
}
