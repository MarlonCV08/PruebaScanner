// ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la interfaz de respaldo
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Loguea los detalles del error
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Interfaz de respaldo
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Algo salió mal.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // Renderiza los hijos si no hay error
    return this.props.children; 
  }
}

export default ErrorBoundary;
