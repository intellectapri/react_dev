import React from "react";
import moment from "moment";
import { setActivePageTitle } from "../../actions/settings";
import { Link } from "react-router";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

import LoadingOverlay from "../../components/LoadingOverlay";
import BonzaNotification from "../../components/BonzaNotification";
import FinancialAnalysisMiscFilter from "../../components/reports/FinancialAnalysisMiscFilter";

import config from "../../config";
import { updateChargesBulk } from "../../middleware/api/charges";
import { getProducts } from "../../middleware/api/products";
import {
  getFinanceMiscReport,
  exportFinanceMiscReport,
} from "../../middleware/api/reports";
import { deleteMiscPurchase } from "../../middleware/api/purchases";

class FinancialAnalysisMiscPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      products: [],
      bookingPartners: [],
      data: false,
      filters: {
        deliveryFrom: new Date(),
        deliveryTo: new Date(),
      },
      errors: [],
    };

    this.getData = this.getData.bind(this);
    props.dispatch(
      setActivePageTitle(`Financial analysis report for misc purchases`),
    );
  }

  componentWillMount() {
    getProducts({
      typeCodes: [`MERCH`, `DRINKS`],
    })
      .then((products) => {
        this.setState({ products }, this.getData);
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to fetch products`],
        });
      });
  }

  getData() {
    this.setState({ loading: true });
    getFinanceMiscReport(this.state.filters)
      .then((data) => {
        this.setState({
          loading: false,
          data,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to fetch the report data`],
        });
      });
  }

  markAll(purchaseId) {
    this.setState({ loading: true });
    updateChargesBulk(purchaseId, { addedToAccounting: true })
      .then(() => {
        this.getData();
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  unmarkAll(purchaseId) {
    this.setState({ loading: true });
    updateChargesBulk(purchaseId, { addedToAccounting: false })
      .then(() => {
        this.getData();
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  deletePurchase(purchaseId) {
    if (confirm(`Delete purchase?`)) {
      this.setState({ loading: true });
      deleteMiscPurchase(purchaseId, false)
        .then(() => {
          this.getData();
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [`Unable to delete purchase`],
          });
        });
    }
  }

  generateReport(data) {
    let dataRows = [];
    data.map((item, itemIndex) => {
      dataRows.push(
        <TableRow key={`item_${itemIndex}`}>
          <TableCell>{item.purchaseID}</TableCell>
          <TableCell>
            <div>
              {item.chargesTotal ? (
                <p>
                  {item.chargesAdded}/{item.chargesTotal} added
                  <br />
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.markAll(item.purchaseID);
                    }}
                    title="Add all charges to accounting"
                  >
                    Add
                  </a>
                  <br />
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.unmarkAll(item.purchaseID);
                    }}
                    title="Remove all charges from the accounting"
                  >
                    Remove
                  </a>
                </p>
              ) : (
                <p>No payments created</p>
              )}
            </div>
          </TableCell>
          <TableCell>{item.productName}</TableCell>
          <TableCell>{item.qty}</TableCell>
          <TableCell>{item.price}</TableCell>
          <TableCell>
            {item.tourDate
              ? moment(item.tourDate).format(config.momentDateFormat)
              : `No linked tour purchase`}
          </TableCell>
          <TableCell>
            {moment(
              item.purchaseDate ? item.purchaseDate : item.purchaseDateAlt,
            ).format(config.momentDateFormat)}
          </TableCell>
          <TableCell style={{ textAlign: `right` }}>
            <div style={{ textAlign: `right` }}>
              <Link
                to={`/purchases/edit-misc/${item.purchaseID}`}
                className="no-underline"
              >
                <Button color="primary" size="small" variant="contained">
                  Edit
                </Button>
              </Link>
              <Button
                color="secondary"
                size="small"
                variant="contained"
                disabled={item.chargesTotal ? true : false}
                onClick={() => {
                  this.deletePurchase(item.purchaseID);
                }}
                style={{ marginLeft: `10px` }}
              >
                Delete
              </Button>
              {item.chargesTotal > 0 ? (
                <Tooltip
                  title="All payments should be deleted beforehand"
                  placement="top"
                >
                  <IconButton variant="contained" size="small" color="primary">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                false
              )}
              {item.standalone ? (
                false
              ) : (
                <Link
                  to={`/purchases/edit-tour/${item.purchaseID}`}
                  className="no-underline"
                  style={{ marginLeft: `10px` }}
                >
                  <Button size="small" variant="contained">
                    Edit tour purchase
                  </Button>
                </Link>
              )}
            </div>
          </TableCell>
        </TableRow>,
      );
    });

    return (
      <div>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Bonza booking ID</TableCell>
              <TableCell>Accounting</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tour date</TableCell>
              <TableCell>Purchase date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{dataRows}</TableBody>
        </Table>
      </div>
    );
  }

  onSearch(filters) {
    this.setState({ filters }, this.getData);
  }

  onExport(filters) {
    filters.from = filters.fromDate
      ? moment(filters.fromDate).format(`YYYY-MM-DD`)
      : moment().subtract(1, `month`).format(`YYYY-MM-DD`);
    filters.to = filters.toDate
      ? moment(filters.toDate).format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`);
    this.setState({ filters }, () => {
      exportFinanceMiscReport(this.state.filters);
    });
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let report = false;
    if (Array.isArray(this.state.data) && this.state.data.length > 0) {
      report = this.generateReport(this.state.data);
    } else {
      report = <p>No data to display</p>;
    }

    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        <FinancialAnalysisMiscFilter
          products={this.state.products}
          bookingPartners={this.state.bookingPartners}
          searchHandler={this.onSearch.bind(this)}
          exportHanlder={this.onExport.bind(this)}
        />
        <Divider />
        <div style={{ paddingTop: `10px` }}>{report}</div>
        <BonzaNotification
          errors={this.state.errors}
          onClose={() => {
            this.setState({ errors: [] });
          }}
        />
      </div>
    );
  }
}

export default FinancialAnalysisMiscPage;
