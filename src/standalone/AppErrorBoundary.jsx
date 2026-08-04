import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("App render failed", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div>
            <div className="error-title">Something went wrong loading Visual Drill.</div>
            <button type="button" className="theme-button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
