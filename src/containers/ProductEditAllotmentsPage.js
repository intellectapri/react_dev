import React from "react";
import moment from "moment";
import { Link } from "react-router";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaCheckboxField from "../components/BonzaCheckboxField";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";
import BonzaNotification from "../components/BonzaNotification";
import LoadingOverlay from "../components/LoadingOverlay";

import config from "../config";
import { getProduct } from "../middleware/api/products";
import { createOrUpdate } from "../middleware/api/allotments";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CheckIcon from "@material-ui/icons/Check";

class ProductEditAllotmentsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      product: false,
      allotmentWasCreated: false,

      startDate: new Date(),
      endDate: new Date(),

      overrideDailyAvailability: false,
      totalAllotment: 0,
      allotmentDays: [],

      errors: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.setValue = this.setValue.bind(this);

    props.dispatch(setActivePageTitle(`Editing allotments`));
  }

  componentWillMount() {
    getProduct(this.props.params.id)
      .then((product) => {
        this.props.dispatch(
          setActivePageTitle(`Editing allotments of ${product.name}`),
        );

        let startDate = new Date();
        if (this.props.location.query.startDate) {
          startDate = moment(
            this.props.location.query.startDate,
            `YYYY-MM-DD`,
          ).toDate();
        }

        this.setState({
          loading: false,
          product,
          startDate,
          endDate: startDate,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [
            `Unable to get the product with identifier ${this.props.params.id}`,
          ],
        });
      });
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      errors: [],
    });
  }

  updateDetails() {
    let data = {
      productId: this.state.product.productId,
      startDate: moment(this.state.startDate).format(`YYYY-MM-DD`),
      endDate: moment(this.state.endDate).format(`YYYY-MM-DD`),
      allotmentDay: this.state.allotmentDays
        .map((item) => item.substr(0, 3).toLowerCase())
        .join(`,`),
      override: this.state.overrideDailyAvailability ? 1 : 0,
      total: this.state.totalAllotment,
    };

    this.setState({ loading: true });
    createOrUpdate(data)
      .then(() => {
        this.setState({ allotmentWasCreated: true });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Error occured while saving allotment`],
        });
      });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      if (this.state.allotmentWasCreated) {
        let content = (
          <div>
            <CheckIcon color="primary" style={{ fontSize: 80 }} />
            <p>Allotment was added</p>
            <p>
              <Link
                to={`/products/edit/${this.state.product.productId}`}
                className="no-underline"
              >
                <Button variant="contained" color="primary">
                  Edit product
                </Button>
              </Link>
              <Link
                to={`/products/${this.state.product.productId}/allotments`}
                className="no-underline"
                style={{ marginLeft: `10px` }}
              >
                <Button variant="contained" color="primary">
                  View allotments
                </Button>
              </Link>
            </p>
          </div>
        );

        loadingOverlay = <LoadingOverlay component={content} />;
      } else {
        loadingOverlay = <LoadingOverlay />;
      }
    }

    let availabilityRows = [];
    config.daysOfWeek.map((dayOfWeek) => {
      let availability =
        this.state.product[`availability${dayOfWeek.substr(0, 3)}`];
      availabilityRows.push(
        <TableRow key={`row_${dayOfWeek}`}>
          <TableCell>{dayOfWeek}</TableCell>
          <TableCell>
            {availability
              ? `${moment(availability, `HH:mm:ss`).format(
                  config.momentTimeFormat,
                )}`
              : `Not available`}
          </TableCell>
        </TableRow>,
      );
    });

    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        {this.state.product ? (
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <div>
                <div>
                  <BonzaBooleanField
                    title="Override daily availability"
                    value={this.state.overrideDailyAvailability}
                    name="overrideDailyAvailability"
                    onChange={this.setValue}
                  />
                </div>
                <div>
                  <BonzaDatePickerField
                    title="Start date"
                    maxDate={this.state.endDate}
                    value={this.state.startDate}
                    name="startDate"
                    onChange={this.setValue}
                  />
                </div>
                <div>
                  <BonzaDatePickerField
                    title="End date"
                    minDate={this.state.startDate}
                    value={this.state.endDate}
                    name="endDate"
                    onChange={this.setValue}
                  />
                </div>
                <div>
                  <BonzaTextField
                    title="Total allotment"
                    type="number"
                    value={this.state.totalAllotment}
                    name="totalAllotment"
                    onChange={this.setValue}
                  />
                </div>
                <div>
                  <BonzaCheckboxField
                    title="Allotment day"
                    options={config.daysOfWeek}
                    value={this.state.allotmentDays}
                    name="allotmentDays"
                    onChange={this.setValue}
                  />
                </div>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  disabled={this.state.allotmentDays.length === 0}
                  onClick={this.updateDetails.bind(this)}
                >
                  Update details
                </Button>
              </div>
            </Grid>
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {this.state.product.name}
                    <Link
                      to={`/products/edit/${this.state.product.productID}`}
                      className="no-underline"
                      style={{ marginLeft: `10px` }}
                    >
                      <Button size="small" color="primary" variant="contained">
                        Edit
                      </Button>
                    </Link>
                  </Typography>
                  <div>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Day of the week</TableCell>
                          <TableCell>Availability</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{availabilityRows}</TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          false
        )}
        <BonzaNotification
          errors={this.state.errors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default ProductEditAllotmentsPage;
