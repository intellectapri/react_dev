import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import KeyHandler, { KEYPRESS } from "react-key-handler";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import EmailHistorySearchResultTable from "../components/EmailHistorySearchResultTable";

import BonzaTextField from "../components/BonzaTextField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";

import { setActivePageTitle } from "../actions/settings";
import { searchEmailHistory } from "../middleware/api/emails";

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const defaultState = {
  loading: false,
  emails: [],
  from: moment().subtract(2, "months").toDate(),
  to: new Date(),
  emailTo: ``,
  subject: ``,
  userId: false,
  page: 0,
  limit: 20,
};

const noMargin = { marginBottom: `0px` };

class EmailHistoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.setValue = this.setValue.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.search = this.search.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.changePageHandler = this.changePageHandler.bind(this);
    this.changeRowsPerPageHandler = this.changeRowsPerPageHandler.bind(this);

    props.dispatch(setActivePageTitle(`Email history`));
  }

  componentWillMount() {
    this.search();
  }

  clearFilters() {
    this.setState(defaultState, this.search);
  }

  onSearchClick() {
    this.setState({ page: 0 }, this.search);
  }

  search() {
    this.setState({ loading: true });
    searchEmailHistory(this.state)
      .then((result) => {
        this.setState({
          emails: result,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  changePageHandler(event, page) {
    this.setState({ page }, this.search);
  }

  changeRowsPerPageHandler(event) {
    this.setState({ limit: event.target.value, page: 0 }, this.search);
  }

  getSearchResults(loadingIndication) {
    let renderedResult = <p>No data to display</p>;

    if (`data` in this.state.emails && this.state.emails.data.length > 0) {
      renderedResult = (
        <EmailHistorySearchResultTable
          onChangePage={this.changePageHandler}
          onChangeRowsPerPage={this.changeRowsPerPageHandler}
          data={this.state.emails}
        />
      );
    } else {
      loadingIndication = false;
    }

    return (
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
          {renderedResult}
          {loadingIndication}
        </div>
      </div>
    );
  }

  onKeyPressHandler(e) {
    if (e.charCode === 13) {
      this.search();
    }
  }

  render() {
    let loadingIndication = false;
    if (this.state.loading) {
      loadingIndication = (
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
            <LinearProgress />
          </div>
        </div>
      );
    }

    let searchResults = this.getSearchResults(loadingIndication);
    return (
      <div>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue="Enter"
          onKeyHandle={() => {
            this.onSearchClick();
          }}
        />

        <div style={{ paddingBottom: `10px` }}>
          <div className="row">
            <div
              className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaDatePickerField
                title="Sent from"
                value={this.state.from}
                onKeyPress={this.onKeyPressHandler.bind(this)}
                fullWidth={true}
                maxDate={this.state.to}
                name="from"
                onChange={this.setValue}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaDatePickerField
                title="Sent to"
                value={this.state.to}
                onKeyPress={this.onKeyPressHandler.bind(this)}
                fullWidth={true}
                minDate={this.state.from}
                name="to"
                onChange={this.setValue}
              />
            </div>
          </div>
          <div className="row">
            <div
              className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Emailed to"
                value={this.state.emailTo}
                onKeyPress={this.onKeyPressHandler.bind(this)}
                fullWidth={true}
                name="emailTo"
                onChange={this.setValue}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Subject"
                value={this.state.subject}
                onKeyPress={this.onKeyPressHandler.bind(this)}
                fullWidth={true}
                name="subject"
                onChange={this.setValue}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaSelectField
                title="Created by"
                options={this.props.users}
                optionsIdField="userId"
                optionsTitleField={(item) => {
                  return item.firstname + ` ` + item.lastname;
                }}
                value={this.state.userId}
                name="userId"
                onChange={this.setValue}
              />
            </div>
          </div>
          <div className="row" style={{ paddingTop: `10px` }}>
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
              style={Object.assign({ textAlign: `right` }, noMargin)}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={this.onSearchClick}
              >
                <SearchIcon className={this.props.classes.leftIcon} />
                Search
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={this.clearFilters}
                style={{ marginLeft: `10px` }}
              >
                <ClearIcon className={this.props.classes.leftIcon} />
                Clear
              </Button>
            </div>
          </div>
        </div>
        <Divider />
        {loadingIndication}
        {searchResults}
      </div>
    );
  }
}

/* eslint-disable */
function mapStateToProps(state) {
  const { userReducer } = state;
  const { users } = userReducer;
  return { users };
}

export default withStyles(styles)(connect(mapStateToProps)(EmailHistoryPage));
