import { Component } from "react";

/**
 * Error boundary component for graceful error handling.
 * Catches errors in child components and displays fallback UI.
 * Logs errors in development for debugging.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log errors in development only
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
