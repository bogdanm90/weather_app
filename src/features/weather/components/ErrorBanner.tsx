interface ErrorBannerProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBanner({
  error,
  onRetry,
  className = '',
}: ErrorBannerProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error occurred</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
