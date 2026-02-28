import { useState, useEffect } from 'react';
import { FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { submitKYC, getKYCDocuments, uploadKYCDocument } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { FileUpload } from '@/components/ui/file-upload';

export function KYCSubmissionPageWithFileUpload() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankAccountHolder: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const docs = await getKYCDocuments(user!.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate KYC documents
  const validateKYCFile = (file: File): string | null => {
    const maxSizeMB = 5;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and PDF files are allowed';
    }

    return null;
  };

  // Handle file selection for KYC documents
  const handleKYCFilesChange = async (docType: string, files: File[]) => {
    setUploadedFiles({ ...uploadedFiles, [docType]: files });

    // Auto-upload files
    if (files.length > 0 && user) {
      setLoading(true);
      try {
        for (const file of files) {
          await uploadKYCDocument(user.id, docType, file);
        }
        await loadDocuments();
      } catch (error: any) {
        alert(`Upload failed: ${error.message}`);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.aadhaarNumber || !formData.panNumber) {
      alert('Please enter Aadhaar and PAN numbers');
      return;
    }

    setLoading(true);
    try {
      await submitKYC(formData);
      alert('KYC submitted successfully! Please wait for verification.');
    } catch (error: any) {
      alert(`KYC submission failed: ${error.message}`);
    }
    setLoading(false);
  };

  const getDocumentStatus = (type: string) => {
    const doc = documents.find(d => d.document_type === type);
    return doc ? doc.upload_status : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <FileCheck className="w-10 h-10 text-trust" />
            <span>KYC Verification</span>
          </h1>
          <p className="text-gray-600">Submit KYC details to verify your identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Personal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  maxLength={12}
                  placeholder="1234 5678 9012"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent uppercase"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Bank Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="bankIfsc"
                  value={formData.bankIfsc}
                  onChange={handleInputChange}
                  maxLength={11}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent uppercase"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="bankAccountHolder"
                  value={formData.bankAccountHolder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Uploads using FileUpload Component */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">Document Upload</h2>

            <div className="space-y-8">
              {[
                { key: 'aadhaar_front', label: 'Aadhaar Card (Front)' },
                { key: 'aadhaar_back', label: 'Aadhaar Card (Back)' },
                { key: 'pan_card', label: 'PAN Card' },
                { key: 'bank_statement', label: 'Bank Statement' },
                { key: 'photo', label: 'Passport Photo' },
              ].map((doc) => {
                const status = getDocumentStatus(doc.key);
                return (
                  <div key={doc.key}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">{doc.label}</label>
                      {status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status === 'verified' ? 'bg-green-100 text-green-800' :
                          status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status === 'verified' ? '✓ Verified' : 
                           status === 'rejected' ? '✗ Rejected' : 
                           '⏳ Pending'}
                        </span>
                      )}
                    </div>
                    <FileUpload
                      label={`Select ${doc.label}`}
                      accept="image/jpeg,image/png,application/pdf"
                      maxSizeMB={5}
                      multiple={false}
                      validate={validateKYCFile}
                      onFilesChange={(files) => handleKYCFilesChange(doc.key, files)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit KYC</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
