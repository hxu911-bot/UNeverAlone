import React from 'react';
import { EmailCard } from './EmailCard.js';
import { GeneratedEmail, GenerateResponse } from '../types/index.js';

interface GeneratedEmailsProps {
  data: GenerateResponse | null;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onTranslate?: (email: GeneratedEmail, targetLanguage: string) => void;
  isTranslating?: boolean;
}

export function GeneratedEmails({
  data,
  isLoading,
  onRegenerate,
  onTranslate,
  isTranslating
}: GeneratedEmailsProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Step 3: Generated Results</h2>

      {data.highlights && data.highlights.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-3">✨ Extracted Key Highlights:</h3>
          <div className="flex flex-wrap gap-2">
            {data.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="inline-block px-3 py-1 bg-white border border-amber-200 rounded-full text-sm text-amber-900 font-medium"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {data.emails.map((email, idx) => (
          <EmailCard
            key={idx}
            email={email}
            highlights={data.highlights}
            onTranslate={onTranslate}
            isTranslating={isTranslating}
          />
        ))}
      </div>

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          disabled={isLoading || isTranslating}
          className="w-full py-3 px-4 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          🔄 Regenerate
        </button>
      )}
    </div>
  );
}
