import React from "react";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", textAlign: "center" }}>
          <h4 style={{ color: "#991B1B", marginBottom: "8px" }}>Widget Error</h4>
          <p style={{ color: "#B91C1C", fontSize: "12px" }}>Failed to render this component.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
