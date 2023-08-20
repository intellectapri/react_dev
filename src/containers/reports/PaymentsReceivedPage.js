import React from "react";
import moment from "moment-timezone/builds/moment-timezone-with-data";
import PropTypes from "prop-types";
import { setActivePageTitle } from "../../actions/settings";
import { Link } from "react-router";
import { connect } from "react-redux";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import CheckIcon from "@material-ui/icons/Check";
import EditIcon from "@material-ui/icons/Edit";

import LoadingOverlay from "../../components/LoadingOverlay";
import BonzaNotification from "../../components/BonzaNotification";
import PaymentsReceivedFilter from "../../components/reports/PaymentsReceivedFilter";

import config from "../../config";
import { updateChargeAction } from "../../actions/charges";
import { getProducts } from "../../middleware/api/products";
import { getBookingPartners } from "../../middleware/api/bookingPartners";
import {
  getPaymentsReport,
  exportPaymentsReport,
} from "../../middleware/api/reports";

class PaymentsReceivedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {},
      products: [],
      bookingPartners: [],
      loading: true,
      data: false,
      errors: [],
    };

    this.getData = this.getData.bind(this);
    props.dispatch(setActivePageTitle(`Payments received report`));
  }

  changeAccountingStatus(id, value) {
    if (confirm(`Change accounting status?`)) {
      this.setState({ loading: true });
      this.props.dispatch(
        updateChargeAction(id, { addedToAccounting: value }, false, () => {
          this.getData();
        }),
      );
    }
  }

  componentWillMount() {
    getProducts()
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
    getPaymentsReport(filters)
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

  generateReport(data) {
    let paymentMethods = [];
    data.map((item) => {
      if (paymentMethods.indexOf(item.method) === -1)
        paymentMethods.push(item.method);
    });

    let overallTotal = 0;
    let resultTables = [];
    paymentMethods.map((paymentMethod, paymentMethodIndex) => {
      let tableHeaderRow = (
        <TableRow
          className="payments-received-report_table-header-row"
          key={`table_header_${paymentMethodIndex}`}
        >
          <TableCell>Accounting</TableCell>
          <TableCell>Payment date</TableCell>
          <TableCell>Bonza Booking ID</TableCell>
          <TableCell>Payment method</TableCell>
          <TableCell>Traveller name</TableCell>
          <TableCell>Product</TableCell>
          <TableCell>Tour date</TableCell>
          <TableCell>Payment type</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Liability</TableCell>
          <TableCell></TableCell>
        </TableRow>
      );

      let dataRows = [];
      let total = 0;

      let userIsAllowedToAddChargesToAccounting =
        this.props.user.groupCode ===
        config.userGroups[config.superUserGroupIndex].groupCode;

      data.map((item, itemIndex) => {
        if (item.method === paymentMethod) {
          let amount = false;
          if (item.amount) {
            if (item.type === `payment`) {
              amount = <span>${item.amount}</span>;
              total = total + parseFloat(item.amount);
            } else {
              amount = <span style={{ color: `red` }}>${item.amount}</span>;
              total = total - parseFloat(item.amount);
            }
          }

          let liability = false;
          if (
            parseInt(moment(item.tourDate).format(`YYYYMM`)) >
            parseInt(moment(item.paymentDate).format(`YYYYMM`))
          ) {
            liability = <CheckIcon />;
          }

          let editLink = `/purchases/edit-tour/${item.purchaseID}`;
          if (item.purchaseType && item.purchaseType === `misc`) {
            editLink = `/purchases/edit-misc/${item.purchaseID}`;
          }

          let actionLink = (
            <Tooltip title="Edit purchase" placement="top" enterDelay={300}>
              <Link to={editLink} className="no-underline">
                <IconButton variant="contained" size="small" color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip>
          );

          let addToAccountingControl = (
            <div>
              {item.addedToAccounting ? (
                <p>
                  Added{" "}
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.changeAccountingStatus(item.chargeID, false);
                    }}
                    title="Remove from the accounting"
                  >
                    Remove
                  </a>
                </p>
              ) : (
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.changeAccountingStatus(item.chargeID, true);
                  }}
                  title="Add to accounting"
                >
                  Add
                </a>
              )}
            </div>
          );

          if (!userIsAllowedToAddChargesToAccounting) {
            addToAccountingControl = (
              <Tooltip
                title="You are not allowed to modify this property"
                placement="top"
              >
                {addToAccountingControl}
              </Tooltip>
            );
          }

          dataRows.push(
            <TableRow key={`item_${paymentMethodIndex}_${itemIndex}`}>
              <TableCell>{addToAccountingControl}</TableCell>
              <TableCell>
                {moment(item.paymentDate.split("T")[0] + "T00:00:00").format(
                  config.momentDateFormat,
                )}
              </TableCell>
              <TableCell>{item.purchaseID}</TableCell>
              <TableCell>{item.method}</TableCell>
              <TableCell>
                {item.travelerFirstname} {item.travelerLastname}
              </TableCell>
              <TableCell>{item.pname}</TableCell>
              <TableCell>
                {item.tourDate
                  ? moment(item.tourDate, `YYYY-MM-DD`).format(
                      config.momentDateFormat,
                    )
                  : ``}
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{amount}</TableCell>
              <TableCell>{liability}</TableCell>
              <TableCell>{actionLink}</TableCell>
            </TableRow>,
          );
        }
      });

      let tableFooterRow = (
        <TableRow>
          <TableCell colSpan={8} />
          <TableCell colSpan={3} style={{ textAlign: `right` }}>
            <strong>Total: ${total.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
      );

      overallTotal = overallTotal + total;
      resultTables.push(
        <TableBody padding="dense" key={`table_${paymentMethodIndex}`}>
          {tableHeaderRow}
          {dataRows}
          {tableFooterRow}
        </TableBody>,
      );
    });

    resultTables.push(
      <TableBody padding="dense" key={`table_overall`}>
        <TableRow>
          <TableCell colSpan={6} />
          <TableCell
            colSpan={5}
            style={{ textAlign: `right`, fontSize: `20px` }}
          >
            <strong>Overall total: ${overallTotal.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
      </TableBody>,
    );

    return (
      <div>
        <Table padding="dense">{resultTables}</Table>
      </div>
    );
  }

  onSearch(filters) {
    this.setState({ filters }, this.getData);
  }

  onExport(filters) {
    filters.from = filters.fromDate
      ? moment(filters.fromDate).format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`);
    filters.to = filters.toDate
      ? moment(filters.toDate).format(`YYYY-MM-DD`)
      : moment().format(`YYYY-MM-DD`);
    this.setState({ filters }, () => {
      exportPaymentsReport(this.state.filters);
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
        <PaymentsReceivedFilter
          products={this.state.products}
          bookingPartners={this.state.bookingPartners}
          searchHandler={this.onSearch.bind(this)}
          exportHanlder={this.onExport.bind(this)}
        />
        <Divider style={{ marginTop: `10px`, marginBottom: `10px` }} />
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

PaymentsReceivedPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { auth } = state;
  const { user } = auth;

  return { user };
}

export default connect(mapStateToProps)(PaymentsReceivedPage);
