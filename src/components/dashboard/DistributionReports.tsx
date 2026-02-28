/**
 * Distribution Reports Component
 * Shows fund distribution details across different fund types
 */

import React, { useMemo } from 'react';
import { PieChart, BarChart3, Users, DollarSign } from 'lucide-react';
import { Distribution, formatCurrency, formatPercentage, getFundTypeColor, getFundTypeLabel } from '@/lib/fundManagement';

export interface DistributionReportProps {
  data: Distribution[];
  title?: string;
}

/**
 * Distribution Pie Chart Component
 */
export function DistributionPieChart({ data, title = 'Fund Distribution' }: DistributionReportProps) {
  const total = data.reduce((sum, d) => sum + d.totalDistributed, 0);

  // Calculate pie slices
  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map(item => {
      const sliceAngle = (item.percentage * 360);
      const slice = {
        fund: item.fundType,
        percentage: item.percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + sliceAngle,
        color: getFundTypeColor(item.fundType),
      };
      currentAngle += sliceAngle;
      return slice;
    });
  }, [data]);

  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  const polarToCartesian = (angle: number) => ({
    x: centerX + radius * Math.cos((angle - 90) * (Math.PI / 180)),
    y: centerY + radius * Math.sin((angle - 90) * (Math.PI / 180)),
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {slices.map((slice) => {
              const startPos = polarToCartesian(slice.startAngle);
              const endPos = polarToCartesian(slice.endAngle);
              const isLargeArc = slice.percentage > 0.5 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startPos.x} ${startPos.y}`,
                `A ${radius} ${radius} 0 ${isLargeArc} 1 ${endPos.x} ${endPos.y}`,
                'Z',
              ].join(' ');

              return (
                <path
                  key={slice.fund}
                  d={pathData}
                  fill={slice.color}
                  opacity="0.85"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map(item => (
            <div key={item.fundType} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getFundTypeColor(item.fundType) }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {getFundTypeLabel(item.fundType)}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatPercentage(item.percentage)}
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-5">{formatCurrency(item.totalDistributed)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Distribution Details Table Component
 */
export function DistributionDetailsTable({ data }: DistributionReportProps) {
  const total = data.reduce((sum, d) => sum + d.totalDistributed, 0);
  const totalRecipients = data.reduce((sum, d) => sum + d.recipientCount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Distribution Details</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Fund Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Distributed</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Recipients</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Avg Amount</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.fundType} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getFundTypeColor(item.fundType) }}
                    ></div>
                    <span className="font-medium text-gray-900">
                      {getFundTypeLabel(item.fundType)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.totalDistributed)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-gray-900">{item.recipientCount}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-600">{formatCurrency(item.avgAmount)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-gray-900">
                    {formatPercentage(item.percentage)}
                  </span>
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-blue-50 border-t-2 border-blue-200">
              <td className="px-6 py-4 font-semibold text-gray-900">Total</td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-blue-600">{totalRecipients}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-gray-600">
                  {formatCurrency(total / totalRecipients)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-blue-600">100%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Distribution Summary Cards
 */
export function DistributionSummaryCards({ data }: DistributionReportProps) {
  const total = data.reduce((sum, d) => sum + d.totalDistributed, 0);
  const recipientCount = data.reduce((sum, d) => sum + d.recipientCount, 0);
  const avgPerRecipient = total / recipientCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Distributed */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-600">Total Distributed</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
        <p className="text-xs text-gray-500 mt-2">Across all fund types</p>
      </div>

      {/* Total Recipients */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-600">Recipients</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">{recipientCount}</p>
        <p className="text-xs text-gray-500 mt-2">Total beneficiaries</p>
      </div>

      {/* Average per Recipient */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-yellow-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-600">Average per Recipient</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgPerRecipient)}</p>
        <p className="text-xs text-gray-500 mt-2">Mean distribution</p>
      </div>

      {/* Fund Type Count */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-600">Fund Types</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">{data.length}</p>
        <p className="text-xs text-gray-500 mt-2">Active fund categories</p>
      </div>
    </div>
  );
}

/**
 * Distribution Comparison Chart
 * Compares distribution amounts across fund types
 */
export function DistributionComparisonChart({ data }: DistributionReportProps) {
  const maxValue = Math.max(...data.map(d => d.totalDistributed));
  const chartHeight = 300;
  const padding = 50;
  const barWidth = 60;
  const spacing = 10;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribution Comparison</h3>

      <div className="overflow-x-auto -mx-6 px-6 pb-4">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${600} ${chartHeight}`}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <g key={`grid-${ratio}`}>
              <line
                x1={padding}
                y1={chartHeight - padding - (chartHeight - 2 * padding) * ratio}
                x2={600}
                y2={chartHeight - padding - (chartHeight - 2 * padding) * ratio}
                stroke="#E5E7EB"
                strokeDasharray="4"
              />
              <text
                x={padding - 10}
                y={chartHeight - padding - (chartHeight - 2 * padding) * ratio + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                ₹{Math.round((maxValue * ratio) / 100000)}L
              </text>
            </g>
          ))}

          {/* Y Axis */}
          <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#9CA3AF" />

          {/* X Axis */}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={600}
            y2={chartHeight - padding}
            stroke="#9CA3AF"
          />

          {/* Bars */}
          {data.map((item, idx) => {
            const x = padding + 30 + (idx * (barWidth + spacing));
            const height = ((chartHeight - 2 * padding) * item.totalDistributed) / maxValue;

            return (
              <g key={item.fundType}>
                {/* Bar */}
                <rect
                  x={x}
                  y={chartHeight - padding - height}
                  width={barWidth}
                  height={height}
                  fill={getFundTypeColor(item.fundType)}
                  opacity="0.85"
                  rx="4"
                />

                {/* Label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                >
                  {getFundTypeLabel(item.fundType)
                    .split(' ')[0]
                    .substring(0, 8)}
                </text>

                {/* Value */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - padding - height - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#1F2937"
                >
                  {formatCurrency(item.totalDistributed)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
