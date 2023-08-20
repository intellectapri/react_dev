import React from "react";
import { Link } from "react-router";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import LoadingOverlay from "../components/LoadingOverlay";
import PurchasesSearchResultTable from "../components/PurchasesSearchResultTable";

import { setActivePageTitle } from "../actions/settings";
import {
  getBookingPartner,
  getBookingPartnerPurchases,
} from "../middleware/api/bookingPartners";

const noMargin = { marginBottom: `0px` };

class BookingPartnerPurchasesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingPartner: false,
      purchases: [],
      loading: true,
    };

    props.dispatch(setActivePageTitle(`Booking partner purchases`));
  }

  componentWillMount() {
    getBookingPartner(this.props.params.id)
      .then((bookingPartner) => {
        getBookingPartnerPurchases(this.props.params.id)
          .then((purchases) => {
            this.setState({
              bookingPartner,
              purchases,
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ loading: false });
          });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  render() {
    let loadingOverlay = false;
    let purchases = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    } else {
      purchases = <div>No purchases found</div>;
      if (this.state.purchases && this.state.purchases.length > 0) {
        purchases = (
          <PurchasesSearchResultTable data={{ data: this.state.purchases }} />
        );
      }
    }

    return (
      <div>
        {loadingOverlay}
        {this.state.bookingPartner ? (
          <div style={{ paddingBottom: `10px` }}>
            <div className="row" style={{ backgroundColor: `white` }}>
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                style={noMargin}
              >
                <Typography variant="h5" gutterBottom>
                  {this.state.bookingPartner.name} purchases
                  <Link
                    to={`/booking-partners/edit/${this.state.bookingPartner.customerId}`}
                    className="no-underline"
                    style={{ marginLeft: `10px` }}
                  >
                    <Button variant="contained" size="small" color="primary">
                      Edit booking partner
                    </Button>
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        <Divider />
        <div className="row" style={{ backgroundColor: `white` }}>
          <div
            className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
            style={noMargin}
          >
            {purchases}
          </div>
        </div>
      </div>
    );
  }
}

export default BookingPartnerPurchasesPage;
