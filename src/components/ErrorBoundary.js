import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Save additional info and surface to console for diagnostics
    this.setState({ error, info });
    // Keep console logging so Sentry/other integrations can pick it up in dev
    // (real apps should also forward to a logging service here)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error && this.state.error.message
        ? this.state.error.message
        : 'An unexpected error occurred.';
      return (
        <div
          role="alert"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            background: '#fff5f5',
            color: '#600',
            padding: '16px',
            zIndex: 2147483647,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <strong style={{display: 'block', marginBottom: 8}}>Something went wrong</strong>
          <div style={{whiteSpace: 'pre-wrap', marginBottom: 12}}>{message}</div>
          <div>
            <button
              onClick={() => window.location.reload()}
              style={{marginRight: 8}}
            >
              Reload page
            </button>
            <button onClick={() => this.setState({ hasError: false, error: null, info: null })}>
              Dismiss
            </button>
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;
