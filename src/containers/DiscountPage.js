import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import {
  getDiscount,
  updateDiscount,
  createDiscount,
} from "../middleware/api/discounts";
import moment from "moment";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";
import BonzaBooleanField from "../components/BonzaBooleanField";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";
import InfoIcon from "@material-ui/icons/Info";
import PersonIcon from "@material-ui/icons/Person";

const noMargin = { margin: "0px" };
class DiscountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //discountType: ['Figure', 'Percentage'],
      discountTypes: [
        { name: "ABSOLUTE", label: "Dollar Value", symbol: "$" },
        { name: "RELATIVE", label: "Percentage", symbol: "%" },
      ],
      discountType: "RELATIVE",
      discountCode: "",
      discountAmount: 0,
      expireDate: null,
      oneTimeUse: 0,
      discountID: 0,
      active: 0,
      productInformationSectionCollapsed: false,
      useCount: 0,
      validationErrors: [],
      loading: false,
      discountUpdated: false,
    };
    const pageTitle = props.params.id ? "Edit Discount" : "Add Discount";
    props.dispatch(setActivePageTitle(pageTitle));
  }
  componentWillMount() {
    if (this.props.params.id) {
      this.setState({ loading: true });

      getDiscount(this.props.params.id)
        .then((resp) => {
          this.setState((state) => {
            return {
              ...state,
              ...resp,
              expireDate: new Date(resp.expireDate),
              loading: false,
            };
          });
        })
        .catch((err) => {
          this.setState((state) => {
            return {
              ...state,
              validationErrors: ["Not able to load discount"],
            };
          });
          this.setState({ loading: false });
        });
    }
  }
  setValue = (name, value) => {
    this.setState((state) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };
  onFormSubmit = () => {
    const data = {
      discountCode: this.state.discountCode,
      discountType: this.state.discountType,
      discountAmount: this.state.discountAmount,
      expireDate: moment(this.state.expireDate).format(`YYYY-MM-DD`),
      active: this.state.active,
      oneTimeUse: this.state.oneTimeUse,
      useCount: this.state.useCount,
    };

    if (!this.state.discountID) {
      if (moment() > moment(data.expireDate)) {
        this.setState({ validationErrors: ["Date is in the past!"] });
        return;
      }
      createDiscount(data)
        .then((res) => {
          this.setState(
            (state) => {
              return {
                ...state,
                discountUpdated: true,
              };
            },
            () => {
              this.setState((newState) => ({
                discountID: 0,
                discountType: "RELATIVE",
                discountCode: "",
                discountAmount: 0,
                active: 0,
                oneTimeUse: 0,
                expireDate: null,
              }));
            },
          );
        })
        .catch((err) => {
          this.setState((state) => {
            return {
              ...state,
              validationErrors: ["there is validation error"],
            };
          });
        });
    } else {
      console.log(data);
      updateDiscount(this.state.discountID, data)
        .then((res) => {
          this.setState((state) => {
            return {
              ...state,
              discountUpdated: true,
            };
          });
        })
        .catch((err) => {
          this.setState((state) => {
            return {
              ...state,
              validationErrors: ["there is validation error"],
            };
          });
        });
    }
  };
  handleClose = (caller) => {
    this.setState((state) => {
      if (caller === "success") {
        state.discountUpdated = false;
      }
      return {
        ...state,
        validationErrors: [],
      };
    });
  };
  render() {
    let overlayContent = false;
    if (this.state.loading) {
      overlayContent = (
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
    }
    let selectedType = this.state.discountTypes.find((discountType) => {
      return discountType.name === this.state.discountType;
    });
    let symbol = "%";
    if (selectedType) {
      symbol = selectedType.symbol;
    }
    let maxAttr = this.state.discountType === "RELATIVE" ? 'max="100"' : "";
    return (
      <div>
        {overlayContent}

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
                    Discount Information
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
                          title="Discount Code"
                          value={this.state.discountCode}
                          fullWidth={true}
                          name="discountCode"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaSelectField
                          title="Discount type"
                          options={this.state.discountTypes}
                          value={this.state.discountType}
                          optionsIdField="name"
                          optionsTitleField="label"
                          fullWidth={true}
                          name="discountType"
                          onChange={this.setValue}
                        />
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="One time use"
                          value={this.state.oneTimeUse}
                          name="oneTimeUse"
                          onChange={this.setValue}
                          checked={this.state.oneTimeUse}
                        />
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "2rem" }}>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaDatePickerField
                          title="Expire Date"
                          value={this.state.expireDate}
                          fullWidth={true}
                          name="expireDate"
                          onChange={this.setValue}
                        />
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <span>
                          <BonzaTextField
                            title="Discount Amount"
                            value={this.state.discountAmount}
                            type="number"
                            {...maxAttr}
                            step="1"
                            name="discountAmount"
                            onChange={this.setValue}
                          />
                        </span>
                        <span
                          style={{ marginTop: "8px", display: "inline-block" }}
                        >
                          {symbol}
                        </span>
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Active"
                          value={this.state.active}
                          name="active"
                          onChange={this.setValue}
                          checked={this.state.active}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                {" "}
                Number of Times this code has been used: {
                  this.state.useCount
                }{" "}
              </div>

              {this.state.discountID > 0 ? (
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Update discount
                  </Button>
                </div>
              ) : (
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Create
                  </Button>
                </div>
              )}
              <Link
                to="/discounts"
                style={{ marginLeft: "30px" }}
                className="no-underline"
              >
                <Button variant="contained">All Discounts</Button>
              </Link>
            </div>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.validationErrors.length > 0}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={
            <div>
              {this.state.validationErrors.map((item, index) => (
                <p key={`error_message_${index}`}>{item}</p>
              ))}
            </div>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.discountUpdated}
          autoHideDuration={6000}
          onClose={this.handleClose.bind(this, "success")}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<div> Success!</div>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose.bind(this, "success")}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}
export default connect()(DiscountPage);
