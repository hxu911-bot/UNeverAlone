import React, { useState } from 'react';
import { BackgroundInput } from './components/BackgroundInput.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { GeneratedEmails } from './components/GeneratedEmails.js';
import { generateAPI } from './api/client.js';
import { GenerateResponse, SenderRole, GeneratedEmail } from './types/index.js';

export function App() {
  const [backgroundText, setBackgroundText] = useState('');
  const [generatedData, setGeneratedData] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleExtracted = (text: string) => {
    setBackgroundText(text);
    setError('');
  };

  const handleGenerate = async (
    jobTitle: string,
    senderRole: SenderRole,
    language: string
  ) => {
    if (!backgroundText.trim()) {
      setError('Please enter or upload candidate background information');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await generateAPI.emails({
        backgroundText,
        jobTitle,
        senderRole,
        targetLanguage: language,
        variants: 3
      });
      setGeneratedData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Email generation failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (email: GeneratedEmail, targetLanguage: string) => {
    if (!backgroundText.trim() || !generatedData) return;

    setIsTranslating(true);
    try {
      const response = await generateAPI.emails({
        backgroundText,
        jobTitle: 'Position',
        senderRole: 'HR',
        targetLanguage,
        variants: 1
      });
      setGeneratedData({
        ...generatedData,
        emails: response.emails
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Translation failed'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!generatedData) return;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI-Powered Recruitment Email Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Generate authentic, personalized emails candidates want to read
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <BackgroundInput onExtracted={handleExtracted} />

          {backgroundText && (
            <SettingsPanel
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          )}

          {generatedData && (
            <GeneratedEmails
              data={generatedData}
              isLoading={isLoading}
              isTranslating={isTranslating}
              onRegenerate={handleRegenerate}
              onTranslate={handleTranslate}
            />
          )}
        </div>

        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Good emails make candidates feel understood and respected, not mass-produced</p>
        </div>
      </div>
    </div>
  );
}
