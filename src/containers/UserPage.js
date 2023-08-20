import React from "react";
import { Link } from "react-router";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaNotification from "../components/BonzaNotification";
import config from "../config";

import { createUser, updateUser, getUser } from "../middleware/api/users";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";

class UserPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userWasUpdated: false,
      userWasCreated: false,

      userId: 0,
      groupID: false,
      accountEnabled: 1,
      email: ``,
      firstname: ``,
      lastname: ``,
      password1: ``,
      password2: ``,

      userGroups: [],
      errors: [],
    };

    this.setValue = this.setValue.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    if (props.params.id) {
      props.dispatch(setActivePageTitle(`Edit user`));
    } else {
      props.dispatch(setActivePageTitle(`Add user`));
    }
  }

  componentWillMount() {
    if (this.props.params.id) {
      getUser(this.props.params.id)
        .then((editedUser) => {
          editedUser.loading = false;
          editedUser.userGroups = config.userGroups;
          this.setState(editedUser);
        })
        .catch(() => {
          this.setState({
            loading: false,
            errors: [`Unable to get user data`],
          });
        });
    } else {
      this.setState({
        userGroups: config.userGroups,
        loading: false,
      });
    }
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      errors: [],
    });
  };

  validate() {
    return new Promise((resolve, reject) => {
      let errors = [];

      if (this.state.userId === 0) {
        if (
          !this.state.password1 ||
          this.state.password1 !== this.state.password2
        ) {
          errors.push(`Please enter the password for new user`);
        }
      }

      if (
        this.state.password1 &&
        this.state.password1 !== this.state.password2
      ) {
        errors.push(`Passwords do not match`);
      }

      if (!this.state.firstname || !this.state.lastname) {
        errors.push(`First or last name should not be empty`);
      }

      if (this.state.groupID === false) {
        errors.push(`User group should be set`);
      }

      if (!this.state.email) {
        errors.push(`Email should not be empty`);
      }

      if (errors.length === 0) {
        resolve();
      } else {
        reject(errors);
      }
    });
  }

  onFormSubmit() {
    this.validate()
      .then(() => {
        this.setState({ loading: true });

        let data = {
          groupID: this.state.groupID,
          accountEnabled: this.state.accountEnabled,
          email: this.state.email,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
        };

        if (this.state.userId > 0) {
          if (this.state.password1) data.password = this.state.password1;
          updateUser(this.state.userId, data)
            .then(() => {
              this.setState({ userWasUpdated: true });
            })
            .catch(() => {
              this.setState({
                loading: false,
                errors: [`Error occured while updating user`],
              });
            });
        } else {
          data.password = this.state.password1;
          createUser(data)
            .then((identifiers) => {
              this.setState({
                userId: identifiers.id,
                userWasCreated: true,
              });
            })
            .catch(() => {
              this.setState({
                loading: false,
                errors: [`Error occured while creating user`],
              });
            });
        }
      })
      .catch((errors) => {
        this.setState({ errors: Array.isArray(errors) ? errors : [errors] });
      });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    let overlay = false;
    if (this.state.loading) {
      let overlayContent = (
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

      if (this.state.userWasCreated || this.state.userWasUpdated) {
        let text = <p>User was created</p>;
        let link = (
          <p>
            <Link
              to={`/users/edit/${this.state.userId}`}
              className="no-underline"
            >
              <Button variant="contained" color="primary">
                Edit user
              </Button>
            </Link>
            <Link
              to="/"
              className="no-underline"
              style={{ marginLeft: `10px` }}
            >
              <Button variant="contained" color="primary">
                Go to the home page
              </Button>
            </Link>
          </p>
        );

        if (this.state.userWasUpdated) {
          text = <p>User was updated</p>;
          link = (
            <div>
              <p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({
                      loading: false,
                      userWasUpdated: false,
                    });
                  }}
                >
                  Back to editing user
                </Button>
              </p>
              <p>
                <Link to={`/users`} className="no-underline">
                  <Button variant="contained">Back to users</Button>
                </Link>
              </p>
            </div>
          );
        }

        overlayContent = (
          <div
            style={{
              top: `calc(50% - 80px)`,
              left: `calc(50% - 80px)`,
              position: `fixed`,
              textAlign: `center`,
            }}
          >
            <CheckIcon color="primary" style={{ fontSize: 80 }} />
            <br />
            {text}
            {link}
          </div>
        );
      }

      overlay = (
        <div
          style={{
            position: `absolute`,
            width: `100%`,
            height: `100%`,
            backgroundColor: `rgba(255,255,255,0.6)`,
            zIndex: `100`,
          }}
        >
          {overlayContent}
        </div>
      );
    }

    let cellStyle = { minWidth: `300px` };

    let actionButtonIsEnabled = true;
    if (
      !this.state.firstname ||
      !this.state.lastname ||
      !this.state.email ||
      this.state.groupID === false
    )
      actionButtonIsEnabled = false;
    return (
      <div style={{ position: `relative` }}>
        {overlay}
        {this.state.userGroups.length > 0 ? (
          <div>
            <div>
              <Grid container>
                <Grid item style={cellStyle}>
                  <BonzaTextField
                    title="First name"
                    value={this.state.firstname}
                    fullWidth={true}
                    name="firstname"
                    required={true}
                    onChange={this.setValue}
                  />
                </Grid>
                <Grid item style={cellStyle}>
                  <BonzaTextField
                    title="Last name"
                    value={this.state.lastname}
                    fullWidth={true}
                    name="lastname"
                    required={true}
                    onChange={this.setValue}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={cellStyle}>
                  <BonzaTextField
                    title="Password"
                    type="password"
                    value={this.state.password1}
                    fullWidth={true}
                    name="password1"
                    onChange={this.setValue}
                  />
                </Grid>
                <Grid item style={cellStyle}>
                  <BonzaTextField
                    title="Repeat password"
                    type="password"
                    value={this.state.password2}
                    fullWidth={true}
                    name="password2"
                    onChange={this.setValue}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={cellStyle}>
                  <BonzaTextField
                    title="Email / login"
                    value={this.state.email}
                    required={true}
                    fullWidth={true}
                    name="email"
                    onChange={this.setValue}
                  />
                </Grid>
                <Grid item style={cellStyle}>
                  <BonzaBooleanField
                    title="Account is enabled"
                    value={this.state.accountEnabled}
                    name="accountEnabled"
                    onChange={this.setValue}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={cellStyle}>
                  <BonzaSelectField
                    title="User group"
                    required={true}
                    options={this.state.userGroups}
                    optionsIdField="groupId"
                    optionsTitleField="groupName"
                    value={this.state.groupID}
                    name="groupID"
                    onChange={this.setValue}
                  />
                </Grid>
              </Grid>
            </div>
            {this.state.userId > 0 ? (
              <div>
                <Button
                  disabled={!actionButtonIsEnabled}
                  variant="contained"
                  color="primary"
                  onClick={this.onFormSubmit}
                >
                  Update user
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  disabled={!actionButtonIsEnabled}
                  variant="contained"
                  color="primary"
                  onClick={this.onFormSubmit}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        ) : (
          false
        )}
        <BonzaNotification
          errors={this.state.errors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default UserPage;
