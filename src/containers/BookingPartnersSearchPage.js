import React from "react";
import { withStyles } from "@material-ui/core/styles";
import KeyHandler, { KEYPRESS } from "react-key-handler";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import BookingPartnersSearchResultTable from "../components/BookingPartnersSearchResultTable";

import BonzaTextField from "../components/BonzaTextField";
import BonzaPaymentMethodSelect from "../components/BonzaPaymentMethodSelect";

import { setActivePageTitle } from "../actions/settings";
import {
  getBookingPartners,
  deleteBookingPartner,
} from "../middleware/api/bookingPartners";

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const defaultState = {
  loading: false,
  order: `ASC`,
  orderBy: `name`,
  name: ``,
  reservationConfirmEmail: ``,
  commissionLevel: ``,
  paymentMethod: false,
  bookingPartners: {},
  page: 0,
  limit: 20,
};

const noMargin = { marginBottom: `0px` };

class BookingPartnersSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.filter = this.filter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.search = this.search.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
    this.changePageHandler = this.changePageHandler.bind(this);
    this.changeRowsPerPageHandler = this.changeRowsPerPageHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);

    props.dispatch(setActivePageTitle(`Booking partners search`));
  }

  componentWillMount() {
    this.search();
  }

  onDeleteHandler(bookingPartnerId, bookingPartnerName) {
    if (
      confirm(`Are you sure that you want to delete ${bookingPartnerName}?`)
    ) {
      this.setState({ loading: true });
      deleteBookingPartner(bookingPartnerId)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.setState({ loading: false }, this.search);
        });
    }
  }

  clearFilters() {
    this.setState(defaultState, this.search);
  }

  onSearchClick() {
    this.setState({ page: 0 }, this.search);
  }

  search() {
    this.setState({ loading: true });
    getBookingPartners(this.state)
      .then((result) => {
        this.setState({
          bookingPartners: result,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  }

  filter(name, value) {
    this.setState({ [name]: value });
  }

  sortHandler(orderBy) {
    let order = this.state.order ? this.state.order : `ASC`;
    if (this.state.orderBy === orderBy) {
      order = `ASC`;
      if (this.state.bookingPartners.order === `ASC`) {
        order = `DESC`;
      }
    }

    this.setState({ order, orderBy }, this.search);
  }

  changePageHandler(event, page) {
    this.setState({ page }, this.search);
  }

  changeRowsPerPageHandler(event) {
    this.setState({ limit: event.target.value, page: 0 }, this.search);
  }

  getSearchResults(loadingIndication) {
    let renderedResult = <p>No data to display</p>;

    if (
      `data` in this.state.bookingPartners &&
      this.state.bookingPartners.data.length > 0
    ) {
      renderedResult = (
        <BookingPartnersSearchResultTable
          onSort={this.sortHandler}
          onChangePage={this.changePageHandler}
          onChangeRowsPerPage={this.changeRowsPerPageHandler}
          onDelete={this.onDeleteHandler}
          data={this.state.bookingPartners}
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

    const onKeyPressHandler = (e) => {
      if (e.charCode === 13) {
        this.onSearchClick();
      }
    };

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
          <div className="row" style={{ backgroundColor: `white` }}>
            <div
              className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Name"
                value={this.state.name}
                fullWidth={true}
                name="name"
                onKeyPress={onKeyPressHandler}
                onChange={this.filter}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Email"
                value={this.state.reservationConfirmEmail}
                fullWidth={true}
                onKeyPress={onKeyPressHandler}
                name="reservationConfirmEmail"
                onChange={this.filter}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-3 col-lg-2 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Commission level"
                type="number"
                value={this.state.commissionLevel}
                fullWidth={true}
                onKeyPress={onKeyPressHandler}
                name="commissionLevel"
                onChange={this.filter}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-3 col-lg-4 m-b-15"
              style={noMargin}
            >
              <BonzaPaymentMethodSelect
                value={this.state.paymentMethod}
                name="paymentMethod"
                fullWidth={true}
                onChange={this.filter}
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

export default withStyles(styles)(BookingPartnersSearchPage);
