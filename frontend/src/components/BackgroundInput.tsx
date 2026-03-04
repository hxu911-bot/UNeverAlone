import React, { useState } from 'react';
import { FileDropzone } from './FileDropzone.js';
import { extractAPI } from '../api/client.js';
import { AlertCircle } from 'lucide-react';

interface BackgroundInputProps {
  onExtracted: (text: string) => void;
}

export function BackgroundInput({ onExtracted }: BackgroundInputProps) {
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [textInput, setTextInput] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleFileSelected = async (file: File) => {
    setError('');
    setIsLoading(true);
    try {
      const result = await extractAPI.fromFile(file);
      setExtractedText(result.extractedText);
      onExtracted(result.extractedText);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'File processing failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError('Please enter candidate background information');
      return;
    }
    setError('');
    setExtractedText(textInput);
    onExtracted(textInput);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Step 1: Candidate Background Input</h2>

      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setMode('file'); setError(''); }}
          className={`pb-2 px-4 font-medium transition-colors rounded-md ${
            mode === 'file'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 Upload File
        </button>
        <button
          onClick={() => { setMode('text'); setError(''); }}
          className={`pb-2 px-4 font-medium transition-colors rounded-md ${
            mode === 'text'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✏️ Text Input
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {mode === 'file' && (
        <div>
          <FileDropzone onFileSelected={handleFileSelected} isLoading={isLoading} />
        </div>
      )}

      {mode === 'text' && (
        <div className="space-y-3">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="E.g.: Senior backend engineer with 5 years experience, ex-Google SRE, led payment system architecture redesign..."
            className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
          <button
            onClick={handleTextSubmit}
            disabled={isLoading || !textInput.trim()}
            className="w-full bg-sky-500 text-white py-3 rounded-lg font-bold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Processing...' : '✓ Use This Background'}
          </button>
        </div>
      )}

      {extractedText && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-900">Extracted Background:</h3>
          <div className="max-h-40 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
}
