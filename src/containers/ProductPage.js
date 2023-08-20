import React from "react";
import moment from "moment";
import { Link } from "react-router";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaTimePickerField from "../components/BonzaTimePickerField";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaNotification from "../components/BonzaNotification";

import { requestProducts } from "./../actions/product";
import {
  getProductTypes,
  getProduct,
  createProduct,
  updateProduct,
} from "../middleware/api/products";
import { getEmailTemplates } from "../middleware/api/emailTemplates";

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
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const noMargin = { marginBottom: `0px` };

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      productTypes: [],
      emailTemplates: [],

      productWasCreated: false,
      productWasUpdated: false,

      productInformationSectionCollapsed: false,
      pricingInformationSectionCollapsed: false,
      departuresSectionCollapsed: false,
      emailConfirmationSectionCollapsed: false,

      name: ``,
      typeCode: false,
      cutoff: 0,
      minGuestNo: 0,
      basePrice: 0,
      childPrice: 0,
      familyRate: 0,
      additionalRate: 0,
      employeePrice: 0,
      isAvailable: "Y",
      includeInUpcomingTourReport: 0,

      availabilityMon: null,
      availabilityTue: null,
      availabilityWed: null,
      availabilityThu: null,
      availabilityFri: null,
      availabilitySat: null,
      availabilitySun: null,
      templateCode: ``,
      tourOperatorEmail: ``,
      isProductVoucherType: false,
      validationErrors: [],
    };

    this.togglePanel = this.togglePanel.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    if (props.params.id) {
      props.dispatch(setActivePageTitle(`Edit product`));
    } else {
      props.dispatch(setActivePageTitle(`Add product`));
    }
  }

  componentWillMount() {
    getEmailTemplates()
      .then((emailTemplates) => {
        getProductTypes()
          .then((productTypes) => {
            if (this.props.params.id) {
              getProduct(this.props.params.id)
                .then((editedProduct) => {
                  editedProduct.loading = false;
                  editedProduct.productTypes = productTypes;
                  editedProduct.emailTemplates = emailTemplates;

                  [
                    `availabilityMon`,
                    `availabilityTue`,
                    `availabilityWed`,
                    `availabilityThu`,
                    `availabilityFri`,
                    `availabilitySat`,
                    `availabilitySun`,
                  ].map((item) => {
                    editedProduct[item] = editedProduct[item]
                      ? moment(editedProduct[item], `HH:mm:ss`).toDate()
                      : null;
                  });
                  if (editedProduct.typeCode === "VOUCHERS") {
                    editedProduct.isProductVoucherType = true;
                  }
                  this.setState(editedProduct);
                })
                .catch(() => {
                  this.setState({
                    loading: false,
                    validationErrors: [
                      `Unable to get the product with identifier ${this.props.params.id}`,
                    ],
                  });
                });
            } else {
              this.setState({
                emailTemplates,
                productTypes,
                loading: false,
              });
            }
          })
          .catch(() => {
            this.setState({
              loading: false,
              validationErrors: [`Unable to get the product types`],
            });
          });
      })
      .catch(() => {
        this.setState({
          loading: false,
          validationErrors: [`Unable to get the email templates`],
        });
      });
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
        errors.push(`Name can not be empty`);
      }

      if (!this.state.typeCode) {
        errors.push(`Product type can not be empty`);
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
        [`name`, `typeCode`, `templateCode`, `tourOperatorEmail`].map(
          (item) => {
            data[item] = this.state[item] ? this.state[item].toString() : ``;
          },
        );

        [
          `cutoff`,
          `minGuestNo`,
          `basePrice`,
          `childPrice`,
          `familyRate`,
          `isAvailable`,
          `includeInUpcomingTourReport`,
          `additionalRate`,
          `employeePrice`,
        ].map((item) => {
          data[item] = this.state[item] ? this.state[item].toString() : `0`;
        });

        [
          `availabilityMon`,
          `availabilityTue`,
          `availabilityWed`,
          `availabilityThu`,
          `availabilityFri`,
          `availabilitySat`,
          `availabilitySun`,
        ].map((item) => {
          data[item] = this.state[item]
            ? moment(this.state[item]).format(`HH:mm:ss`)
            : ``;
        });

        this.setState({ loading: true });
        if (this.state.productId > 0) {
          updateProduct(this.state.productId, data)
            .then(() => {
              this.props.dispatch(requestProducts());
              this.setState({ productWasUpdated: true });
            })
            .catch(() => {
              this.setState({
                loading: false,
                validationErrors: [`Error occured while updating product`],
              });
            });
        } else {
          createProduct(data)
            .then((identifiers) => {
              this.props.dispatch(requestProducts());
              this.setState({
                productId: identifiers.id,
                productWasCreated: true,
              });
            })
            .catch(() => {
              this.setState({
                loading: false,
                validationErrors: [`Error occured while creating product`],
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
    this.setState({ [name]: value });
    if (name === "typeCode") {
      this.setState((state) => {
        return {
          ...state,
          isProductVoucherType: value === "VOUCHERS",
        };
      });
    }
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

      if (this.state.productWasCreated || this.state.productWasUpdated) {
        let text = <p>Product was created</p>;
        let link = (
          <p>
            <Link
              to={`/products/edit/${this.state.productId}`}
              className="no-underline"
            >
              <Button variant="contained" color="primary">
                Edit product
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
        if (this.state.productWasUpdated) {
          text = <p>Product was updated</p>;
          link = (
            <p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({
                    loading: false,
                    productWasUpdated: false,
                  });
                }}
              >
                Back to editing product
              </Button>
            </p>
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

    let availabilityFields = [];
    [
      `Monday`,
      `Tuesday`,
      `Wednesday`,
      `Thursday`,
      `Friday`,
      `Saturday`,
      `Sunday`,
    ].map((dayOfTheWeek) => {
      availabilityFields.push(
        <div className="row" key={`day_${dayOfTheWeek}`}>
          <div
            className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
            style={noMargin}
          >
            <BonzaTimePickerField
              title={dayOfTheWeek}
              value={this.state[`availability${dayOfTheWeek.substring(0, 3)}`]}
              fullWidth={true}
              name={`availability${dayOfTheWeek.substring(0, 3)}`}
              onChange={this.setValue}
            />
          </div>
        </div>,
      );
    });

    return (
      <div style={{ position: `relative` }}>
        {overlay}
        {this.state.productTypes ? (
          <div style={{ paddingBottom: `10px` }}>
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                style={noMargin}
              >
                <ExpansionPanel
                  expanded={!this.state.productInformationSectionCollapsed}
                  onChange={() => {
                    this.togglePanel(`productInformationSectionCollapsed`);
                  }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div>
                      <div style={{ float: `left`, paddingRight: `10px` }}>
                        <InfoIcon />
                      </div>{" "}
                      Product information
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: `100%` }}>
                      <div className="row">
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Name"
                            value={this.state.name}
                            fullWidth={true}
                            name="name"
                            onChange={this.setValue}
                          />
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          <BonzaSelectField
                            title="Product type"
                            options={this.state.productTypes}
                            value={this.state.typeCode}
                            optionsIdField="typeCode"
                            optionsTitleField="name"
                            fullWidth={true}
                            name="typeCode"
                            onChange={this.setValue}
                          />
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          {!this.state.isProductVoucherType && (
                            <BonzaTextField
                              title="Booking cutoff"
                              type="number"
                              value={this.state.cutoff}
                              fullWidth={true}
                              name="cutoff"
                              onChange={this.setValue}
                            />
                          )}
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          {!this.state.isProductVoucherType && (
                            <BonzaTextField
                              title="Minimum guest number"
                              type="number"
                              value={this.state.minGuestNo}
                              fullWidth={true}
                              name="minGuestNo"
                              onChange={this.setValue}
                            />
                          )}
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          <BonzaSelectField
                            title="Purchase via website"
                            type="number"
                            options={[
                              { value: "Y", title: "Available" },
                              { value: "N", title: "Not available" },
                            ]}
                            optionsIdField="value"
                            optionsTitleField="title"
                            value={this.state.isAvailable}
                            name="isAvailable"
                            onChange={this.setValue}
                          />
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                          style={noMargin}
                        >
                          <BonzaBooleanField
                            title="Include in Upcoming tour purchase report"
                            value={this.state.includeInUpcomingTourReport}
                            name="includeInUpcomingTourReport"
                            onChange={this.setValue}
                          />
                        </div>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel
                  expanded={!this.state.pricingInformationSectionCollapsed}
                  onChange={() => {
                    this.togglePanel(`pricingInformationSectionCollapsed`);
                  }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div>
                      <div style={{ float: `left`, paddingRight: `10px` }}>
                        <PersonIcon />
                      </div>{" "}
                      Pricing information
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: `100%` }}>
                      <div className="row">
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Base price"
                            value={this.state.basePrice}
                            type="number"
                            fullWidth={true}
                            name="basePrice"
                            onChange={this.setValue}
                          />
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          {!this.state.isProductVoucherType && (
                            <BonzaTextField
                              title="Child price"
                              value={this.state.childPrice}
                              type="number"
                              fullWidth={true}
                              name="childPrice"
                              onChange={this.setValue}
                            />
                          )}
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          {!this.state.isProductVoucherType && (
                            <BonzaTextField
                              title="Family rate"
                              type="number"
                              value={this.state.familyRate}
                              fullWidth={true}
                              name="familyRate"
                              onChange={this.setValue}
                            />
                          )}
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                          style={noMargin}
                        >
                          {!this.state.isProductVoucherType && (
                            <BonzaTextField
                              title="Additional family rate"
                              type="number"
                              value={this.state.additionalRate}
                              fullWidth={true}
                              name="additionalRate"
                              onChange={this.setValue}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel
                  expanded={!this.state.departuresSectionCollapsed}
                  onChange={() => {
                    this.togglePanel(`departuresSectionCollapsed`);
                  }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div>
                      <div style={{ float: `left`, paddingRight: `10px` }}>
                        <CalendarTodayIcon />
                      </div>{" "}
                      Departures
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: `100%` }}>{availabilityFields}</div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel
                  expanded={!this.state.emailConfirmationSectionCollapsed}
                  onChange={() => {
                    this.togglePanel(`emailConfirmationSectionCollapsed`);
                  }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div>
                      <div style={{ float: `left`, paddingRight: `10px` }}>
                        <CreateIcon />
                      </div>{" "}
                      Email confirmation
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: `100%` }}>
                      <div className="row">
                        <div
                          className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                          style={noMargin}
                        >
                          <BonzaSelectField
                            title="Email confirmation template"
                            options={this.state.emailTemplates}
                            value={this.state.templateCode}
                            optionsIdField="templateCode"
                            optionsTitleField="title"
                            fullWidth={true}
                            name="templateCode"
                            onChange={this.setValue}
                          />
                        </div>
                        <div
                          className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Tour operator email address"
                            value={this.state.tourOperatorEmail}
                            fullWidth={true}
                            name="tourOperatorEmail"
                            onChange={this.setValue}
                          />
                        </div>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                {this.state.productId > 0 ? (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.onFormSubmit}
                    >
                      Update product
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
        ) : (
          false
        )}
        <BonzaNotification
          errors={this.state.validationErrors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ProductPage);
