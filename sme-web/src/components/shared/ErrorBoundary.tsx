import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            An unexpected error occurred. Refresh the page or navigate back to continue.
          </p>
          <button
            type="button"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/dashboard'; }}
            className="px-5 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
