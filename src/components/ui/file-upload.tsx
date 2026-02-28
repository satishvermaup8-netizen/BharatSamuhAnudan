import React, { useRef, useState } from 'react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  validate?: (file: File) => string | null;
}

const defaultValidate = (file: File, maxSizeMB?: number, accept?: string): string | null => {
  if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeMB}MB.`;
  }
  if (accept && !accept.split(',').some(type => file.type.includes(type.trim()))) {
    return `File type not allowed.`;
  }
  return null;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload files',
  accept = '',
  maxSizeMB = 5,
  multiple = false,
  onFilesChange,
  validate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState<number[]>([]);

  const handleFiles = (selectedFiles: FileList | File[]) => {
    const fileArr = Array.from(selectedFiles);
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    fileArr.forEach(file => {
      const error = (validate ? validate(file) : defaultValidate(file, maxSizeMB, accept));
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });
    setErrors(newErrors);
    setFiles(validFiles);
    setProgress(validFiles.map(() => 0));
    if (onFilesChange) onFilesChange(validFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Simulate upload progress
  React.useEffect(() => {
    if (files.length === 0) return;
    setProgress(files.map(() => 0));
    const intervals = files.map((_, idx) => setInterval(() => {
      setProgress(prev => {
        const next = [...prev];
        next[idx] = Math.min(100, next[idx] + Math.random() * 20);
        return next;
      });
    }, 500));
    return () => intervals.forEach(clearInterval);
  }, [files]);

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
        />
        <p className="text-gray-500">Drag & drop files here, or click to select</p>
      </div>
      {errors.length > 0 && (
        <ul className="mt-2 text-sm text-red-600">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}
      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          {files.map((file, idx) => (
            <div key={file.name} className="flex items-center space-x-4">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-xs text-gray-500">{file.name.split('.').pop()?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-700">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress[idx]}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
