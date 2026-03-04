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

  // Determine current step
  const currentStep = generatedData ? 3 : backgroundText ? 2 : 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">✉️</span>
          <h1 className="text-xl font-bold text-gray-900">
            AI Recruitment Email Generator
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    step < currentStep
                      ? 'bg-green-500 text-white'
                      : step === currentStep
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>{error}</div>
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center text-gray-600 text-sm">
          <p className="text-gray-700 font-medium mb-1">💡 Pro tip</p>
          <p>Good emails make candidates feel understood and valued, not mass-produced</p>
        </div>
      </footer>
    </div>
  );
}
