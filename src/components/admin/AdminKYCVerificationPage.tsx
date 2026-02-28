/**
 * Admin KYC Verification Page with Document Viewer
 * Complete example of admin reviewing user KYC documents
 */

import { useState, useEffect } from 'react';
import { FileCheck, AlertCircle, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DocumentViewer, DocumentInfo } from '@/components/admin/DocumentViewer';

interface KYCUser {
  id: string;
  username: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf';
    documentType: string;
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    uploadedAt: string;
    uploadedBy: string;
  }[];
}

export function AdminKYCVerificationPage() {
  const [users, setUsers] = useState<KYCUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<KYCUser | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>(
    'pending'
  );

  // Mock load KYC users
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          id: 'user_1',
          username: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          submittedAt: '2026-02-20T10:30:00Z',
          status: 'pending',
          documents: [
            {
              id: 'kyc_1_aadhaar_1',
              name: 'Aadhaar Front.jpg',
              url: 'https://via.placeholder.com/800x600?text=Aadhaar+Front',
              type: 'image',
              documentType: 'Aadhaar Front',
              status: 'pending',
              uploadedAt: '2026-02-20T10:30:00Z',
              uploadedBy: 'Rajesh Kumar',
            },
            {
              id: 'kyc_1_aadhaar_2',
              name: 'Aadhaar Back.jpg',
              url: 'https://via.placeholder.com/800x600?text=Aadhaar+Back',
              type: 'image',
              documentType: 'Aadhaar Back',
              status: 'verified',
              uploadedAt: '2026-02-20T10:30:00Z',
              uploadedBy: 'Rajesh Kumar',
            },
            {
              id: 'kyc_1_pan',
              name: 'PAN Card.jpg',
              url: 'https://via.placeholder.com/800x600?text=PAN+Card',
              type: 'image',
              documentType: 'PAN Card',
              status: 'pending',
              uploadedAt: '2026-02-20T10:35:00Z',
              uploadedBy: 'Rajesh Kumar',
            },
          ],
        },
        {
          id: 'user_2',
          username: 'Priya Singh',
          email: 'priya@example.com',
          submittedAt: '2026-02-21T14:20:00Z',
          status: 'verified',
          documents: [
            {
              id: 'kyc_2_aadhaar_1',
              name: 'Aadhaar Front.jpg',
              url: 'https://via.placeholder.com/800x600?text=Aadhaar+Front',
              type: 'image',
              documentType: 'Aadhaar Front',
              status: 'verified',
              uploadedAt: '2026-02-21T14:20:00Z',
              uploadedBy: 'Priya Singh',
            },
            {
              id: 'kyc_2_aadhaar_2',
              name: 'Aadhaar Back.jpg',
              url: 'https://via.placeholder.com/800x600?text=Aadhaar+Back',
              type: 'image',
              documentType: 'Aadhaar Back',
              status: 'verified',
              uploadedAt: '2026-02-21T14:20:00Z',
              uploadedBy: 'Priya Singh',
            },
          ],
        },
        {
          id: 'user_3',
          username: 'Amit Patel',
          email: 'amit@example.com',
          submittedAt: '2026-02-19T09:15:00Z',
          status: 'rejected',
          documents: [
            {
              id: 'kyc_3_aadhaar_1',
              name: 'Aadhaar Front.jpg',
              url: 'https://via.placeholder.com/800x600?text=Aadhaar+Front',
              type: 'image',
              documentType: 'Aadhaar Front',
              status: 'rejected',
              uploadedAt: '2026-02-19T09:15:00Z',
              uploadedBy: 'Amit Patel',
            },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'all') return true;
    return user.status === filterStatus;
  });

  const handleApproveDocument = async (docId: string) => {
    console.log('Approving document:', docId);
    // Update document status
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        documents: selectedUser.documents.map(d =>
          d.id === docId ? { ...d, status: 'verified' as const } : d
        ),
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRejectDocument = async (docId: string, reason: string) => {
    console.log('Rejecting document:', docId, 'Reason:', reason);
    // Update document status
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        documents: selectedUser.documents.map(d =>
          d.id === docId ? { ...d, status: 'rejected' as const } : d
        ),
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const openDocumentViewer = (doc: any) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <FileCheck className="w-10 h-10 text-blue-600" />
            <span>KYC Verification</span>
          </h1>
          <p className="text-gray-600">Review and verify user KYC documents</p>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all'
                ? 'All'
                : status === 'pending'
                ? 'Pending'
                : status === 'verified'
                ? 'Verified'
                : 'Rejected'}
              {status !== 'all' && (
                <span className="ml-2">
                  ({users.filter(u => u.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No KYC submissions found</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left bg-white rounded-2xl shadow-md border-l-4 transition-all hover:shadow-lg ${
                  selectedUser?.id === user.id ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {getStatusIcon(user.status)}
                      <span>
                        {user.status === 'pending'
                          ? 'Pending'
                          : user.status === 'verified'
                          ? 'Verified'
                          : 'Rejected'}
                      </span>
                    </span>
                  </div>

                  {/* Submission Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Submitted: {new Date(user.submittedAt).toLocaleString()}
                  </p>

                  {/* Document Summary */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <span className="text-gray-600">
                        Total Documents: <span className="font-semibold">{user.documents.length}</span>
                      </span>
                      <span className="text-green-600">
                        Verified:{' '}
                        <span className="font-semibold">
                          {user.documents.filter(d => d.status === 'verified').length}
                        </span>
                      </span>
                      {user.documents.filter(d => d.status === 'pending').length > 0 && (
                        <span className="text-yellow-600">
                          Pending:{' '}
                          <span className="font-semibold">
                            {user.documents.filter(d => d.status === 'pending').length}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-blue-600 font-semibold">View Details →</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Document Details Panel */}
      {selectedUser && (
        <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold mb-2"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-gray-900">{selectedUser.username}</h2>
            <p className="text-sm text-gray-600">{selectedUser.email}</p>
          </div>

          <div className="p-6 space-y-4">
            {selectedUser.documents.map(doc => (
              <div key={doc.id}>
                <DocumentInfo
                  status={doc.status}
                  documentType={doc.documentType}
                  uploadDate={doc.uploadedAt}
                  onClick={() => openDocumentViewer(doc)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && selectedUser && (
        <DocumentViewer
          isOpen={viewerOpen}
          document={selectedDoc}
          documents={selectedUser.documents.map(d => ({
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
