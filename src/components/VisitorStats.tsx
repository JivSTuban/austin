import { useVisitorStats } from '@/hooks/useVisitors';
import { Eye, TrendingUp } from 'lucide-react';

interface VisitorStatsProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const VisitorStats = ({ variant = 'compact', className = '' }: VisitorStatsProps) => {
  const { uniqueVisitors, totalPageViews, loading } = useVisitorStats();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 ${className}`}>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{loading ? '...' : uniqueVisitors.toLocaleString()} visitors</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          <span>{loading ? '...' : totalPageViews.toLocaleString()} views</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : uniqueVisitors.toLocaleString()}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : totalPageViews.toLocaleString()}
            </p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}; 