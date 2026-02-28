/**
 * Example: Using FileUpload Component in KYC Submission
 * 
 * This file demonstrates how to integrate the FileUpload component
 * into document submission forms like KYC and death claims.
 */

import { useState } from 'react';
import { FileUpload } from './file-upload';
import { uploadKYCDocument } from '@/lib/api';

/**
 * Example 1: KYC Document Upload
 */
export function KYCDocumentUploadExample() {
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const validateKYCDocument = (file: File): string | null => {
    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB';
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and PDF files are allowed';
    }

    // File name validation
    if (file.name.length > 255) {
      return 'File name is too long';
    }

    return null;
  };

  const handleKYCFilesChange = async (files: File[]) => {
    setKycFiles(files);

    // Auto-upload files
    if (files.length > 0) {
      setUploading(true);
      try {
        for (const file of files) {
          await uploadKYCDocument('user-id', 'aadhaar_front', file);
        }
        console.log('Files uploaded successfully');
      } catch (error) {
        console.error('Upload failed:', error);
      }
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload KYC Documents</h3>
      <FileUpload
        label="Aadhaar Card (Front Side)"
        accept="image/jpeg,image/png,application/pdf"
        maxSizeMB={5}
        multiple={false}
        validate={validateKYCDocument}
        onFilesChange={handleKYCFilesChange}
      />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {kycFiles.length > 0 && (
        <p className="text-sm text-green-600">
          {kycFiles.length} file(s) selected and ready to upload
        </p>
      )}
    </div>
  );
}

/**
 * Example 2: Death Claim Document Upload
 */
export function DeathClaimDocumentUploadExample() {
  const [claimFiles, setClaimFiles] = useState<File[]>([]);

  const validateClaimDocument = (file: File): string | null => {
    // Only allow PDFs and images for claim documents
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, Image, and Word documents are allowed';
    }

    // Max 10MB for death certificates
    if (file.size > 10 * 1024 * 1024) {
      return 'File size exceeds 10MB';
    }

    return null;
  };

  const handleClaimFilesChange = (files: File[]) => {
    setClaimFiles(files);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Claim Documents</h3>
      <FileUpload
        label="Death Certificate / Nominee ID / Bank Proof"
        accept=".pdf,.doc,.docx,image/jpeg,image/png"
        maxSizeMB={10}
        multiple={true}
        validate={validateClaimDocument}
        onFilesChange={handleClaimFilesChange}
      />
      {claimFiles.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            {claimFiles.length} document(s) ready for submission
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 mt-2">
            {claimFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Generic Multi-file Upload
 */
export function MultiDocumentUploadExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload
      label="Upload Multiple Documents"
      accept=".pdf,image/*"
      maxSizeMB={15}
      multiple={true}
      onFilesChange={setFiles}
    />
  );
}
