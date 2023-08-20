import React from "react";
import { Link } from "react-router";
import moment from "moment";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";

import config from "./../config";
import {
  getTourPurchase,
  getMiscPurchase,
} from "./../middleware/api/purchases";

const TYPE_TOUR = 1;
const TYPE_MISC = 2;

class PurchaseBalanceCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: TYPE_TOUR,
      purchase: false,
    };
  }

  componentWillMount() {
    getMiscPurchase(this.props.purchaseId).then((miscPurchase) => {
      if (miscPurchase.tourPurchase === false) {
        this.setState({
          type: TYPE_MISC,
          purchase: miscPurchase,
        });
      } else {
        getTourPurchase(this.props.purchaseId).then((purchase) => {
          this.setState({
            type: TYPE_TOUR,
            purchase,
          });
        });
      }
    });
  }

  render() {
    let infoText = ``;
    if (this.state.type === TYPE_TOUR) {
      let productName = ``;
      this.props.products.map((item) => {
        if (item.productID === this.state.purchase.productID) {
          productName = item.name + ",";
        }
      });

      let totalGuests = 0;
      if (this.state.purchase.family === 0) {
        totalGuests =
          this.state.purchase.noOfAdult + this.state.purchase.noOfChildren;
      } else {
        totalGuests =
          this.state.purchase.noOfFamilyGroups * 4 +
          this.state.purchase.noOfAdditionals +
          this.state.purchase.noOfAddChildren;
      }

      if (productName && totalGuests) {
        infoText = `${
          this.state.purchase.travelerFirstname
            ? this.state.purchase.travelerFirstname
            : ``
        } ${this.state.purchase.travelerLastname}, ${productName} ${moment(
          this.state.purchase.tourDate,
        ).format(config.momentDateFormat)}, ${totalGuests} guests`;
      }
    } else if (this.state.type === TYPE_MISC) {
      infoText = `${this.state.purchase.productName}`;
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Purchase #{this.props.purchaseId}
            {this.state.type === TYPE_TOUR ? (
              <Link
                to={`/purchases/edit-tour/${this.props.purchaseId}`}
                className="no-underline"
                style={{ marginLeft: `10px` }}
              >
                <Button size="small" variant="contained" color="primary">
                  Edit
                </Button>
              </Link>
            ) : (
              false
            )}
            {this.state.type === TYPE_MISC ? (
              <Link
                to={`/purchases/edit-misc/${this.props.purchaseId}`}
                className="no-underline"
                style={{ marginLeft: `10px` }}
              >
                <Button size="small" variant="contained" color="primary">
                  Edit
                </Button>
              </Link>
            ) : (
              false
            )}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ color: `gray` }}
          >
            {infoText}
          </Typography>
          <div className="row m-b-15">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              Total sale
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <TextField
                disabled={true}
                value={"$" + parseFloat(this.props.totalNet).toFixed(2)}
              />
            </div>
          </div>
          <div className="row m-b-15">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              Total payments received to date (including current payment)
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <TextField
                disabled={true}
                value={"$" + parseFloat(this.props.paymentsReceived).toFixed(2)}
              />
            </div>
          </div>
          <div className="row m-b-15">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              Total refunds paid to date
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <TextField
                disabled={true}
                value={"$-" + parseFloat(this.props.refundsPaid).toFixed(2)}
              />
            </div>
          </div>
          <div className="row m-b-15">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              Purchase balance (including current payment)
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <TextField
                disabled={true}
                value={"$" + parseFloat(this.props.balance).toFixed(2)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { productReducer } = state;
  const { products } = productReducer;
  return { products };
}

export default connect(mapStateToProps)(PurchaseBalanceCard);
