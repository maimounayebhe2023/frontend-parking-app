import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../Style/ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // Vous pouvez également logger l'erreur à un service de reporting ici
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <FaExclamationTriangle />
            </div>
            <h2 className="error-boundary-title">
              Oups ! Une erreur est survenue
            </h2>
            <p className="error-boundary-message">
              Nous nous excusons pour ce désagrément. Veuillez rafraîchir la
              page ou réessayer plus tard.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="error-boundary-details">
                <details>
                  <summary>Détails de l'erreur</summary>
                  <pre className="error-boundary-stack">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
            <button
              className="error-boundary-button"
              onClick={() => window.location.reload()}
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
