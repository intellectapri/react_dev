import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import KeyHandler, { KEYPRESS } from "react-key-handler";

import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ClearIcon from "@material-ui/icons/Clear";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import DatePicker from "./../components/BonzaDatePicker/entry";

import BonzaTextField from "../components/BonzaTextField";

import BonzaSelectField from "../components/BonzaSelectField";
import FormControlLabelWrapper from "../components/FormControlLabelWrapper";
import PurchasesSearchResultTable from "../components/PurchasesSearchResultTable";

import config from "./../config";
import { setActivePageTitle } from "../actions/settings";
import { requestPurchases } from "../actions/purchase";

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const allPurchaseTypes = `all`;

const defaultFilters = {
  purchaseType: allPurchaseTypes,
  purchaseDateFrom: null,
  purchaseDateTo: null,
  tourDateFrom: null,
  tourDateTo: null,
  product: `null`,
  bookingId: ``,
  travelerName: ``,
  bookingReferenceId: ``,
  travelAgency: ``,
  family: false,
  famil: false,
  enteredBy: `null`,
  customer: `null`,
  status: `active`,
  travelerEmail: ``,
  city: `null`,
  showAdvancedFilters: false,
  order: `DESC`,
  orderBy: `tourDate`,
  page: 0,
  searchVoucher: "",
};

const noMargin = { marginBottom: `0px` };

class PurchasesSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultFilters;

    this.filter = this.filter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.toggleAdvancedFilters = this.toggleAdvancedFilters.bind(this);
    this.search = this.search.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
    this.changePageHandler = this.changePageHandler.bind(this);
    this.changeRowsPerPageHandler = this.changeRowsPerPageHandler.bind(this);

    props.dispatch(setActivePageTitle(`Purchases search`));
  }

  clearFilters() {
    this.setState(defaultFilters);
  }

  toggleAdvancedFilters() {
    this.setState({ showAdvancedFilters: !this.state.showAdvancedFilters });
  }

  componentDidMount() {
    let initialFilters = JSON.parse(JSON.stringify(defaultFilters));
    if (this.props.location && this.props.location.query) {
      for (let key in this.props.location.query) {
        let value = this.props.location.query[key];
        if (key === `bookingId` && value) initialFilters[key] = value;
        if (key === `bookingReferenceId` && value) initialFilters[key] = value;
        if (key === `city` && value && value !== `null`)
          initialFilters[key] = value;
        if (key === `customer` && value && value !== `null`)
          initialFilters[key] = value;
        if (key === `enteredBy` && value && value !== `null`)
          initialFilters[key] = value;
        if (key === `product` && value && value !== `null`)
          initialFilters[key] = value;
        if (key === `famil` && value) initialFilters[key] = value;
        if (key === `family` && value) initialFilters[key] = value;
        if (key === `purchaseDateFrom` && value)
          initialFilters[key] = moment(value, `YYYY-MM-DD`).toDate();
        if (key === `purchaseDateTo` && value)
          initialFilters[key] = moment(value, `YYYY-MM-DD`).toDate();
        if (key === `purchaseType` && value) initialFilters[key] = value;
        if (key === `status` && value) initialFilters[key] = value;
        if (key === `tourDateFrom` && value)
          initialFilters[key] = moment(value, `YYYY-MM-DD`).toDate();
        if (key === `tourDateTo` && value)
          initialFilters[key] = moment(value, `YYYY-MM-DD`).toDate();
        if (key === `travelAgency` && value) initialFilters[key] = value;
        if (key === `travelerEmail` && value) initialFilters[key] = value;
        if (key === `travelerName` && value) initialFilters[key] = value;
      }
    }

    this.setState(initialFilters, () => {
      this.search();
    });
  }

  onSearchClick() {
    this.setState({ page: 0 }, this.search);
  }

  search() {
    let urlParams = [];
    if (this.state.bookingId)
      urlParams.push(["bookingId", this.state.bookingId]);
    if (this.state.bookingReferenceId)
      urlParams.push(["bookingReferenceId", this.state.bookingReferenceId]);
    if (
      this.state.city !== `null` &&
      this.state.city !== null &&
      this.state.city
    )
      urlParams.push(["city", this.state.city]);
    if (
      this.state.customer !== `null` &&
      this.state.customer !== null &&
      this.state.customer
    )
      urlParams.push(["customer", this.state.customer]);
    if (
      this.state.enteredBy !== `null` &&
      this.state.enteredBy !== null &&
      this.state.enteredBy
    )
      urlParams.push(["enteredBy", this.state.enteredBy]);
    if (
      this.state.product !== `null` &&
      this.state.product !== null &&
      this.state.product
    )
      urlParams.push(["product", this.state.product]);
    if (this.state.famil) urlParams.push(["famil", this.state.famil]);
    if (this.state.family) urlParams.push(["family", this.state.family]);
    if (this.state.purchaseDateFrom)
      urlParams.push([
        "purchaseDateFrom",
        moment(this.state.purchaseDateFrom).format(`YYYY-MM-DD`),
      ]);
    if (this.state.purchaseDateTo)
      urlParams.push([
        "purchaseDateTo",
        moment(this.state.purchaseDateTo).format(`YYYY-MM-DD`),
      ]);
    if (this.state.purchaseType)
      urlParams.push(["purchaseType", this.state.purchaseType]);
    if (this.state.status) urlParams.push(["status", this.state.status]);
    if (this.state.tourDateFrom)
      urlParams.push([
        "tourDateFrom",
        moment(this.state.tourDateFrom).format(`YYYY-MM-DD`),
      ]);
    if (this.state.tourDateTo)
      urlParams.push([
        "tourDateTo",
        moment(this.state.tourDateTo).format(`YYYY-MM-DD`),
      ]);
    if (this.state.travelAgency)
      urlParams.push(["travelAgency", this.state.travelAgency]);
    if (this.state.travelerEmail)
      urlParams.push(["travelerEmail", this.state.travelerEmail]);
    if (this.state.travelerName)
      urlParams.push(["travelerName", this.state.travelerName]);
    if (this.state.searchVoucher) {
      urlParams.push(["voucherIDs", this.state.searchVoucher]);
    }

    let joinedParams = [];
    urlParams.map((item) => {
      joinedParams.push(item[0] + "=" + item[1]);
    });

    this.props.router.push({
      pathname: "/purchases/search",
      search: "?" + joinedParams.join("&"),
    });

    this.props.dispatch(requestPurchases(this.state));
  }

  filter(name, value) {
    this.setState({ [name]: value });
  }

  sortHandler(orderBy) {
    let order = this.state.order ? this.state.order : `ASC`;
    if (this.state.orderBy === orderBy) {
      order = `ASC`;
      if (this.props.purchases.order === `ASC`) {
        order = `DESC`;
      }
    }

    this.setState({ order, orderBy }, this.search);
  }

  changePageHandler(event, page) {
    this.setState({ page }, this.search);
  }

  changeRowsPerPageHandler(event) {
    this.setState({ limit: event.target.value }, this.search);
  }

  onKeyPressHandler(e) {
    if (e.charCode === 13) {
      this.search();
    }
  }

  getAdvancedFilters() {
    let advancedFilters = (
      <div>
        <div className="row">
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <BonzaTextField
              title="Traveller name"
              name="travelerName"
              fullWidth={true}
              onKeyPress={this.onKeyPressHandler.bind(this)}
              value={this.state.travelerName}
              onChange={(name, value) => {
                this.filter(name, value);
              }}
            />
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <FormControl component="fieldset" margin="dense">
              <div style={{ display: `flex` }}>
                <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
                  <FormLabel>Booking Partner Reference</FormLabel>
                </div>
                <div style={{ paddingRight: `10px` }}>
                  <TextField
                    onKeyPress={this.onKeyPressHandler.bind(this)}
                    value={this.state.bookingReferenceId}
                    onChange={(event) => {
                      this.filter(`bookingReferenceId`, event.target.value);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <FormControl component="fieldset" margin="dense">
              <div style={{ display: `flex` }}>
                <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
                  <FormLabel>Travel agency</FormLabel>
                </div>
                <div style={{ paddingRight: `10px` }}>
                  <TextField
                    onKeyPress={this.onKeyPressHandler.bind(this)}
                    value={this.state.travelAgency}
                    onChange={(event) => {
                      this.filter(`travelAgency`, event.target.value);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
            style={noMargin}
          >
            <FormControl component="fieldset" margin="dense">
              <FormControlLabel
                label="Family"
                control={
                  <Checkbox
                    checked={this.state.family}
                    onChange={(event) => {
                      this.filter(`family`, event.target.checked);
                    }}
                    value="checkedA"
                  />
                }
              />
            </FormControl>
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
            style={noMargin}
          >
            <FormControl component="fieldset" margin="dense">
              <FormControlLabel
                label="Famil"
                control={
                  <Checkbox
                    checked={this.state.famil}
                    onChange={(event) => {
                      this.filter(`famil`, event.target.checked);
                    }}
                    value="checkedA"
                  />
                }
              />
            </FormControl>
          </div>
        </div>
      </div>
    );

    return advancedFilters;
  }

  getTourSpecificParameters() {
    let bookingPartnersOptions = [];
    if (this.props.customers) {
      bookingPartnersOptions = JSON.parse(JSON.stringify(this.props.customers));
      bookingPartnersOptions.unshift({
        customerID: `null`,
        name: `Any`,
      });
    }

    let usersOptions = [];
    if (this.props.users) {
      let tempUsersOptions = JSON.parse(JSON.stringify(this.props.users));
      tempUsersOptions.map((item) => {
        if (item.accountEnabled) {
          usersOptions.push(item);
        }
      });

      usersOptions.unshift({
        userId: `null`,
        firstname: `Any`,
        lastname: ``,
      });
    }

    let tourSpecificFilterParameters = (
      <div>
        <div className="row">
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <BonzaSelectField
              title="Booking partner"
              value={this.state.customer}
              options={bookingPartnersOptions}
              name="customer"
              optionsIdField="customerID"
              optionsTitleField="name"
              onChange={(name, value) => {
                this.filter(name, value);
              }}
            />
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <BonzaSelectField
              title="Entered by"
              value={this.state.enteredBy}
              options={usersOptions}
              name="enteredBy"
              optionsIdField="userId"
              optionsTitleField={(item) => {
                return item.firstname + ` ` + item.lastname;
              }}
              onChange={(name, value) => {
                this.filter(name, value);
              }}
            />
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
            style={noMargin}
          >
            <FormControl component="fieldset" margin="dense">
              <div style={{ display: `flex` }}>
                <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
                  <FormLabel>Traveller email</FormLabel>
                </div>
                <div style={{ paddingRight: `10px` }}>
                  <TextField
                    onKeyPress={this.onKeyPressHandler.bind(this)}
                    value={this.state.travelerEmail}
                    onChange={(event) => {
                      this.filter(`travelerEmail`, event.target.value);
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </div>
        </div>
      </div>
    );

    return tourSpecificFilterParameters;
  }

  getSearchResults(loadingIndication) {
    let renderedResult = <p>No data to display</p>;
    if (
      `data` in this.props.purchases &&
      this.props.purchases.data.length > 0
    ) {
      let result = this.props.purchases;
      renderedResult = (
        <PurchasesSearchResultTable
          router={this.props.router}
          onSort={this.sortHandler}
          onChangePage={this.changePageHandler}
          users={this.props.users}
          onChangeRowsPerPage={this.changeRowsPerPageHandler}
          data={result}
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
  setValue = (name, value) => {
    this.setState(
      (state) => ({
        ...state,
        [name]: value,
      }),
      () => {
        this.search();
      },
    );
  };
  render() {
    let productOptions = [];
    if (this.props.products) {
      let tempProductOptions = JSON.parse(JSON.stringify(this.props.products));

      tempProductOptions.map((item) => {
        if (!item.archived) {
          productOptions.push(item);
        }
      });

      productOptions.unshift({
        productID: `null`,
        name: `Any`,
      });
    }

    let advancedFiltersIcon = (
      <ExpandMoreIcon className={this.props.classes.leftIcon} />
    );
    if (this.state.showAdvancedFilters) {
      advancedFiltersIcon = (
        <ExpandLessIcon className={this.props.classes.leftIcon} />
      );
    }

    let tourSpecificFilterParameters = false;
    if (this.state.purchaseType === `tour`) {
      tourSpecificFilterParameters = this.getTourSpecificParameters();
    }

    let advancedFilters = false;
    if (this.state.showAdvancedFilters) {
      advancedFilters = this.getAdvancedFilters();
    }

    let loadingIndication = false;
    if (this.props.purchasesLoading) {
      loadingIndication = (
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
            <LinearProgress />
          </div>
        </div>
      );
    }

    let searchResults = this.getSearchResults(loadingIndication);

    let statusOptions = [];
    statusOptions = JSON.parse(JSON.stringify(config.statuses));
    statusOptions.unshift(`Any`);

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
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15">
              <FormControl component="fieldset" margin="dense">
                <div style={{ display: `flex` }}>
                  <div style={{ paddingTop: `12px`, paddingRight: `10px` }}>
                    <FormLabel>Purchase type</FormLabel>
                  </div>
                  <div>
                    <RadioGroup
                      row={true}
                      name="purchaseType"
                      value={this.state.purchaseType}
                      onChange={(event) => {
                        this.filter(`purchaseType`, event.target.value);
                      }}
                    >
                      <FormControlLabelWrapper
                        value={allPurchaseTypes}
                        label="All types"
                      />
                      <FormControlLabelWrapper value="tour" label="Tour" />
                      <FormControlLabelWrapper
                        value="misc"
                        label="Miscellaneous"
                      />
                    </RadioGroup>
                  </div>
                </div>
              </FormControl>
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
              style={{ paddingTop: `8px` }}
            >
              <BonzaSelectField
                title="Product"
                value={this.state.product}
                options={productOptions}
                name="product"
                optionsIdField="productID"
                optionsTitleField="name"
                onChange={(name, value) => {
                  this.filter(name, value);
                }}
              />
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
              style={{ paddingTop: `8px` }}
            >
              <FormControl component="fieldset" margin="dense">
                <div style={{ display: `flex` }}>
                  <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
                    <FormLabel>Bonza Booking ID</FormLabel>
                  </div>
                  <div style={{ paddingRight: `10px` }}>
                    <TextField
                      onKeyPress={this.onKeyPressHandler.bind(this)}
                      value={this.state.bookingId}
                      onChange={(event) => {
                        this.filter(`bookingId`, event.target.value);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            </div>
            <div
              className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
              style={noMargin}
            >
              <BonzaSelectField
                title="Status"
                value={this.state.status}
                capitalize={true}
                options={statusOptions}
                name="status"
                onChange={(name, value) => {
                  this.filter(name, value);
                }}
              />
            </div>
          </div>
          {tourSpecificFilterParameters}
          <div
            className="row"
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            <div className="col-md-6">
              <BonzaTextField
                name="searchVoucher"
                value={this.state.searchVoucher}
                title="Search by Voucher Code"
                fullWidth={true}
                placeholder="Search by voucher code"
                onChange={this.setValue}
              />
            </div>
          </div>
          <div className="row">
            <div
              className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
              style={noMargin}
            >
              <FormControl component="fieldset" margin="dense">
                <div style={{ display: `flex` }}>
                  <div style={{ paddingRight: `10px` }}>
                    <FormLabel>Tour date</FormLabel>
                  </div>
                  <div style={{ paddingRight: `10px` }}>
                    <DatePicker
                      locale="en-AU"
                      onChange={(value) => {
                        this.filter(`tourDateFrom`, value);
                      }}
                      value={this.state.tourDateFrom}
                      dataFormat={config.momentDateFormat}
                      maxDate={
                        this.state.tourDateTo ? this.state.tourDateTo : null
                      }
                    />
                  </div>
                  <div>
                    <DatePicker
                      locale="en-AU"
                      onChange={(value) => {
                        this.filter(`tourDateTo`, value);
                      }}
                      value={this.state.tourDateTo}
                      dataFormat={config.momentDateFormat}
                      minDate={
                        this.state.tourDateFrom ? this.state.tourDateFrom : null
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </div>
            <div
              className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
              style={noMargin}
            >
              <FormControl component="fieldset" margin="dense">
                <div style={{ display: `flex` }}>
                  <div style={{ paddingRight: `10px` }}>
                    <FormLabel>Purchase date</FormLabel>
                  </div>
                  <div style={{ paddingRight: `10px` }}>
                    <DatePicker
                      locale="en-AU"
                      onChange={(value) => {
                        this.filter(`purchaseDateFrom`, value);
                      }}
                      value={this.state.purchaseDateFrom}
                      dataFormat={config.momentDateFormat}
                      maxDate={
                        this.state.purchaseDateTo
                          ? this.state.purchaseDateTo
                          : null
                      }
                    />
                  </div>
                  <div>
                    <DatePicker
                      locale="en-AU"
                      onChange={(value) => {
                        this.filter(`purchaseDateTo`, value);
                      }}
                      value={this.state.purchaseDateTo}
                      dataFormat={config.momentDateFormat}
                      minDate={
                        this.state.purchaseDateFrom
                          ? this.state.purchaseDateFrom
                          : null
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </div>
          </div>
          {advancedFilters}
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
                style={{ marginRight: `10px` }}
              >
                <SearchIcon className={this.props.classes.leftIcon} />
                Search
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={this.toggleAdvancedFilters}
                style={{ marginRight: `10px` }}
              >
                {advancedFiltersIcon}
                {this.state.showAdvancedFilters
                  ? `Hide advanced filters`
                  : `Show advanced filters`}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={this.clearFilters}
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

PurchasesSearchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  purchases: PropTypes.object.isRequired,
  purchasesLoading: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

/* eslint-disable */
function mapStateToProps(state) {
  const { productReducer, purchaseReducer, customerReducer, userReducer } =
    state;
  const { products } = productReducer;
  const { purchases, purchasesLoading } = purchaseReducer;
  const { customers } = customerReducer;
  const { users } = userReducer;
  return { products, purchasesLoading, purchases, customers, users };
}

export default withStyles(styles)(
  connect(mapStateToProps)(PurchasesSearchPage),
);
