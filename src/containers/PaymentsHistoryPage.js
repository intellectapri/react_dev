import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import PaymentsHistoryTable from "../components/PaymentsHistoryTable";
import { getTourPurchase, getMiscPurchase } from "../middleware/api/purchases";

const TYPE_TOUR = 1;
const TYPE_MISC = 2;

class PaymentsHistoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purchase: false,
      type: TYPE_TOUR,
    };

    props.dispatch(setActivePageTitle(`Payments history`));
  }

  componentWillMount() {
    getMiscPurchase(this.props.params.id).then((miscPurchase) => {
      if (miscPurchase.tourPurchase === false) {
        this.setState({
          type: TYPE_MISC,
          purchase: miscPurchase,
        });
      } else {
        getTourPurchase(this.props.params.id).then((purchase) => {
          this.setState({
            type: TYPE_TOUR,
            purchase,
          });
        });
      }
    });
  }

  render() {
    let url = `/purchases/edit-tour/${this.props.params.id}`;
    if (this.state.type === TYPE_TOUR) {
      url = `/purchases/edit-misc/${this.props.params.id}`;
    }

    return (
      <div>
        <div>
          <Typography variant="h4" gutterBottom>
            Purchase {this.props.params.id}
            <Link
              to={url}
              className="no-underline"
              style={{ paddingLeft: `10px` }}
            >
              <Button color="primary" variant="contained">
                Edit
              </Button>
            </Link>
          </Typography>
        </div>
        <div>
          <PaymentsHistoryTable purchaseId={parseInt(this.props.params.id)} />
        </div>
        <div style={{ paddingTop: `10px` }}>
          <Link
            to={`/purchases/${this.props.params.id}/payment`}
            className="no-underline"
          >
            <Button color="primary" variant="contained">
              Add payment
            </Button>
          </Link>
          <Link
            to={`/purchases/${this.props.params.id}/refund`}
            className="no-underline"
            style={{ paddingLeft: `10px` }}
          >
            <Button variant="contained">Add refund</Button>
          </Link>
        </div>
      </div>
    );
  }
}

PaymentsHistoryPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(PaymentsHistoryPage);
