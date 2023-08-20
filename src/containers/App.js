import React from "react";
import PropTypes from "prop-types";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import withWidth, { LARGE, SMALL } from "material-ui/utils/withWidth";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import ThemeDefault from "../theme-default";
import { connect } from "react-redux";

import Header from "../components/Header";
import MainMenu from "../components/MainMenu";

import { logoutUser, checkAuthorization } from "../actions/auth";
import { clearNotifications } from "../actions/application";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: false,
    };

    this.hideErrors = this.hideErrors.bind(this);
    this.hideNotifications = this.hideNotifications.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(checkAuthorization(this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ navDrawerOpen: nextProps.width === LARGE });
    }

    if (this.props.activePageTitle !== nextProps.activePageTitle) {
      this.setState({ navDrawerOpen: false });
    }
  }

  handleChangeRequestNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  }

  hideNotifications() {
    this.props.dispatch(hideNotifications());
  }

  hideErrors() {
    this.props.dispatch(hideErrors());
  }

  generateNotifications() {
    let notification = (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={this.props.notifications.length > 0}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          this.props.dispatch(clearNotifications());
        }}
        message={
          <div>
            {this.props.notifications.map((item, index) => (
              <p key={`notification_message_${index}`}>{item}</p>
            ))}
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={(event, reason) => {
              if (reason === "clickaway") return;
              this.props.dispatch(clearNotifications());
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );

    return <div>{notification}</div>;
  }

  render() {
    let { navDrawerOpen } = this.state;
    let displayedBlock = false;
    if (this.props.initialAuthorizationCheck) {
      displayedBlock = (
        <div
          style={{
            top: `50%`,
            position: `absolute`,
            left: `50%`,
          }}
        >
          <CircularProgress />
        </div>
      );
    } else {
      if (this.props.isAuthenticated) {
        displayedBlock = (
          <div>
            <Header
              styles={{ paddingLeft: 0 }}
              handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(
                this,
              )}
            />
            <div style={{ height: "57px" }}>
              <MainMenu
                navDrawerOpen={navDrawerOpen}
                onMenuClose={this.handleChangeRequestNavDrawer.bind(this)}
                onLogoutClick={() =>
                  this.props.dispatch(logoutUser(this.props))
                }
              />
            </div>
            <div
              style={{
                margin: "20px 20px 20px 15px",
                paddingLeft: 0,
              }}
            >
              {this.props.children}
            </div>
          </div>
        );
      } else {
        displayedBlock = <div>{this.props.children}</div>;
      }
    }

    let notifications = this.generateNotifications();
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <div>{displayedBlock}</div>
          <div>{notifications}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  initialAuthorizationCheck: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  authMessage: PropTypes.string,
  errors: PropTypes.array.isRequired,
  notifications: PropTypes.array.isRequired,
};

/* eslint-disable */
function mapStateToProps(state) {
  const { auth, settingsReducer, applicationReducer } = state;
  const {
    initialAuthorizationCheck,
    isAuthenticating,
    isAuthenticated,
    authMessage,
  } = auth;
  const { errors, notifications } = applicationReducer;
  const { activePageTitle } = settingsReducer;

  return {
    initialAuthorizationCheck,
    isAuthenticating,
    isAuthenticated,
    authMessage,
    activePageTitle,
    errors,
    notifications,
  };
}

export default connect(mapStateToProps)(withWidth()(App));
