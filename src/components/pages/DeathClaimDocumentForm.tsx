import { useState } from 'react';
import { Heart, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

interface DeathClaimFormProps {
  groupId: string;
  onSubmit?: (claimData: any) => Promise<void>;
}

/**
 * Death Claim Document Upload Component
 * Demonstrates FileUpload integration for claim document submission
 */
export function DeathClaimDocumentForm({ groupId, onSubmit }: DeathClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Record<string, File[]>>({
    death_certificate: [],
    nominee_id_proof: [],
    bank_proof: [],
  });
  const [formData, setFormData] = useState({
    nomineeName: '',
    nomineeRelation: '',
    nomineeAccount: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Validate claim documents
  const validateClaimDocument = (file: File): string | null => {
    const maxSizeMB = 10;
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, Image, and Word documents are allowed';
    }

    // Additional check for file name
    if (file.name.includes('virus') || file.name.includes('malware')) {
      return 'Invalid file name detected';
    }

    return null;
  };

  const handleDocumentChange = (docType: string, files: File[]) => {
    setDocuments({ ...documents, [docType]: files });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.nomineeName || !formData.nomineeRelation) {
      alert('Please fill in nominee details');
      return;
    }

    if (
      documents.death_certificate.length === 0 ||
      documents.nominee_id_proof.length === 0
    ) {
      alert('Please upload death certificate and nominee ID proof');
      return;
    }

    setLoading(true);
    try {
      // Prepare claim data with documents
      const claimData = {
        groupId,
        nominee: {
          name: formData.nomineeName,
          relation: formData.nomineeRelation,
          bankAccount: formData.nomineeAccount,
        },
        documents: {
          death_certificate: documents.death_certificate[0],
          nominee_id_proof: documents.nominee_id_proof[0],
          bank_proof: documents.bank_proof[0],
        },
        notes: formData.notes,
      };

      if (onSubmit) {
        await onSubmit(claimData);
      }

      setSubmitted(true);
      alert('Death claim submitted successfully!');
    } catch (error: any) {
      alert(`Submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted</h2>
        <p className="text-gray-600 mb-6">
          Your death claim has been submitted successfully. You will receive updates via email.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-trust text-white rounded-lg hover:bg-trust-dark"
        >
          Submit Another Claim
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
          <Heart className="w-10 h-10 text-orange-600" />
          <span>Death Claim Submission</span>
        </h1>
        <p className="text-gray-600">
          Submit a death claim request with required documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nominee Details */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">
            Nominee Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomineeName"
                value={formData.nomineeName}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nomineeRelation"
                value={formData.nomineeRelation}
                onChange={handleInputChange}
                placeholder="e.g., Spouse, Child, Parent"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                name="nomineeAccount"
                value={formData.nomineeAccount}
                onChange={handleInputChange}
                placeholder="Account number for claim disbursement"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">
            Required Documents
          </h2>

          <div className="space-y-8">
            {/* Death Certificate */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Death Certificate <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Certified copy of death certificate from government authority
                </p>
              </div>
              <FileUpload
                label="Upload Death Certificate (PDF or Image)"
                accept=".pdf,image/jpeg,image/png"
                maxSizeMB={10}
                multiple={false}
                validate={validateClaimDocument}
                onFilesChange={(files) =>
                  handleDocumentChange('death_certificate', files)
                }
              />
            </div>

            {/* Nominee ID Proof */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Nominee ID Proof <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Aadhaar, Voter ID, Pan Card, or Driving License
                </p>
              </div>
              <FileUpload
                label="Upload ID Proof (PDF or Image)"
                accept=".pdf,image/jpeg,image/png"
                maxSizeMB={10}
                multiple={false}
                validate={validateClaimDocument}
                onFilesChange={(files) =>
                  handleDocumentChange('nominee_id_proof', files)
                }
              />
            </div>

            {/* Bank Proof */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Proof <span className="text-gray-500">(Optional)</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Bank statement or passbook showing account details
                </p>
              </div>
              <FileUpload
                label="Upload Bank Proof (PDF or Image)"
                accept=".pdf,image/jpeg,image/png"
                maxSizeMB={10}
                multiple={false}
                validate={validateClaimDocument}
                onFilesChange={(files) =>
                  handleDocumentChange('bank_proof', files)
                }
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Notes
          </h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional information or context..."
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Document Summary */}
        {Object.values(documents).some(docs => docs.length > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Documents Ready for Upload</span>
            </h3>
            <div className="space-y-2">
              {documents.death_certificate.length > 0 && (
                <p className="text-sm text-blue-800">
                  ✓ Death Certificate: {documents.death_certificate[0].name}
                </p>
              )}
              {documents.nominee_id_proof.length > 0 && (
                <p className="text-sm text-blue-800">
                  ✓ Nominee ID Proof: {documents.nominee_id_proof[0].name}
                </p>
              )}
              {documents.bank_proof.length > 0 && (
                <p className="text-sm text-blue-800">
                  ✓ Bank Proof: {documents.bank_proof[0].name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Submit Death Claim</span>
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> All submitted documents will be verified by our team. You
            will receive updates about the claim status via email within 2-3 business days.
          </p>
        </div>
      </form>
    </div>
  );
}
