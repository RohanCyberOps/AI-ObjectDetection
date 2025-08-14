import React, { useCallback } from 'react';
import { Upload, Image, Video } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedTypes,
  title,
  subtitle,
  icon
}) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => file.type.match(acceptedTypes));
    
    if (validFile) {
      onFileSelect(validFile);
    }
  }, [onFileSelect, acceptedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-gray-100"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-blue-100 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          <Upload className="w-4 h-4 inline mr-2" />
          Choose File
          <input
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;