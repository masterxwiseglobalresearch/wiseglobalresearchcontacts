import React from 'react';

class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Optionally log to an external service here
    // console.error('ChunkErrorBoundary caught', error, info);
  }

  handleReload = () => {
    // Try to reload the page to recover from chunk load errors
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    if (!hasError) return this.props.children || null;

    // If it's a ChunkLoadError suggest a reload; otherwise show a generic message
    const isChunkError = error && (error.name === 'ChunkLoadError' || /Loading chunk|ChunkLoadError/.test(error.message || ''));

    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>There was a problem loading part of the app.</h2>
        <p style={{ marginTop: 8 }}>
          {isChunkError
            ? 'A code update may have occurred. Please reload the page to recover.'
            : 'An unexpected error occurred. You can try reloading the page.'}
        </p>
        <div style={{ marginTop: 12 }}>
          <button onClick={this.handleReload} style={{ padding: '8px 12px', fontSize: 14 }}>Reload</button>
        </div>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
