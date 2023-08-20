import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import PaymentForm from "../components/PaymentForm";
import PaymentsHistoryTable from "../components/PaymentsHistoryTable";

class PaymentPage extends React.Component {
  constructor(props) {
    super(props);
    props.dispatch(setActivePageTitle(`Payment`));
  }

  render() {
    return (
      <div>
        <div>
          <Typography variant="h4" gutterBottom>
            Make a payment
            <Link
              to={`/purchases/${this.props.params.id}/refund`}
              className="no-underline"
              style={{ paddingLeft: `20px` }}
            >
              <Button variant="contained" color="primary">
                Switch to make refund
              </Button>
            </Link>
          </Typography>
          <PaymentForm purchaseId={parseInt(this.props.params.id)} />
        </div>
        <Divider />
        <div>
          <Typography variant="h5" gutterBottom>
            Payments history
          </Typography>
          <PaymentsHistoryTable purchaseId={parseInt(this.props.params.id)} />
        </div>
      </div>
    );
  }
}

PaymentPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(PaymentPage);
