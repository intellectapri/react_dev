import React from "react";
import { Link } from "react-router";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaPaymentMethodSelect from "../components/BonzaPaymentMethodSelect";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaNotification from "../components/BonzaNotification";

import {
  getBookingPartner,
  createBookingPartner,
  updateBookingPartner,
  deleteBookingPartner,
} from "../middleware/api/bookingPartners";
import { requestCustomers } from "../actions/customer";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";
import InfoIcon from "@material-ui/icons/Info";
import PersonIcon from "@material-ui/icons/Person";
import CreateIcon from "@material-ui/icons/Create";

const noMargin = { marginBottom: `0px` };

const initialState = {
  loading: false,

  customerId: false,
  name: ``,
  emailConfirmation: 0,
  commissionLevel: 0,
  paymentMethod: false,
  reservationConfirmEmail: ``,
  customerNotes: ``,

  contactFirstname: ``,
  contactLastname: ``,
  contactEmail: ``,
  address: ``,
  city: ``,
  state: ``,
  postcode: ``,
  country: ``,
  reservationPhone: ``,
  blackoutPhone: ``,
  phone: ``,
  website: ``,
  reservationEmail: ``,

  AdultOverridePriceNett: 0,
  ChildOverridePriceNett: 0,
  FamilyOverridePriceNett: 0,
  FamilyAdditionalOverridePriceNett: 0,

  adultPrice: 0,
  childPrice: 0,
  familyPrice: 0,
  familyAdditionalRiderPrice: 0,

  bookingPartnerWasCreated: false,
  bookingPartnerWasUpdated: false,

  bookingPartnerDetailsSectionCollapsed: false,
  contactDetailsSectionCollapsed: false,
  overridePricesSectionCollapsed: false,

  validationErrors: [],
};

class BookingPartnerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.togglePanel = this.togglePanel.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteBookingPartnerHandle =
      this.deleteBookingPartnerHandle.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    if (props.params.id) {
      props.dispatch(setActivePageTitle(`Edit booking partner`));
    } else {
      props.dispatch(setActivePageTitle(`Add booking partner`));
    }
  }

  componentWillMount() {
    if (this.props.params.id) {
      this.setState({ loading: true });
      getBookingPartner(this.props.params.id)
        .then((editedBookingPartner) => {
          let commissionLevel = editedBookingPartner.commissionLevel
            ? parseFloat(editedBookingPartner.commissionLevel)
            : 0;

          if (editedBookingPartner.adultPrice)
            editedBookingPartner.AdultOverridePriceNett =
              (parseFloat(editedBookingPartner.adultPrice) / 100) *
              (100 - commissionLevel);
          if (editedBookingPartner.childPrice)
            editedBookingPartner.ChildOverridePriceNett =
              (parseFloat(editedBookingPartner.childPrice) / 100) *
              (100 - commissionLevel);
          if (editedBookingPartner.familyPrice)
            editedBookingPartner.FamilyOverridePriceNett =
              (parseFloat(editedBookingPartner.familyPrice) / 100) *
              (100 - commissionLevel);
          if (editedBookingPartner.familyAdditionalRiderPrice)
            editedBookingPartner.FamilyAdditionalOverridePriceNett =
              (parseFloat(editedBookingPartner.familyAdditionalRiderPrice) /
                100) *
              (100 - commissionLevel);

          [
            `reservationConfirmEmail`,
            `contactFirstname`,
            `customerNotes`,
            `contactLastname`,
            `contactEmail`,
            `address`,
            `city`,
            `state`,
            `postcode`,
            `country`,
            `reservationPhone`,
            `blackoutPhone`,
            `phone`,
            `website`,
            `reservationEmail`,
          ].map((item) => {
            if (editedBookingPartner[item] === null) {
              editedBookingPartner[item] = ``;
            }
          });

          editedBookingPartner.loading = false;
          this.setState(editedBookingPartner);
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [
              `Unable to get the booking partner with identifier ${this.props.params.id}`,
            ],
          });
        });
    }
  }

  deleteBookingPartnerHandle() {
    if (confirm(`Delete ${this.state.name}?`)) {
      this.setState({ loading: true });
      deleteBookingPartner(this.state.customerId)
        .then(() => {
          this.setState({ loading: false });
          this.props.router.push(`/booking-partners`);
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            loading: false,
            validationErrors: [`Error occured while deleting booking partner`],
          });
        });
    }
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      validationErrors: [],
    });
  };

  validate() {
    return new Promise((resolve, reject) => {
      let errors = [];

      if (!this.state.name) {
        errors.push(`Booking partner name can not be empty`);
      }

      if (!this.state.commissionLevel && this.state.commissionLevel !== 0) {
        errors.push(`Commission level should be defined`);
      }

      if (this.state.emailConfirmation && !this.state.reservationConfirmEmail) {
        errors.push(
          `Email confirmation is enabled, but the email address is missing`,
        );
      }

      if (!this.state.paymentMethod) {
        errors.push(`Payment method is not defined`);
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
        let data = {};
        [
          `name`,
          `emailConfirmation`,
          `commissionLevel`,
          `paymentMethod`,
          `reservationConfirmEmail`,
          `contactFirstname`,
          `contactLastname`,
          `contactEmail`,
          `customerNotes`,
          `address`,
          `city`,
          `state`,
          `postcode`,
          `country`,
          `reservationPhone`,
          `blackoutPhone`,
          `phone`,
          `website`,
          `reservationEmail`,
          `AdultOverridePriceNett`,
          `ChildOverridePriceNett`,
          `FamilyOverridePriceNett`,
          `FamilyAdditionalOverridePriceNett`,
          `adultPrice`,
          `childPrice`,
          `familyPrice`,
          `familyAdditionalRiderPrice`,
        ].map((item) => {
          data[item] = this.state[item].toString();
        });

        if (data.reservationConfirmEmail)
          data.reservationConfirmEmail = data.reservationConfirmEmail.trim();
        if (data.contactEmail) data.contactEmail = data.contactEmail.trim();
        if (data.reservationEmail)
          data.reservationEmail = data.reservationEmail.trim();

        this.setState({ loading: true });
        if (this.state.customerId > 0) {
          updateBookingPartner(this.state.customerId, data)
            .then(() => {
              this.setState({ bookingPartnerWasUpdated: true });
              this.props.dispatch(requestCustomers());
            })
            .catch(() => {
              this.setState({
                loading: false,
                validationErrors: [
                  `Error occured while updating booking partner`,
                ],
              });
            });
        } else {
          createBookingPartner(data)
            .then((identifiers) => {
              identifiers.bookingPartnerWasCreated = true;
              identifiers.customerId = identifiers.id;
              this.setState(identifiers);
              this.props.dispatch(requestCustomers());
            })
            .catch(() => {
              this.setState({
                loading: false,
                validationErrors: [
                  `Error occured while creating booking partner`,
                ],
              });
            });
        }
      })
      .catch((validationErrors) => {
        this.setState({
          validationErrors: Array.isArray(validationErrors)
            ? validationErrors
            : [validationErrors],
        });
      });
  }

  togglePanel(name) {
    if (name in this.state === false) {
      throw new Error(`Invalid panel name ${name}`);
    }

    this.setState({ [name]: !this.state[name] });
  }

  setValue(name, value) {
    this.setState({ [name]: value }, () => {
      if (
        [
          `adultPrice`,
          `childPrice`,
          `familyPrice`,
          `familyAdditionalRiderPrice`,
          `commissionLevel`,
        ].indexOf(name) > -1
      ) {
        let commissionVal = this.state.commissionLevel
          ? this.state.commissionLevel
          : 0;

        let newState = {};
        let nettPrices = [
          `AdultOverridePriceNett`,
          `ChildOverridePriceNett`,
          `FamilyOverridePriceNett`,
          `FamilyAdditionalOverridePriceNett`,
        ];
        [
          `adultPrice`,
          `childPrice`,
          `familyPrice`,
          `familyAdditionalRiderPrice`,
        ].map((item, index) => {
          if (this.state[item]) {
            newState[nettPrices[index]] =
              parseFloat(this.state[item]) -
              (commissionVal * parseFloat(this.state[item])) / 100;
          } else {
            newState[nettPrices[index]] = 0;
          }
        });

        this.setState(newState);
      }
    });
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

      if (
        this.state.bookingPartnerWasCreated ||
        this.state.bookingPartnerWasUpdated
      ) {
        let text = <p>Booking partner was created</p>;
        let link = (
          <p>
            <Link
              to={`/booking-partners/edit/${this.state.customerId}`}
              className="no-underline"
            >
              <Button variant="contained" color="primary">
                Edit booking partner
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
        if (this.state.bookingPartnerWasUpdated) {
          text = <p>Booking partner was updated</p>;
          link = (
            <div>
              <p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({
                      loading: false,
                      bookingPartnerWasUpdated: false,
                    });
                  }}
                >
                  Back to editing booking partner
                </Button>
              </p>
              <p>
                <Link to={`/booking-partners`} className="no-underline">
                  <Button variant="contained">Back to booking partners</Button>
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

    return (
      <div style={{ position: `relative` }}>
        {overlay}
        <div style={{ paddingBottom: `10px` }}>
          <div className="row">
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
              style={noMargin}
            >
              <ExpansionPanel
                expanded={!this.state.bookingPartnerDetailsSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`bookingPartnerDetailsSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <InfoIcon />
                    </div>{" "}
                    Booking partner details
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Name"
                          value={this.state.name}
                          fullWidth={true}
                          name="name"
                          required={true}
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Commission level"
                          type="number"
                          value={this.state.commissionLevel}
                          fullWidth={true}
                          required={true}
                          name="commissionLevel"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaPaymentMethodSelect
                          value={this.state.paymentMethod}
                          name="paymentMethod"
                          fullWidth={true}
                          required={true}
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Email confirmation"
                          value={this.state.emailConfirmation}
                          name="emailConfirmation"
                          onChange={this.setValue}
                        />
                      </div>
                      {this.state.emailConfirmation ? (
                        <div
                          className="col-xs-12 col-sm-6 col-md-8 col-lg-8 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Master reservations confirmation email"
                            value={this.state.reservationConfirmEmail}
                            fullWidth={true}
                            name="reservationConfirmEmail"
                            onChange={this.setValue}
                          />
                        </div>
                      ) : (
                        false
                      )}
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Booking partner notes"
                          value={this.state.customerNotes}
                          fullWidth={true}
                          multiline={true}
                          rows={4}
                          name="customerNotes"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={!this.state.contactDetailsSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`contactDetailsSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <PersonIcon />
                    </div>{" "}
                    Contact details
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Last name"
                          value={this.state.contactLastname}
                          fullWidth={true}
                          name="contactLastname"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="First name"
                          value={this.state.contactFirstname}
                          fullWidth={true}
                          name="contactFirstname"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Accounting contact email"
                          value={this.state.contactEmail}
                          fullWidth={true}
                          name="contactEmail"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Address"
                          value={this.state.address}
                          fullWidth={true}
                          multiline={true}
                          rows={2}
                          name="address"
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
                          title="City"
                          value={this.state.city}
                          fullWidth={true}
                          name="city"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="State"
                          value={this.state.state}
                          fullWidth={true}
                          name="state"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Country"
                          value={this.state.country}
                          fullWidth={true}
                          name="country"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Postcode"
                          value={this.state.postcode}
                          fullWidth={true}
                          name="postcode"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Reservations phone"
                          value={this.state.reservationPhone}
                          fullWidth={true}
                          name="reservationPhone"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Reservations email"
                          value={this.state.reservationEmail}
                          fullWidth={true}
                          name="reservationEmail"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Phone"
                          value={this.state.phone}
                          fullWidth={true}
                          name="phone"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Blackout phone"
                          value={this.state.blackoutPhone}
                          fullWidth={true}
                          name="blackoutPhone"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Website"
                          value={this.state.website}
                          fullWidth={true}
                          name="website"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={!this.state.overridePricesSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`overridePricesSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <CreateIcon />
                    </div>{" "}
                    Override prices (all prices are applied if at least one
                    price is not empty)
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-1 m-b-15"
                        style={Object.assign({}, noMargin, {
                          paddingTop: `10px`,
                        })}
                      >
                        <strong>Retail:</strong>
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Adult"
                          type="number"
                          value={this.state.adultPrice}
                          fullWidth={true}
                          name="adultPrice"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Child"
                          type="number"
                          value={this.state.childPrice}
                          fullWidth={true}
                          name="childPrice"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Family"
                          type="number"
                          value={this.state.familyPrice}
                          fullWidth={true}
                          name="familyPrice"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-3 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Family additional"
                          type="number"
                          value={this.state.familyAdditionalRiderPrice}
                          fullWidth={true}
                          name="familyAdditionalRiderPrice"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-1 m-b-15"
                        style={Object.assign({}, noMargin, {
                          paddingTop: `10px`,
                        })}
                      >
                        <strong>Nett:</strong>
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Adult"
                          type="number"
                          disabled={true}
                          value={this.state.AdultOverridePriceNett}
                          fullWidth={true}
                          name="AdultOverridePriceNett"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Child"
                          type="number"
                          disabled={true}
                          value={this.state.ChildOverridePriceNett}
                          fullWidth={true}
                          name="ChildOverridePriceNett"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-2 col-lg-2 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Family"
                          type="number"
                          disabled={true}
                          value={this.state.FamilyOverridePriceNett}
                          fullWidth={true}
                          name="FamilyOverridePriceNett"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-4 col-md-3 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Family additional"
                          type="number"
                          disabled={true}
                          value={this.state.FamilyAdditionalOverridePriceNett}
                          fullWidth={true}
                          name="FamilyAdditionalOverridePriceNett"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              {this.state.customerId > 0 ? (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Update booking partner
                  </Button>
                  <Link
                    to={`/booking-partners/${this.state.customerId}/purchases`}
                    className="no-underline"
                  >
                    <Button variant="contained" style={{ marginLeft: `10px` }}>
                      Purchase history
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    onClick={this.deleteBookingPartnerHandle}
                    style={{ marginLeft: `10px` }}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <BonzaNotification
          errors={this.state.validationErrors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default BookingPartnerPage;
