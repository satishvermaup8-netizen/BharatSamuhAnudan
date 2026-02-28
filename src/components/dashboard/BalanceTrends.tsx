/**
 * Balance Trends Visualization Component
 * Shows historical fund balance trends and projections
 */

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { BalanceTrend, FundType, formatCurrency, getFundTypeColor, getFundTypeLabel } from '@/lib/fundManagement';

export interface BalanceTrendsChartProps {
  data: BalanceTrend[];
  height?: number;
  selectedFunds?: FundType[];
}

/**
 * Multi-line Balance Trends Chart
 * Shows balance changes for multiple funds over time
 */
export function BalanceTrendsChart({
  data,
  height = 350,
  selectedFunds,
}: BalanceTrendsChartProps) {
  const { chartData, maxValue, minValue } = useMemo(() => {
    // Group by fund type
    const groupedData = new Map<FundType, number[]>();

    const fundTypes: FundType[] = selectedFunds || [
      'death_claim',
      'health_insurance',
      'emergency_relief',
      'education_support',
    ];

    fundTypes.forEach(fund => {
      groupedData.set(
        fund,
        data.filter(d => d.fundType === fund).map(d => d.balance)
      );
    });

    const allValues = data.map(d => d.balance);
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);

    return {
      chartData: data.slice(-30), // Last 30 days
      fundTypes,
      groupedData,
      maxValue: max,
      minValue: 0,
    };
  }, [data, selectedFunds]);

  const chartWidth = 100;
  const padding = 50;

  const getY = (value: number) =>
    height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);

  // Group chart data by fund type
  const fundData = new Map<FundType, BalanceTrend[]>();
  chartData.forEach(item => {
    if (!fundData.has(item.fundType)) {
      fundData.set(item.fundType, []);
    }
    fundData.get(item.fundType)!.push(item);
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Balance Trends</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 pb-4">
        <svg width="100%" height={height} viewBox={`0 0 ${chartWidth + 2 * padding} ${height}`}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={`grid-${ratio}`}>
              <line
                x1={padding}
                y1={height - padding - (height - 2 * padding) * ratio}
                x2={chartWidth + padding}
                y2={height - padding - (height - 2 * padding) * ratio}
                stroke="#E5E7EB"
                strokeDasharray="4"
              />
              <text
                x={padding - 10}
                y={height - padding - (height - 2 * padding) * ratio + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                ₹{Math.round((maxValue * ratio) / 100000)}L
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#9CA3AF" />
          <line x1={padding} y1={height - padding} x2={chartWidth + padding} y2={height - padding} stroke="#9CA3AF" />

          {/* Lines for each fund */}
          {Array.from(fundData.entries()).map(([fundType, fundTrends]) => {
            const color = getFundTypeColor(fundType);
            const pathData = fundTrends
              .map((item, idx) => {
                const x = padding + (idx / fundTrends.length) * chartWidth;
                const y = getY(item.balance);
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');

            return (
              <g key={`fund-${fundType}`}>
                {/* Line */}
                <path
                  d={pathData}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {fundTrends.map((item, idx) => {
                  const x = padding + (idx / fundTrends.length) * chartWidth;
                  const y = getY(item.balance);
                  return (
                    <circle
                      key={`point-${fundType}-${idx}`}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={color}
                      opacity="0.8"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartData.map((item, idx) => {
            if (idx % 6 === 0) {
              const x = padding + (idx / chartData.length) * chartWidth;
              return (
                <text
                  key={`date-${idx}`}
                  x={x}
                  y={height - 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                >
                  {new Date(item.date).getDate()}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
        {Array.from(fundData.keys()).map(fundType => (
          <div key={fundType} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getFundTypeColor(fundType) }}
            ></div>
            <span className="text-sm text-gray-600">{getFundTypeLabel(fundType)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Fund Health Card Component
 * Shows trend indicator and health status for individual fund
 */
export interface FundHealthCardProps {
  fundType: FundType;
  currentBalance: number;
  previousBalance: number;
  projectedInflow: number;
  projectedOutflow: number;
}

export function FundHealthCard({
  fundType,
  currentBalance,
  previousBalance,
  projectedInflow,
  projectedOutflow,
}: FundHealthCardProps) {
  const change = currentBalance - previousBalance;
  const changePercent = (change / previousBalance) * 100;
  const isIncreasing = change >= 0;
  const projectedBalance = currentBalance + projectedInflow - projectedOutflow;

  const getHealthStatus = () => {
    if (currentBalance === 0) return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50' };
    if (currentBalance < 50000) return { label: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (currentBalance < 200000) return { label: 'Moderate', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { label: 'Healthy', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const health = getHealthStatus();

  return (
    <div className={`rounded-xl border border-gray-200 p-4 ${health.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{getFundTypeLabel(fundType)}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${health.color} bg-white`}>
          {health.label}
        </span>
      </div>

      <div className="space-y-3">
        {/* Current Balance */}
        <div>
          <p className="text-xs text-gray-600 mb-1">Current Balance</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(currentBalance)}</p>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center space-x-2">
          {isIncreasing ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                +{formatCurrency(change)} ({changePercent.toFixed(1)}%)
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(change)} ({changePercent.toFixed(1)}%)
              </span>
            </>
          )}
        </div>

        {/* Projection */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <p className="text-xs font-medium text-gray-700">Next Period Projection</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Inflow</span>
              <span className="font-semibold text-green-600">+{formatCurrency(projectedInflow)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Outflow</span>
              <span className="font-semibold text-red-600">-{formatCurrency(projectedOutflow)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Projected Balance</span>
              <span className="font-bold text-gray-900">{formatCurrency(projectedBalance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Balance Summary Cards Grid
 */
export interface BalanceSummaryProps {
  balances: Record<FundType, number>;
}

export function BalanceSummary({ balances }: BalanceSummaryProps) {
  const totalBalance = Object.values(balances).reduce((sum, b) => sum + b, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Fund Balances</h3>

      <div className="space-y-3">
        {Object.entries(balances).map(([fundType, balance]) => (
          <div
            key={fundType}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getFundTypeColor(fundType as FundType) }}
              ></div>
              <span className="font-medium text-gray-700">
                {getFundTypeLabel(fundType as FundType)}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatCurrency(balance)}</p>
              <p className="text-xs text-gray-500">
                {((balance / totalBalance) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 mt-4">
          <span className="font-semibold text-gray-900">Total Balance</span>
          <span className="text-lg font-bold text-blue-600">{formatCurrency(totalBalance)}</span>
        </div>
      </div>
    </div>
  );
}
