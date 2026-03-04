import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function FileDropzone({ onFileSelected, isLoading }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDragLeave}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isLoading && fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-sky-500 bg-sky-50 shadow-md'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
        disabled={isLoading}
        className="hidden"
      />

      <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-sky-500' : 'text-gray-400'}`} />
      <p className="text-base font-medium text-gray-900 mb-1">
        {isLoading ? '⏳ Processing...' : '📁 Drag & drop your file here'}
      </p>
      <p className="text-sm text-gray-600 mb-2">or click to browse</p>
      <p className="text-xs text-gray-500">
        PDF • Word (.docx/.doc) • Images (.jpg/.png/.webp) • Max 10MB
      </p>
    </div>
  );
}
