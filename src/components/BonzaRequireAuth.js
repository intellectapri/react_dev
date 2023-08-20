import React, { Component } from "react";
import { connect } from "react-redux";

import ErrorBoundary from "./ErrorBoundary";

export default function (ComposedComponent) {
  class BonzaRequireAuth extends Component {
    componentWillMount() {
      if (!this.props.isAuthenticated && !this.props.isAuthenticating) {
        this.props.router.push("/login");
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated && !this.props.isAuthenticating) {
        this.props.router.push("/login");
      }
    }

    render() {
      return this.props.isAuthenticated && !this.props.isAuthenticating ? (
        <ErrorBoundary>
          <ComposedComponent {...this.props} />
        </ErrorBoundary>
      ) : (
        false
      );
    }
  }

  function mapStateToProps(state) {
    let { auth } = state;
    let { isAuthenticated, isAuthenticating } = auth;
    return { isAuthenticated, isAuthenticating };
  }

  return connect(mapStateToProps)(BonzaRequireAuth);
}
