import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  message?: string;
  attempt?: number;
  totalAttempts?: number;
}

export const Loading = ({
  message = 'Loading agent data...', 
  attempt = 1, 
  totalAttempts = 3 
}: LoadingIndicatorProps) => (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="bg-white rounded-lg p-4 shadow-lg min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          {attempt > 1 && (
            <div className="absolute -top-1 -right-1 bg-purple-100 text-purple-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {attempt}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{message}</p>
          {attempt > 1 && (
            <p className="text-xs text-gray-400">
              Attempt {attempt} of {totalAttempts}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface ErrorIndicatorProps {
  error: string;
  retryCount: number;
  maxRetries: number;
  onRetry?: () => void;
}

export const ErrorIndicator = ({ 
  error, 
  retryCount, 
  maxRetries, 
  onRetry 
}: ErrorIndicatorProps) => (
  <div className="fixed bottom-6 right-6 z-50">
    <div className={cn(
      "bg-red-50 rounded-lg p-4 shadow-lg border border-red-200 max-w-md",
      "animate-slideIn transition-all duration-300"
    )}>
      <h3 className="font-medium text-red-800">Connection Error</h3>
      <p className="text-sm text-red-600 mt-1">
        {error.includes('not found') 
          ? 'Unable to load agent information. Please check your internet connection.'
          : error.includes('Invalid request')
          ? 'There was a problem with the request. Please try again.'
          : 'Sorry, we\'re having trouble connecting to our servers. Please try again in a moment.'
        }
      </p>
      <div className="mt-3 flex gap-2">
        {retryCount < maxRetries ? (
          <button 
            onClick={onRetry}
            className="text-sm px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry ({maxRetries - retryCount} attempts left)
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="text-sm px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Refresh Page
          </button>
        )}
        <button
          onClick={() => window.open('mailto:support@trusthome.com')}
          className="text-sm px-3 py-1.5 text-red-600 hover:text-red-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  </div>
);
