import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router";

import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "material-ui/Paper";
import Button from "@material-ui/core/Button";
import { Form, FormProvider } from "react-advanced-form";
import AdvancedInput from "../components/AdvancedInput";
import { setActivePageTitle } from "../actions/settings";
import { loginUser } from "../actions/auth";

const validationRules = {
  name: {
    login: {
      minLength: ({ value }) => value.length > 3,
    },
  },
  type: {
    password: {
      minLength: ({ value }) => value.length > 5,
    },
  },
};

const validationMessages = {
  name: {
    login: {
      missing: "Please provide a login",
      rule: {
        minLength: "Login must be at least 4 letters long",
      },
    },
  },
  type: {
    password: {
      missing: "Please provide a password",
      rule: {
        minLength: "Password must be at least 6 letters long",
      },
    },
  },
};

class LoginPage extends React.Component {
  constructor(props) {
    super();

    this.state = {
      formIsValid: false,
    };

    this.fieldChangeHandler = this.fieldChangeHandler.bind(this);
    this.signIn = this.signIn.bind(this);

    props.dispatch(setActivePageTitle(`Login`));
  }

  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.router.push(`/`);
    }
  }

  signIn({ serialized }) {
    this.props.dispatch(loginUser(serialized, this.props));
    return Promise.resolve();
  }

  fieldChangeHandler(change) {
    change.form.validate().then((formIsValid) => {
      if (this.state.formIsValid !== formIsValid) {
        this.setState({ formIsValid });
      }
    });
  }

  render() {
    let buttonText = `Sign in`;
    if (this.props.isAuthenticating) {
      buttonText = `Signing in...`;
    }

    let errorMessage = ``;
    if (this.props.authMessage) {
      errorMessage = (
        <div
          style={{
            color: `#f44336`,
            paddingTop: `20px`,
          }}
        >
          {this.props.authMessage}
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            minWidth: 320,
            maxWidth: 400,
            height: "auto",
            position: "absolute",
            top: "20%",
            left: 0,
            right: 0,
            textAlign: `center`,
            margin: `auto`,
          }}
        >
          <Paper style={{ padding: `20px` }}>
            <div>
              <img src="/assets/img/logo.gif" />
            </div>
            <FormProvider rules={validationRules} messages={validationMessages}>
              <Form action={this.signIn}>
                <div>
                  <AdvancedInput
                    onChange={this.fieldChangeHandler}
                    name="login"
                    type="text"
                    label="Login / e-mail"
                    disabled={this.props.isAuthenticating}
                    required
                    fullWidth
                    style={{ paddingBottom: `10px` }}
                  />
                </div>
                <div style={{ paddingTop: `10px` }}>
                  <AdvancedInput
                    onChange={this.fieldChangeHandler}
                    name="password"
                    type="password"
                    label="Password"
                    disabled={this.props.isAuthenticating}
                    required
                    fullWidth
                    style={{ paddingBottom: `10px` }}
                  />
                </div>
                <div style={{ paddingTop: `20px` }}>
                  <Button
                    type="submit"
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                    disabled={
                      !this.state.formIsValid || this.props.isAuthenticating
                    }
                  >
                    {buttonText}
                  </Button>
                </div>
                {this.state.isAuthenticating ? (
                  <div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
                        <LinearProgress />
                      </div>
                    </div>
                  </div>
                ) : (
                  false
                )}
                {errorMessage}
              </Form>
            </FormProvider>
          </Paper>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  authMessage: PropTypes.string,
  isAuthenticating: PropTypes.bool,
};

function mapStateToProps(state) {
  const { auth } = state;
  const { isAuthenticating, isAuthenticated, authMessage } = auth;
  return {
    isAuthenticated,
    isAuthenticating,
    authMessage,
  };
}

export default connect(mapStateToProps)(LoginPage);
