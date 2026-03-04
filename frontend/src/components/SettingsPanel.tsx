import React, { useState } from 'react';
import { SenderRole } from '../types/index.js';
import { AlertCircle } from 'lucide-react';

interface SettingsPanelProps {
  onGenerate: (jobTitle: string, senderRole: SenderRole, language: string) => void;
  isLoading?: boolean;
}

const senderRoles: { value: SenderRole; label: string }[] = [
  { value: 'HR', label: 'HR' },
  { value: 'INTERVIEWER', label: 'Interviewer' },
  { value: 'HIRING_MANAGER', label: 'Hiring Manager' },
  { value: 'MANAGEMENT', label: 'Manager' },
  { value: 'REFERRER', label: 'Referrer' }
];

const languages = [
  { value: 'zh-CN', label: 'Chinese' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'fr-FR', label: 'French' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'de-DE', label: 'German' }
];

export function SettingsPanel({ onGenerate, isLoading }: SettingsPanelProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [senderRole, setSenderRole] = useState<SenderRole>('HR');
  const [language, setLanguage] = useState('en-US');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }
    setError('');
    onGenerate(jobTitle, senderRole, language);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Step 2: Email Settings</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g.: Senior Backend Engineer"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Sender Role
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {senderRoles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSenderRole(role.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  senderRole === role.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Output Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !jobTitle.trim()}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating (30-60s)...' : 'Generate Personalized Emails'}
        </button>
      </div>
    </div>
  );
}
