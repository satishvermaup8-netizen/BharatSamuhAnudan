import { useState, useEffect } from 'react';
import { FileCheck, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { submitKYC, getKYCDocuments, uploadKYCDocument, uploadToS3 } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';

export function KYCSubmissionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});
  const [formData, setFormData] = useState<{
    aadhaarNumber: string;
    panNumber: string;
    bankAccountNumber: string;
    bankIfsc: string;
    bankAccountHolder: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    aadhaar_frontKey?: string;
    aadhaar_backKey?: string;
  }>({
    aadhaarNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankAccountHolder: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar_frontKey: '',
    aadhaar_backKey: '',
  });
  const [files, setFiles] = useState<Record<string, File | null>>({
    aadhaar_front: null,
    aadhaar_back: null,
    pan_card: null,
    bank_statement: null,
    photo: null,
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

  const handleFileChange = (type: string, file: File | null) => {
    setFiles({ ...files, [type]: file });
  };

  const handleFileUpload = async (type: string) => {
    const file = files[type];
    if (!file || !user) return;

    setLoading(true);
    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    try {
      // Use S3 upload for aadhaar documents
      if (type === 'aadhaar_front' || type === 'aadhaar_back') {
        const result = await uploadToS3(type, file);
        toast({
          title: 'Upload Successful',
          description: `${type} सफलतापूर्वक अपलोड किया गया (S3)`,
        });
        // Batch state updates for consistency
        const keyField = type === 'aadhaar_front' ? 'aadhaar_frontKey' : 'aadhaar_backKey';
        setFormData(prev => ({ ...prev, [keyField]: result.data.key }));
        setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      } else {
        await uploadKYCDocument(user.id, type, file);
        toast({
          title: 'Upload Successful',
          description: `${type} सफलतापूर्वक अपलोड किया गया`,
        });
        setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
      }
      setFiles(prev => ({ ...prev, [type]: null }));
      await loadDocuments();
    } catch (error: any) {
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
      toast({
        title: 'Upload Failed',
        description: `अपलोड विफल: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.aadhaarNumber || !formData.panNumber) {
      alert('कृपया आधार और पैन नंबर दर्ज करें');
      return;
    }

    setLoading(true);
    try {
      await submitKYC(formData);
      alert('KYC सफलतापूर्वक प्रस्तुत किया गया! समीक्षा के लिए प्रतीक्षा करें।');
    } catch (error: any) {
      alert(`KYC सबमिशन विफल: ${error.message}`);
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
            <span>KYC सत्यापन</span>
          </h1>
          <p className="text-gray-600">अपनी पहचान सत्यापित करने के लिए KYC विवरण जमा करें</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">व्यक्तिगत विवरण</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  आधार नंबर <span className="text-red-500">*</span>
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
                  पैन नंबर <span className="text-red-500">*</span>
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
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">बैंक विवरण</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">खाता संख्या</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC कोड</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">खाताधारक का नाम</label>
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
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">पता</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">पूरा पता</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">शहर</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">राज्य</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">पिनकोड</label>
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

          {/* Document Uploads */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading mb-6">दस्तावेज़ अपलोड</h2>

            <div className="space-y-4">
              {[
                { key: 'aadhaar_front', label: 'आधार कार्ड (सामने)', useFileUpload: true },
                { key: 'aadhaar_back', label: 'आधार कार्ड (पीछे)', useFileUpload: true },
                { key: 'pan_card', label: 'पैन कार्ड', useFileUpload: false },
                { key: 'bank_statement', label: 'बैंक स्टेटमेंट', useFileUpload: false },
                { key: 'photo', label: 'पासपोर्ट फोटो', useFileUpload: false },
              ].map((doc) => {
                const status = getDocumentStatus(doc.key);
                return (
                  <div key={doc.key} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">{doc.label}</label>
                      {status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status === 'verified' ? 'bg-green-100 text-green-800' :
                          status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {doc.useFileUpload ? (
                        <div className="flex-1">
                          <FileUpload
                            label=""
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                            maxSizeMB={5}
                            onFilesChange={(selectedFiles) => {
                              if (selectedFiles.length > 0) {
                                handleFileChange(doc.key, selectedFiles[0]);
                              }
                            }}
                            validate={(file) => {
                              if (file.size > 5 * 1024 * 1024) {
                                return 'File size exceeds 5MB limit';
                              }
                              if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
                                return 'Only JPEG, PNG images and PDF files are allowed';
                              }
                              return null;
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                          className="flex-1 text-sm"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleFileUpload(doc.key)}
                        disabled={!files[doc.key] || loading}
                        className="px-4 py-2 bg-trust text-white rounded-lg hover:bg-trust-dark disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>अपलोड</span>
                      </button>
                    </div>
                    {(doc.key === 'aadhaar_front' ? formData.aadhaar_frontKey : doc.key === 'aadhaar_back' ? formData.aadhaar_backKey : undefined) && uploadStatus[doc.key] === 'success' && (
                      <div className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Uploaded to cloud storage</span>
                      </div>
                    )}
                    {uploadStatus[doc.key] === 'uploading' && (
                      <div className="mt-2 text-sm text-blue-600 flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    )}
                    {uploadStatus[doc.key] === 'error' && (
                      <div className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Upload failed. Please try again.</span>
                      </div>
                    )}
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
                <span>सबमिट हो रहा है...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>KYC सबमिट करें</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
