import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import RefundForm from "../components/RefundForm";
import PaymentsHistoryTable from "../components/PaymentsHistoryTable";

class RefundPage extends React.Component {
  constructor(props) {
    super(props);
    props.dispatch(setActivePageTitle(`Refund`));
  }

  render() {
    return (
      <div>
        <div>
          <Typography variant="h4" gutterBottom>
            Make a refund
            <Link
              to={`/purchases/${this.props.params.id}/payment`}
              className="no-underline"
              style={{ paddingLeft: `20px` }}
            >
              <Button variant="contained" color="primary">
                Switch to take payment
              </Button>
            </Link>
          </Typography>
          <RefundForm purchaseId={parseInt(this.props.params.id)} />
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

RefundPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(RefundPage);
