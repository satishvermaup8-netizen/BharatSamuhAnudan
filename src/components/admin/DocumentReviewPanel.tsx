/**
 * Admin Document Review Integration Examples
 * Shows how to use DocumentViewer for KYC and Claim document review
 */

import { useState } from 'react';
import { DocumentViewer, DocumentInfo } from './DocumentViewer';
import { FileText, Eye } from 'lucide-react';

/**
 * Example 1: KYC Document Review Panel
 */
export function KYCDocumentReviewPanel() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Mock KYC documents
  const kycDocuments = [
    {
      id: 'kyc_aadhaar_1',
      name: 'Aadhaar Card (Front) - User123.jpg',
      url: 'https://via.placeholder.com/800x600?text=Aadhaar+Front',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:30:00Z',
      uploadedBy: 'User123',
      status: 'pending' as const,
      documentType: 'Aadhaar Front',
    },
    {
      id: 'kyc_aadhaar_2',
      name: 'Aadhaar Card (Back) - User123.jpg',
      url: 'https://via.placeholder.com/800x600?text=Aadhaar+Back',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:30:00Z',
      uploadedBy: 'User123',
      status: 'verified' as const,
      documentType: 'Aadhaar Back',
    },
    {
      id: 'kyc_pan_1',
      name: 'PAN Card - User123.jpg',
      url: 'https://via.placeholder.com/800x600?text=PAN+Card',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:35:00Z',
      uploadedBy: 'User123',
      status: 'pending' as const,
      documentType: 'PAN Card',
    },
  ];

  const handleApproveDocument = async (docId: string) => {
    console.log('Approving document:', docId);
    // API call to approve document
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRejectDocument = async (docId: string, reason: string) => {
    console.log('Rejecting document:', docId, 'Reason:', reason);
    // API call to reject document
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const openViewer = (doc: any) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>KYC Documents</span>
        </h3>

        <div className="space-y-3">
          {kycDocuments.map((doc) => (
            <div key={doc.id}>
              <DocumentInfo
                status={doc.status}
                documentType={doc.documentType}
                uploadDate={doc.uploadedAt}
                onClick={() => openViewer(doc)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedDoc && (
        <DocumentViewer
          isOpen={viewerOpen}
          document={selectedDoc}
          documents={kycDocuments.map(d => ({
            id: d.id,
            name: d.name,
            url: d.url,
            type: d.type,
            uploadedAt: d.uploadedAt,
            uploadedBy: d.uploadedBy
          }))}
          onClose={() => setViewerOpen(false)}
          onApprove={handleApproveDocument}
          onReject={handleRejectDocument}
        />
      )}
    </div>
  );
}

/**
 * Example 2: Death Claim Document Review Panel
 */
export function DeathClaimDocumentReviewPanel() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Mock death claim documents
  const claimDocuments = [
    {
      id: 'claim_death_cert_1',
      name: 'Death Certificate - John Doe.pdf',
      url: 'https://via.placeholder.com/800x600?text=Death+Certificate',
      type: 'pdf' as const,
      uploadedAt: '2026-02-22T14:20:00Z',
      uploadedBy: 'Admin',
      status: 'pending' as const,
      documentType: 'Death Certificate',
    },
    {
      id: 'claim_nominee_id_1',
      name: 'Nominee Aadhaar - Jane Doe.jpg',
      url: 'https://via.placeholder.com/800x600?text=Nominee+ID',
      type: 'image' as const,
      uploadedAt: '2026-02-22T14:25:00Z',
      uploadedBy: 'Nominee',
      status: 'verified' as const,
      documentType: 'Nominee ID Proof',
    },
    {
      id: 'claim_bank_proof_1',
      name: 'Bank Statement - Jane Doe.pdf',
      url: 'https://via.placeholder.com/800x600?text=Bank+Statement',
      type: 'pdf' as const,
      uploadedAt: '2026-02-22T14:30:00Z',
      uploadedBy: 'Nominee',
      status: 'pending' as const,
      documentType: 'Bank Proof',
    },
  ];

  const handleApproveDocument = async (docId: string) => {
    console.log('Approving claim document:', docId);
    // API call to approve
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRejectDocument = async (docId: string, reason: string) => {
    console.log('Rejecting claim document:', docId, 'Reason:', reason);
    // API call to reject
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const openViewer = (doc: any) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Claim Documents</span>
        </h3>

        <div className="space-y-3">
          {claimDocuments.map((doc) => (
            <div key={doc.id}>
              <DocumentInfo
                status={doc.status}
                documentType={doc.documentType}
                uploadDate={doc.uploadedAt}
                onClick={() => openViewer(doc)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedDoc && (
        <DocumentViewer
          isOpen={viewerOpen}
          document={selectedDoc}
          documents={claimDocuments}
          onClose={() => setViewerOpen(false)}
          onApprove={handleApproveDocument}
          onReject={handleRejectDocument}
        />
      )}
    </div>
  );
}

/**
 * Example 3: Unified Document Review (KYC + Claims)
 */
export function UnifiedDocumentReviewPanel({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'kyc' | 'claims'>('kyc');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'kyc'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          KYC Documents
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'claims'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Claim Documents
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'kyc' ? (
          <KYCDocumentReviewPanel />
        ) : (
          <DeathClaimDocumentReviewPanel />
        )}
      </div>
    </div>
  );
}

/**
 * Example 4: Document Review Modal with Document Gallery
 */
export function DocumentGalleryView() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Combined documents
  const allDocuments = [
    {
      id: 'doc_1',
      name: 'Document 1.jpg',
      url: 'https://via.placeholder.com/800x600?text=Document+1',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:30:00Z',
      uploadedBy: 'User',
      status: 'pending' as const,
      documentType: 'KYC Document',
    },
    {
      id: 'doc_2',
      name: 'Document 2.jpg',
      url: 'https://via.placeholder.com/800x600?text=Document+2',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:35:00Z',
      uploadedBy: 'User',
      status: 'verified' as const,
      documentType: 'KYC Document',
    },
    {
      id: 'doc_3',
      name: 'Document 3.jpg',
      url: 'https://via.placeholder.com/800x600?text=Document+3',
      type: 'image' as const,
      uploadedAt: '2026-02-20T10:40:00Z',
      uploadedBy: 'User',
      status: 'rejected' as const,
      documentType: 'KYC Document',
    },
  ];

  const handleApprove = async (docId: string) => {
    console.log('Approved:', docId);
    // Update document status
  };

  const handleReject = async (docId: string, reason: string) => {
    console.log('Rejected:', docId, reason);
    // Update document status
  };

  const openViewer = (doc: any) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Gallery</h3>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <button
              onClick={() => openViewer(doc)}
              className="w-full h-40 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition group relative overflow-hidden"
            >
              {doc.type === 'image' ? (
                <img
                  src={doc.url}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              ) : (
                <FileText className="w-10 h-10 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
              </div>
            </button>

            {/* Info */}
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{doc.documentType}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    doc.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {doc.status === 'verified'
                    ? '✓ Verified'
                    : doc.status === 'rejected'
                    ? '✗ Rejected'
                    : '⏳ Pending'}
                </span>
              </div>
              <button
                onClick={() => openViewer(doc)}
                className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <DocumentViewer
          isOpen={viewerOpen}
          document={selectedDoc}
          documents={allDocuments}
          onClose={() => setViewerOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
