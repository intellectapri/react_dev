import React from "react";
import moment from "moment";
import { Link } from "react-router";
import { setActivePageTitle } from "../../actions/settings";

import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import LoadingOverlay from "../../components/LoadingOverlay";
import BonzaNotification from "../../components/BonzaNotification";
import FinancialAnalysisFilter from "../../components/reports/FinancialAnalysisFilter";

import config from "../../config";
import { updateChargesBulk } from "../../middleware/api/charges";
import { getProducts } from "../../middleware/api/products";
import { getBookingPartners } from "../../middleware/api/bookingPartners";
import {
  getFinanceToursReport,
  exportFinanceToursReport,
} from "../../middleware/api/reports";

class FinancialAnalysisToursPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      products: [],
      bookingPartners: [],
      data: false,
      filters: {},
      errors: [],
    };

    this.getData = this.getData.bind(this);
    props.dispatch(
      setActivePageTitle(`Financial analysis report for tour purchases`),
    );
  }

  componentWillMount() {
    getProducts({
      typeCodes: [`PACKAGES`, `TOURS`, `HIRES`],
    })
      .then((products) => {
        getBookingPartners({ limit: 1000 })
          .then((bookingPartners) => {
            this.setState(
              { products, bookingPartners: bookingPartners.data },
              this.getData,
            );
          })
          .catch(() => {
            this.setState({
              loading: false,
              errors: [`Unable to fetch booking partners`],
            });
          });
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
    let filters = Object.assign({}, this.state.filters);
    filters.from = filters.fromDate
      ? moment(filters.fromDate).format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`);
    filters.to = filters.toDate
      ? moment(filters.toDate).format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`);
    getFinanceToursReport(filters)
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

  generateReport(data) {
    let dataRows = [];
    data.map((item, itemIndex) => {
      dataRows.push(
        <TableRow key={`item_${itemIndex}`}>
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
          <TableCell>
            {moment(item.tourDate).format(config.momentDateFormat)}
          </TableCell>
          <TableCell>{item.productName}</TableCell>
          <TableCell>
            {item.travelerFirstname} {item.travelerLastname}
          </TableCell>
          <TableCell>{item.originCountry}</TableCell>
          <TableCell>{item.noOfAdult}</TableCell>
          <TableCell>${item.adultPrice}</TableCell>
          <TableCell>{item.noOfChildren}</TableCell>
          <TableCell>${item.childPrice}</TableCell>
          <TableCell>${item.totalGross}</TableCell>
          <TableCell>{item.bookingSource}</TableCell>
          <TableCell>{item.customerName}</TableCell>
          <TableCell>
            {moment(item.purchaseDate).format(config.momentDateFormat)}
          </TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>{item.staffName}</TableCell>
          <TableCell>{item.purchaseID}</TableCell>
          <TableCell>{item.bookingRefID}</TableCell>
          <TableCell>{item.travelAgency}</TableCell>
          <TableCell>
            {item.famils === 1 ? <CheckIcon /> : <BlockIcon />}
          </TableCell>
          <TableCell>
            <Link
              to={`/purchases/edit-tour/${item.purchaseID}`}
              className="no-underline"
            >
              <Button variant="contained" size="small" color="primary">
                Edit
              </Button>
            </Link>
          </TableCell>
        </TableRow>,
      );
    });

    return (
      <div>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Accounting</TableCell>
              <TableCell>Tour date</TableCell>
              <TableCell>Tour type</TableCell>
              <TableCell>Traveller name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Adults</TableCell>
              <TableCell>Adult price</TableCell>
              <TableCell>Children</TableCell>
              <TableCell>Child price</TableCell>
              <TableCell>Gross sale</TableCell>
              <TableCell>Booking source</TableCell>
              <TableCell>Booking partner</TableCell>
              <TableCell>Purchase date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Entered by</TableCell>
              <TableCell>Bonza booking ID</TableCell>
              <TableCell>Booking partner reference</TableCell>
              <TableCell>Travel agency</TableCell>
              <TableCell>Famils</TableCell>
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
      exportFinanceToursReport(this.state.filters);
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
        <FinancialAnalysisFilter
          products={this.state.products}
          bookingPartners={this.state.bookingPartners}
          searchHandler={this.onSearch.bind(this)}
          exportHanlder={this.onExport.bind(this)}
        />
        <Divider />
        <div>{report}</div>
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

export default FinancialAnalysisToursPage;
