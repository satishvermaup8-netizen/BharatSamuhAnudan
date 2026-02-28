/**
 * Fund Inflow/Outflow Visualization Component
 * Real-time charts showing fund movements
 */

import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { FlowData, formatCurrency } from '@/lib/fundManagement';

export interface InflowOutflowChartProps {
  data: FlowData[];
  height?: number;
  showNetFlow?: boolean;
}

/**
 * Inflow/Outflow Bar Chart Component
 * Displays daily inflows and outflows with net flow calculation
 */
export function InflowOutflowChart({
  data,
  height = 300,
  showNetFlow = true,
}: InflowOutflowChartProps) {
  const { maxValue, chartData } = useMemo(() => {
    const maxInflow = Math.max(...data.map(d => d.inflow));
    const maxOutflow = Math.max(...data.map(d => d.outflow));
    const max = Math.max(maxInflow, maxOutflow);

    return {
      maxValue: max,
      chartData: data.slice(-14), // Last 14 days
    };
  }, [data]);

  const chartWidth = 100;
  const barWidth = chartWidth / chartData.length;
  const padding = 40;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Fund Flow Analysis</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Inflow</span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(chartData.reduce((sum, d) => sum + d.inflow, 0))}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownLeft className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Total Outflow</span>
          </div>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(chartData.reduce((sum, d) => sum + d.outflow, 0))}
          </p>
        </div>

        {showNetFlow && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Net Flow</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(chartData.reduce((sum, d) => sum + d.net, 0))}
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto -mx-6 px-6 pb-4">
        <svg width="100%" height={height} viewBox={`0 0 ${chartWidth + 2 * padding} ${height}`}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={`grid-${ratio}`}
              x1={padding}
              y1={height - padding - (height - 2 * padding) * ratio}
              x2={chartWidth + padding}
              y2={height - padding - (height - 2 * padding) * ratio}
              stroke="#E5E7EB"
              strokeDasharray="4"
            />
          ))}

          {/* Y-Axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#9CA3AF" />

          {/* X-Axis */}
          <line x1={padding} y1={height - padding} x2={chartWidth + padding} y2={height - padding} stroke="#9CA3AF" />

          {/* Y-Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = Math.round((maxValue * ratio) / 1000);
            const y = height - padding - (height - 2 * padding) * ratio;
            return (
              <text
                key={`label-${ratio}`}
                x={padding - 10}
                y={y + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                ₹{value}K
              </text>
            );
          })}

          {/* Bars */}
          {chartData.map((item, idx) => {
            const x = padding + (idx + 0.5) * barWidth;
            const inflowHeight = ((height - 2 * padding) * item.inflow) / maxValue;
            const outflowHeight = ((height - 2 * padding) * item.outflow) / maxValue;

            return (
              <g key={`bar-${idx}`}>
                {/* Inflow Bar (Blue) */}
                <rect
                  x={x - barWidth * 0.4}
                  y={height - padding - inflowHeight}
                  width={barWidth * 0.35}
                  height={inflowHeight}
                  fill="#3B82F6"
                  opacity="0.8"
                  rx="2"
                />

                {/* Outflow Bar (Red) */}
                <rect
                  x={x + barWidth * 0.05}
                  y={height - padding - outflowHeight}
                  width={barWidth * 0.35}
                  height={outflowHeight}
                  fill="#EF4444"
                  opacity="0.8"
                  rx="2"
                />

                {/* Date Label */}
                <text
                  x={x}
                  y={height - padding + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                >
                  {new Date(item.date).getDate()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
          <span className="text-sm text-gray-600">Inflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
          <span className="text-sm text-gray-600">Outflow</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Flow Summary Card Component
 * Quick stats showing fund movement summary
 */
export interface FlowSummaryProps {
  label: string;
  inflow: number;
  outflow: number;
  net: number;
  trend?: 'up' | 'down' | 'neutral';
}

export function FlowSummaryCard({ label, inflow, outflow, net, trend }: FlowSummaryProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
      <p className="text-sm font-medium text-gray-600 mb-3">{label}</p>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Inflow</p>
          <p className="text-sm font-bold text-blue-600">{formatCurrency(inflow)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Outflow</p>
          <p className="text-sm font-bold text-red-600">{formatCurrency(outflow)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Net</p>
          <p className={`text-sm font-bold ${getTrendColor()}`}>{formatCurrency(net)}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Waterfall Chart Component
 * Shows flow progression from opening to closing balance
 */
export interface WaterfallChartProps {
  startBalance: number;
  inflow: number;
  outflow: number;
  endBalance: number;
}

export function WaterfallChart({ startBalance, inflow, outflow, endBalance }: WaterfallChartProps) {
  const maxValue = Math.max(
    startBalance,
    startBalance + inflow,
    startBalance + inflow - outflow,
    endBalance
  );

  const chartHeight = 250;
  const padding = 40;

  const getY = (value: number) => chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Fund Flow Waterfall</h3>

      <svg width="100%" height={chartHeight} viewBox={`0 0 600 ${chartHeight}`} className="mb-6">
        {/* Opening Balance Bar */}
        <rect x="30" y={getY(startBalance)} width="80" height={startBalance / maxValue * (chartHeight - 2 * padding)} fill="#3B82F6" rx="4" />
        <text x="70" y={chartHeight - 20} textAnchor="middle" fontSize="12" fill="#6B7280">
          Opening
        </text>
        <text x="70" y={getY(startBalance) - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F2937">
          {formatCurrency(startBalance)}
        </text>

        {/* Connection Line */}
        <line x1="110" y1={getY(startBalance)} x2="150" y2={getY(startBalance)} stroke="#D1D5DB" strokeDasharray="4" />

        {/* Inflow Bar */}
        <rect x="150" y={getY(startBalance + inflow)} width="80" height={inflow / maxValue * (chartHeight - 2 * padding)} fill="#10B981" rx="4" />
        <line x1="150" y1={getY(startBalance)} x2="150" y2={getY(startBalance + inflow)} stroke="#D1D5DB" strokeWidth="1" />
        <text x="190" y={chartHeight - 20} textAnchor="middle" fontSize="12" fill="#6B7280">
          Inflow
        </text>
        <text x="190" y={getY(startBalance + inflow) - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#10B981">
          +{formatCurrency(inflow)}
        </text>

        {/* Connection Line */}
        <line x1="230" y1={getY(startBalance + inflow)} x2="270" y2={getY(startBalance + inflow)} stroke="#D1D5DB" strokeDasharray="4" />

        {/* Outflow Bar */}
        <rect x="270" y={getY(startBalance + inflow - outflow)} width="80" height={outflow / maxValue * (chartHeight - 2 * padding)} fill="#EF4444" rx="4" />
        <line x1="270" y1={getY(startBalance + inflow)} x2="270" y2={getY(startBalance + inflow - outflow)} stroke="#D1D5DB" strokeWidth="1" />
        <text x="310" y={chartHeight - 20} textAnchor="middle" fontSize="12" fill="#6B7280">
          Outflow
        </text>
        <text x="310" y={getY(startBalance + inflow - outflow) - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EF4444">
          -{formatCurrency(outflow)}
        </text>

        {/* Connection Line */}
        <line x1="350" y1={getY(endBalance)} x2="390" y2={getY(endBalance)} stroke="#D1D5DB" strokeDasharray="4" />

        {/* Closing Balance Bar */}
        <rect x="390" y={getY(endBalance)} width="80" height={endBalance / maxValue * (chartHeight - 2 * padding)} fill="#9333EA" rx="4" />
        <text x="430" y={chartHeight - 20} textAnchor="middle" fontSize="12" fill="#6B7280">
          Closing
        </text>
        <text x="430" y={getY(endBalance) - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F2937">
          {formatCurrency(endBalance)}
        </text>
      </svg>

      {/* Summary Table */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Opening Balance</p>
          <p className="text-lg font-bold text-blue-600">{formatCurrency(startBalance)}</p>
        </div>
        <div>
          <p className="text-gray-600">Closing Balance</p>
          <p className="text-lg font-bold text-purple-600">{formatCurrency(endBalance)}</p>
        </div>
      </div>
    </div>
  );
}
