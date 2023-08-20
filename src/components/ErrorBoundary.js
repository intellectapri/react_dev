import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch = (error, info) => {
    console.log("Error was caught");
  };

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
