import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BonzaSelectField from "../../components/BonzaSelectField";
import BonzaDatePickerField from "../../components/BonzaDatePickerField";
import BonzaPaymentMethodSelect from "../../components/BonzaPaymentMethodSelect";
import KeyHandler, { KEYPRESS } from "react-key-handler";

const initialState = {
  fromDate: new Date(),
  toDate: new Date(),
  paymentMethod: false,
  productId: false,
  bookingPartnerId: false,
};

class PaymentsReceivedFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setValue = this.setValue.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear() {
    this.setState(initialState, () => {
      this.props.searchHandler(initialState);
    });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue="Enter"
          onKeyHandle={() => {
            this.props.searchHandler(this.state);
          }}
        />
        <Grid container style={{ flexGrow: `1` }}>
          <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
            <BonzaDatePickerField
              title="Report date from"
              value={this.state.fromDate}
              name="fromDate"
              onChange={(name, value) => {
                this.setState({ [name]: value });
              }}
            />
          </Grid>
          <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
            <BonzaDatePickerField
              title="Report date to"
              value={this.state.toDate}
              name="toDate"
              onChange={(name, value) => {
                this.setState({ [name]: value });
              }}
            />
          </Grid>
          <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
            <BonzaPaymentMethodSelect
              value={this.state.paymentMethod}
              name="paymentMethod"
              onChange={this.setValue}
            />
          </Grid>
        </Grid>
        <Grid container style={{ flexGrow: `1` }}>
          <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
            <BonzaSelectField
              title="Product"
              name="productId"
              value={this.state.productId}
              options={this.props.products}
              optionsIdField="productId"
              optionsTitleField="name"
              onChange={this.setValue}
            />
          </Grid>
          <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
            <BonzaSelectField
              title="Booking partner"
              name="bookingPartnerId"
              value={this.state.bookingPartnerId}
              options={this.props.bookingPartners}
              optionsIdField="customerID"
              optionsTitleField="name"
              onChange={this.setValue}
            />
          </Grid>
          <Grid
            item
            style={{ flexGrow: `1`, flexBasis: `0`, textAlign: `right` }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.props.searchHandler(this.state);
              }}
              style={{ marginRight: `10px` }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              onClick={this.clear}
              style={{ marginRight: `10px` }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                this.props.exportHanlder(this.state);
              }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PaymentsReceivedFilter.propTypes = {
  products: PropTypes.array.isRequired,
  bookingPartners: PropTypes.array.isRequired,
  searchHandler: PropTypes.func.isRequired,
  exportHanlder: PropTypes.func.isRequired,
};

export default PaymentsReceivedFilter;
