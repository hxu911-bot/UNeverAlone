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
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
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

      <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p className="text-sm text-gray-600">
        {isLoading ? 'Processing...' : 'Drag file here or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Supported: PDF, Word, JPG, PNG, WebP (max 10MB)
      </p>
    </div>
  );
}
