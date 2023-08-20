import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";

import PurchaseBalanceCard from "../components/PurchaseBalanceCard";
import LoadingOverlay from "../components/LoadingOverlay";
import BonzaPaymentMethodSelect from "../components/BonzaPaymentMethodSelect";
import BonzaTextField from "../components/BonzaTextField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";

import { addRefundAction, resetAddRefundAction } from "../actions/charges";
import { getPurchase } from "../middleware/api/purchases";

const initialState = {
  method: ``,
  notes: ``,
  reason: ``,
  amount: 0,
  date: new Date(),
  errors: [],
  purchase: false,
};

class RefundForm extends React.Component {
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
    this.props.dispatch(resetAddRefundAction());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.setState({ amount: 0 });
    }
  }

  save() {
    this.props.dispatch(
      addRefundAction(this.props.purchaseId, {
        paymentDate: moment(this.state.date).format(`YYYY-MM-DD`),
        amount: this.state.amount,
        method: this.state.method,
        internalNotes: this.state.notes,
        refundReason: this.state.reason,
      }),
    );
  }

  setValue(name, value) {
    if (name === `amount` && isNaN(value)) {
      value = isNaN(value) ? 0 : parseFloat(value);
    }

    this.setState({ [name]: value });
  }

  isValid(paymentsReceived = 0) {
    if (this.state.method === ``) return false;
    if (this.state.reason === ``) return false;
    if (!this.state.amount || parseFloat(this.state.amount) <= 0) return false;
    if (parseFloat(this.state.amount) > paymentsReceived) return false;
    return true;
  }

  reset() {
    this.setState(initialState);
    this.props.dispatch(resetAddRefundAction());
  }

  render() {
    let totalNet = 0,
      paymentsReceived = 0,
      refundsPaid = 0,
      leftToPayToCompany = 0;
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

      refundsPaid =
        refundsPaid + parseFloat(this.state.amount ? this.state.amount : 0);

      leftToPayToCompany = totalNet - paymentsReceived + refundsPaid;
    }

    let actionButton = (
      <Button
        disabled={!this.isValid(paymentsReceived)}
        variant="contained"
        color="primary"
        onClick={this.save}
      >
        Process refund
      </Button>
    );

    if (leftToPayToCompany > totalNet) {
      actionButton = (
        <Button disabled={true} variant="contained" color="primary">
          Unable to make refund (amount left to pay is bigger than total net)
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
              <p>Refund was added</p>
              <div>
                <Link to={url} className="no-underline">
                  <Button variant="contained">Edit purchase</Button>
                </Link>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Link
                  to={`/purchases/${this.props.purchaseId}/history`}
                  className="no-underline"
                >
                  <Button variant="contained" className="button-green">
                    Manage payments
                  </Button>
                </Link>
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
                title="Total refund amount"
                value={this.state.amount}
                required={true}
                name="amount"
                type="number"
                prefix="$-"
                onChange={this.setValue}
              />
              <BonzaDatePickerField
                title="Refund date"
                value={this.state.date}
                required={true}
                name="date"
                onChange={this.setValue}
              />
              <BonzaTextField
                title="Refund reason"
                value={this.state.reason}
                fullWidth={true}
                required={true}
                name="reason"
                multiline="true"
                rows={2}
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
                balance={leftToPayToCompany}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RefundForm.propTypes = {
  purchaseId: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  const { chargeReducer, purchaseReducer } = state;
  const { purchaseHistory } = purchaseReducer;
  const { addRefundLoading, addRefundSuccess, deleteChargeLoading } =
    chargeReducer;

  return {
    historyData: purchaseHistory,
    loading: addRefundLoading || deleteChargeLoading,
    success: addRefundSuccess,
  };
}

export default connect(mapStateToProps)(RefundForm);
