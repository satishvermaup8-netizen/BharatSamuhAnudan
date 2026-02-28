/**
 * Payment Schedule Component - Fixed for PaymentStatus
 * Tracks and displays installment-based payment schedules
 */

import React, { useState } from 'react';
import { Check, Clock, Calendar, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { PaymentSchedule, PaymentInstallment } from '@/lib/beneficiaryRotation';
import { formatCurrency } from '@/lib/fundManagement';

export interface PaymentScheduleProps {
  schedule: PaymentSchedule;
  beneficiaryName: string;
  onInstallmentMarked?: (schedule: PaymentSchedule, installmentIndex: number) => Promise<void>;
  readOnly?: boolean;
}

/**
 * Payment Status Badge Component
 */
export function PaymentStatusBadge({ status }: { status: string }) {
  const config = {
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
    scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Scheduled' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
  };

  const style = config[status as keyof typeof config] || config.scheduled;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

/**
 * Installment Timeline Component
 */
export function InstallmentTimeline({ schedule, beneficiaryName }: PaymentScheduleProps) {
  const completedCount = schedule.installments.filter(i => i.status === 'completed').length;
  const progress = (completedCount / schedule.installments.length) * 100;
  const totalAmount = schedule.installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = schedule.installments
    .filter(i => i.status === 'completed')
    .reduce((sum, inst) => sum + inst.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{beneficiaryName}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {completedCount} of {schedule.installments.length} installments paid • {formatCurrency(paidAmount)} / {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Payment Progress</p>
          <p className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="h-3 rounded-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-end space-x-1 mb-4">
          {schedule.installments.map((installment, idx) => {
            const isCompleted = installment.status === 'completed';
            const isOverdue = installment.status !== 'completed' && new Date(installment.dueDate) < new Date();

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition ${
                  isCompleted ? 'bg-green-100 border-2 border-green-600' : isOverdue ? 'bg-red-100 border-2 border-red-600' : 'bg-gray-100 border-2 border-gray-400'
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : isOverdue ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <span className="text-xs font-semibold text-gray-600">{idx + 1}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {new Date(installment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span className="text-xs text-gray-600">Overdue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-xs text-gray-600">Pending</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Installment Details Table Component
 */
export function InstallmentDetailsTable({
  schedule,
  onInstallmentMarked,
  readOnly = false,
}: PaymentScheduleProps) {
  const [isMarking, setIsMarking] = useState<number | null>(null);

  const handleMarkCompleted = async (index: number) => {
    if (!onInstallmentMarked || readOnly) return;
    setIsMarking(index);
    try {
      const updatedSchedule = { ...schedule };
      updatedSchedule.installments[index].status = 'completed';
      updatedSchedule.installments[index].completedDate = new Date().toISOString();
      await onInstallmentMarked(updatedSchedule, index);
    } catch (error) {
      console.error('Failed to mark installment:', error);
    }
    setIsMarking(null);
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Completion</th>
              {!readOnly && <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.installments.map((installment, idx) => {
              const isOverdueDate = isOverdue(installment.dueDate);

              return (
                <tr key={idx} className={`hover:bg-gray-50 transition ${installment.status === 'completed' ? 'bg-green-50' : isOverdueDate ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 font-medium">{new Date(installment.dueDate).toLocaleDateString()}</p>
                      {installment.status === 'completed' && installment.completedDate && (
                        <p className="text-xs text-green-600">Paid: {new Date(installment.completedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(installment.amount)}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PaymentStatusBadge status={installment.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm text-gray-600">{Math.round(((idx + 1) / schedule.installments.length) * 100)}%</p>
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 text-center">
                      {installment.status !== 'completed' && (
                        <button
                          onClick={() => handleMarkCompleted(idx)}
                          disabled={isMarking === idx}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded transition"
                        >
                          {isMarking === idx ? 'Marking...' : 'Mark Paid'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Payment Summary Card Component
 */
export function PaymentSummaryCard({ schedule }: { schedule: PaymentSchedule }) {
  const totalAmount = schedule.installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = schedule.installments
    .filter(i => i.status === 'completed')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const remainingAmount = totalAmount - paidAmount;
  const completionPercentage = (paidAmount / totalAmount) * 100;

  const nextDueInstallment = schedule.installments.find(i => i.status !== 'completed');
  const nextDueDate = nextDueInstallment ? new Date(nextDueInstallment.dueDate) : null;
  const daysUntilDue = nextDueDate ? Math.ceil((nextDueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
        <p className="text-xs text-gray-500 mt-3 flex items-center space-x-1">
          <span>Across {schedule.installments.length} installments</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
        <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
        <p className="text-xs text-green-600 mt-3 flex items-center space-x-1">
          <Check className="w-4 h-4" />
          <span>{schedule.installments.filter(i => i.status === 'completed').length} completed</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
        <p className="text-sm text-gray-600 mb-1">Remaining Amount</p>
        <p className="text-2xl font-bold text-orange-600">{formatCurrency(remainingAmount)}</p>
        <p className="text-xs text-orange-600 mt-3 flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{schedule.installments.filter(i => i.status !== 'completed').length} pending</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
        <p className="text-sm text-gray-600 mb-1">Completion</p>
        <p className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</p>
        {nextDueDate && daysUntilDue !== null && (
          <p className={`text-xs mt-3 flex items-center space-x-1 ${
            daysUntilDue < 0 ? 'text-red-600' : daysUntilDue < 7 ? 'text-orange-600' : 'text-blue-600'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>
              {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Full Payment Schedule Component
 */
export function PaymentScheduleViewer({
  schedule,
  beneficiaryName,
  onInstallmentMarked,
  readOnly = false,
}: PaymentScheduleProps) {
  const handleExport = () => {
    const headers = ['Installment', 'Due Date', 'Amount', 'Status', 'Completion %'];
    const rows = schedule.installments.map((inst, idx) => [
      idx + 1,
      new Date(inst.dueDate).toLocaleDateString(),
      formatCurrency(inst.amount),
      inst.status,
      Math.round(((idx + 1) / schedule.installments.length) * 100) + '%',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const globalDoc = typeof document !== 'undefined' ? document : null;
    if (!globalDoc) return;
    const link = globalDoc.createElement('a');
    link.href = url;
    link.download = `payment-schedule-${schedule.id}.csv`;
    globalDoc.body.appendChild(link);
    link.click();
    globalDoc.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Schedule</h2>
          <p className="text-gray-600 mt-1">{beneficiaryName}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      <PaymentSummaryCard schedule={schedule} />
      <InstallmentTimeline schedule={schedule} beneficiaryName={beneficiaryName} />
      <InstallmentDetailsTable
        schedule={schedule}
        beneficiaryName={beneficiaryName}
        onInstallmentMarked={onInstallmentMarked}
        readOnly={readOnly}
      />
    </div>
  );
}
