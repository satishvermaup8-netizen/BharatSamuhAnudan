import { useState, useEffect } from 'react';
import { FileCheck, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { submitKYC, getKYCDocuments, uploadKYCDocument } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export function KYCSubmissionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
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
    try {
      await uploadKYCDocument(user.id, type, file);
      alert(`${type} सफलतापूर्वक अपलोड किया गया`);
      setFiles({ ...files, [type]: null });
      await loadDocuments();
    } catch (error: any) {
      alert(`अपलोड विफल: ${error.message}`);
    }
    setLoading(false);
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
                { key: 'aadhaar_front', label: 'आधार कार्ड (सामने)' },
                { key: 'aadhaar_back', label: 'आधार कार्ड (पीछे)' },
                { key: 'pan_card', label: 'पैन कार्ड' },
                { key: 'bank_statement', label: 'बैंक स्टेटमेंट' },
                { key: 'photo', label: 'पासपोर्ट फोटो' },
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
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                        className="flex-1 text-sm"
                      />
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
