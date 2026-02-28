import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface DocumentViewerProps {
  isOpen: boolean;
  document: {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf';
    uploadedAt: string;
    uploadedBy?: string;
  };
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf';
    uploadedAt: string;
    uploadedBy?: string;
  }>;
  onClose: () => void;
  onApprove?: (documentId: string) => Promise<void>;
  onReject?: (documentId: string, reason: string) => Promise<void>;
  readOnly?: boolean;
}

const usefulDocuments = [];

/**
 * Secure Document Viewer Modal for Admin Review
 * Supports images and PDFs with zoom, rotation, and download
 */
export function DocumentViewer({
  isOpen,
  document,
  documents = [],
  onClose,
  onApprove,
  onReject,
  readOnly = false,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalDoc = typeof window !== 'undefined' ? window.document : null;

  // Update current index when document changes
  useEffect(() => {
    if (documents.length > 0 && document) {
      const index = documents.findIndex(d => d.id === document.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [document, documents]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setZoom(100);
      setRotation(0);
      setShowRejectForm(false);
      setRejectReason('');
    }
  }, [isOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = async () => {
    try {
      if (!globalDoc) throw new Error('Document API not available');
      const link = globalDoc.createElement('a');
      link.href = document.url;
      link.download = document.name;
      globalDoc.body.appendChild(link as HTMLElement);
      link.click();
      globalDoc.body.removeChild(link as HTMLElement);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document');
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsLoading(true);
    try {
      await onApprove(document.id);
      alert('Document approved');
      onClose();
    } catch (error: any) {
      alert(`Approval failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!onReject || !rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      await onReject(document.id, rejectReason);
      alert('Document rejected');
      onClose();
    } catch (error: any) {
      alert(`Rejection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const navigatePrevious = () => {
    if (documents.length > 0) {
      const newIndex = (currentIndex - 1 + documents.length) % documents.length;
      setCurrentIndex(newIndex);
    }
  };

  const navigateNext = () => {
    if (documents.length > 0) {
      const newIndex = (currentIndex + 1) % documents.length;
      setCurrentIndex(newIndex);
    }
  };

  const currentDoc = documents.length > 0 ? documents[currentIndex] : document;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b">
          <div className="flex items-start justify-between w-full">
            <div>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{currentDoc.name}</span>
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded: {new Date(currentDoc.uploadedAt).toLocaleDateString()} by{' '}
                {currentDoc.uploadedBy || 'System'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Document Display */}
        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center relative min-h-[400px]">
          {currentDoc.type === 'image' ? (
            <img
              ref={imageRef}
              src={currentDoc.url}
              alt={currentDoc.name}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-in-out',
              }}
              className="max-w-full max-h-full object-contain cursor-move"
              crossOrigin="anonymous"
              onError={() => {
                console.error('Failed to load image');
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-white">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-4">PDF Document</p>
              <p className="text-sm text-gray-400 mb-6">
                PDF preview not available in browser view
              </p>
              <a
                href={currentDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
              >
                Open PDF in New Tab
              </a>
            </div>
          )}

          {/* Navigation Arrows (if multiple documents) */}
          {documents.length > 1 && (
            <>
              <button
                onClick={navigatePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={navigateNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {documents.length}
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="border-t bg-gray-50 p-4 space-y-4">
          {/* Zoom and Rotation Controls */}
          {currentDoc.type === 'image' && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                  title="Zoom Out (Min: 50%)"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                  title="Zoom In (Max: 300%)"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-gray-200 rounded-lg transition flex items-center space-x-1"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-sm">({rotation}°)</span>
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-200 rounded-lg transition flex items-center space-x-1"
                title="Download Document"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          )}

          {/* Approval/Rejection Controls (Admin Only) */}
          {!readOnly && (onApprove || onReject) && (
            <div className="border-t pt-4">
              {!showRejectForm ? (
                <div className="flex space-x-3">
                  {onApprove && (
                    <button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                    >
                      <span>✓ Approve Document</span>
                    </button>
                  )}
                  {onReject && (
                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={isLoading}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                    >
                      <span>✗ Reject Document</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Rejection Reason<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain why this document is being rejected..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRejectSubmit}
                      disabled={isLoading || !rejectReason.trim()}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                    >
                      {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                      }}
                      className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Document Info Badge - Shows document status and details
 */
export interface DocumentInfoProps {
  status: 'verified' | 'rejected' | 'pending' | 'expired';
  documentType: string;
  uploadDate: string;
  onClick?: () => void;
}

export function DocumentInfo({ status, documentType, uploadDate, onClick }: DocumentInfoProps) {
  const statusConfig = {
    verified: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Verified' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '✗ Rejected' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' },
    expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚠ Expired' },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border ${config.bg} ${config.text} text-sm hover:shadow-md transition cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className="font-semibold">{documentType}</p>
          <p className="text-xs opacity-75">Uploaded: {new Date(uploadDate).toLocaleDateString()}</p>
        </div>
        <span className="font-semibold">{config.label}</span>
      </div>
    </button>
  );
}
