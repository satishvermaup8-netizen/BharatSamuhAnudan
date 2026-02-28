import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  growth?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
};

export function StatCard({ title, value, isCurrency, growth, icon, color }: StatCardProps) {
  const { ref, isVisible } = useScrollAnimation();
  const animatedValue = useAnimatedCounter(isVisible ? value : 0, 2000);

  return (
    <div
      ref={ref}
      className={`stat-card transform transition-all duration-300 hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {growth !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(growth)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {isCurrency ? formatCurrency(animatedValue) : animatedValue.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}