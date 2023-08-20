import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";

import PurchaseBalanceCard from "../components/PurchaseBalanceCard";
import LoadingOverlay from "../components/LoadingOverlay";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaTextField from "../components/BonzaTextField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";
import BonzaPaymentMethodSelect from "../components/BonzaPaymentMethodSelect";

import config from "../config";

import { addPaymentAction, resetAddPaymentAction } from "../actions/charges";
import { getPurchase } from "../middleware/api/purchases";

const initialState = {
  method: ``,
  notes: ``,
  amount: 0,
  date: new Date(),
  purchase: false,
};

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.save = this.save.bind(this);
    this.setValue = this.setValue.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    getPurchase(this.props.purchaseId).then((result) => {
      this.setState({ purchase: result });
    });
  }

  componentWillUnmount() {
    this.props.dispatch(resetAddPaymentAction());
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.historyData &&
      nextProps.historyData.totalNet &&
      nextProps.historyData.history.length === 0
    ) {
      let newState = { amount: nextProps.historyData.totalNet };
      if (nextProps.historyData.bookingPartnerPaymentMethod)
        newState.method = nextProps.historyData.bookingPartnerPaymentMethod;
      this.setState(newState);
    }

    if (nextProps.success) {
      this.setState({ amount: 0 });
    }
  }

  save() {
    this.props.dispatch(
      addPaymentAction(this.props.purchaseId, {
        paymentDate: moment(this.state.date).format(`YYYY-MM-DD`),
        amount: this.state.amount,
        method: this.state.method,
        internalNotes: this.state.notes,
      }),
    );
  }

  setValue(name, value) {
    if (name === `amount` && isNaN(value)) {
      value = isNaN(value) ? 0 : parseFloat(value);
    }

    this.setState({ [name]: value });
  }

  isValid(balance = 0) {
    if (this.state.method === ``) return false;
    if (!this.state.amount || parseFloat(this.state.amount) <= 0) return false;
    return true;
  }

  reset() {
    this.setState(initialState);
    this.props.dispatch(resetAddPaymentAction());
  }

  render() {
    let totalNet = 0,
      paymentsReceived = 0,
      refundsPaid = 0,
      balance = 0;
    if (this.props.historyData) {
      totalNet = this.props.historyData.totalNet;
      if (this.props.historyData.history.length > 0) {
        this.props.historyData.history.map((item) => {
          if (item.type === `payment`) {
            paymentsReceived = paymentsReceived + parseFloat(item.amount);
          } else if (item.type === `refund`) {
            refundsPaid = refundsPaid + parseFloat(item.amount);
          } else {
            throw new Error(`Unrecognized charge type "${item.type}"`);
          }
        });
      }

      paymentsReceived = paymentsReceived + parseFloat(this.state.amount);

      balance = totalNet - paymentsReceived + refundsPaid;
    }

    let actionButton = (
      <Button
        disabled={!this.isValid(balance)}
        variant="contained"
        color="primary"
        onClick={this.save}
      >
        Process payment
      </Button>
    );
    if (balance < 0) {
      actionButton = (
        <Button disabled={true} variant="contained" color="primary">
          No need to make another payment
        </Button>
      );
    }

    let overlay = false;
    if (this.props.loading) {
      overlay = <LoadingOverlay />;
    }

    if (this.props.success) {
      let url = `/purchases/edit-tour/${this.props.purchaseId}`;
      if (this.state.purchase.purchaseType === `misc`) {
        url = `/purchases/edit-misc/${this.props.purchaseId}`;
      }

      overlay = (
        <LoadingOverlay
          top="10%"
          component={
            <div>
              <CheckIcon color="primary" style={{ fontSize: 80 }} />
              <br />
              <p>Payment was added</p>
              <div>
                <Link to={url} className="no-underline">
                  <Button variant="contained">Edit purchase</Button>
                </Link>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Button
                  variant="contained"
                  className="button-green"
                  onClick={this.reset}
                >
                  New payment
                </Button>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Link to="/reports/payments-received" className="no-underline">
                  <Button variant="contained" color="primary">
                    Payments received report
                  </Button>
                </Link>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Link to="/" className="no-underline">
                  <Button variant="contained" color="primary">
                    Back to home
                  </Button>
                </Link>
              </div>
            </div>
          }
        />
      );
    }

    return (
      <div style={{ position: `relative` }}>
        {overlay}
        <div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15">
              <BonzaPaymentMethodSelect
                value={this.state.method}
                required={true}
                name="method"
                onChange={this.setValue}
              />
              <BonzaTextField
                title="Total payment amount"
                value={this.state.amount}
                required={true}
                name="amount"
                type="number"
                prefix="$"
                onChange={this.setValue}
              />
              <BonzaDatePickerField
                title="Payment date"
                value={this.state.date}
                required={true}
                name="date"
                onChange={this.setValue}
              />
              <BonzaTextField
                title="Internal notes"
                value={this.state.notes}
                fullWidth={true}
                name="notes"
                multiline="true"
                rows={2}
                onChange={this.setValue}
              />

              <div style={{ paddingTop: `15px` }}>{actionButton}</div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15">
              <PurchaseBalanceCard
                purchaseId={this.props.purchaseId}
                totalNet={totalNet}
                paymentsReceived={paymentsReceived}
                refundsPaid={refundsPaid}
                balance={balance}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PaymentForm.propTypes = {
  purchaseId: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  const { chargeReducer, purchaseReducer } = state;
  const { purchaseHistory } = purchaseReducer;
  const { addPaymentLoading, addPaymentSuccess, deleteChargeLoading } =
    chargeReducer;

  return {
    historyData: purchaseHistory,
    loading: addPaymentLoading || deleteChargeLoading,
    success: addPaymentSuccess,
  };
}

export default connect(mapStateToProps)(PaymentForm);
