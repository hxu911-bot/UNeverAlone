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

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => { setMode('file'); setError(''); }}
          className={`pb-2 px-4 font-medium transition-colors ${
            mode === 'file'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => { setMode('text'); setError(''); }}
          className={`pb-2 px-4 font-medium transition-colors ${
            mode === 'text'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Text Description
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
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleTextSubmit}
            disabled={isLoading || !textInput.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : 'Use This Background'}
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
