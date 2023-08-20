import React from "react";
import moment from "moment";
import { setActivePageTitle } from "../actions/settings";
import BonzaNotification from "../components/BonzaNotification";
import LoadingOverlay from "../components/LoadingOverlay";

import { getYear, getMonth, getDay } from "react-calendar/dist/shared/dates";
import { getAllotmentsForRange } from "../middleware/api/allotments";
import { getProduct } from "../middleware/api/products";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

import Calendar from "react-calendar";

const numberOfDisplayedMonths = 12;

const requestedAllotmentsRange = `1:${numberOfDisplayedMonths}`;

const noMargin = { marginBottom: `0px` };

class ProductAllotmentsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentDate: new Date(),
      product: false,
      allotments: {},
      currentMonth: new Date(),
      errors: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSelectedDateChange = this.handleSelectedDateChange.bind(this);
    this.getTileDisabled = this.getTileDisabled.bind(this);
    this.getTileContent = this.getTileContent.bind(this);
    this.goBefore = this.goBefore.bind(this);
    this.goAfter = this.goAfter.bind(this);

    props.dispatch(setActivePageTitle(`Allotments`));
  }

  componentWillMount() {
    getProduct(this.props.params.id)
      .then((product) => {
        this.props.dispatch(
          setActivePageTitle(`Allotments of ${product.name}`),
        );
        getAllotmentsForRange(product.productId, requestedAllotmentsRange)
          .then((allotments) => {
            this.setState({
              loading: false,
              product,
              allotments,
            });
          })
          .catch(() => {
            this.setState({
              loading: false,
              errors: [`Unable to load allotments for ${product.name}`],
            });
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

  handleSelectedDateChange(value) {
    this.props.router.push(
      `/products/${this.props.params.id}/allotments/edit?startDate=${moment(
        value,
      ).format(`YYYY-MM-DD`)}`,
    );
  }

  getTileDisabled({ activeStartDate, date, view }) {
    return false;
  }

  getTileContent({ date, view }) {
    let yearIndex = getYear(date);
    let monthIndex = getMonth(date);
    let dayIndex = getDay(date);

    if (view === "month" && this.state.allotments) {
      let content = null;
      if (
        this.state.allotments[yearIndex] &&
        this.state.allotments[yearIndex][monthIndex] &&
        this.state.allotments[yearIndex][monthIndex][dayIndex]
      ) {
        let dayData = this.state.allotments[yearIndex][monthIndex][dayIndex];
        content = (
          <p style={{ color: `blue`, fontSize: `8px`, margin: 0 }}>
            {dayData.text}
          </p>
        );
      }

      return content;
    } else {
      return null;
    }
  }

  goBefore() {
    this.setState({ loading: true });
    getAllotmentsForRange(
      this.state.product.productId,
      requestedAllotmentsRange,
      moment(this.state.currentMonth)
        .subtract(numberOfDisplayedMonths, "months")
        .startOf("month")
        .format(`YYYY-MM-DD`),
    )
      .then((allotments) => {
        this.setState({
          loading: false,
          allotments,
          currentMonth: moment(this.state.currentMonth)
            .subtract(12, "months")
            .startOf("month")
            .toDate(),
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to load allotments for ${this.state.product.name}`],
        });
      });
  }

  goAfter() {
    this.setState({ loading: true });
    getAllotmentsForRange(
      this.state.product.productId,
      requestedAllotmentsRange,
      moment(this.state.currentMonth)
        .add(numberOfDisplayedMonths, "months")
        .startOf("month")
        .format(`YYYY-MM-DD`),
    )
      .then((allotments) => {
        this.setState({
          loading: false,
          allotments,
          currentMonth: moment(this.state.currentMonth)
            .add(12, "months")
            .startOf("month")
            .toDate(),
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to load allotments for ${this.state.product.name}`],
        });
      });
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let calendarGrids = [];
    for (let i = 0; i < numberOfDisplayedMonths; i++) {
      let startOfMonth = moment(this.state.currentMonth)
        .add(i, "months")
        .startOf("month");
      calendarGrids.push(
        <Grid item key={`month_grid_${i}`}>
          <div style={{ textAlign: `center` }}>
            <Typography variant="h5" gutterBottom>
              {moment(startOfMonth).format(`MMMM`)}{" "}
              {moment(startOfMonth).format(`YYYY`)}
            </Typography>
          </div>
          <div>
            <Calendar
              activeStartDate={startOfMonth.toDate()}
              minDetail="month"
              showNavigation={false}
              showWeekNumbers={true}
              value={null}
              onChange={this.handleSelectedDateChange}
              tileDisabled={this.getTileDisabled}
              tileContent={this.getTileContent}
              className="allotments-calendar"
            />
          </div>
        </Grid>,
      );
    }

    return (
      <div style={{ position: `relative` }} className="product-allotments">
        {loadingOverlay}
        {this.state.product ? (
          <div style={{ paddingBottom: `10px` }}>
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                style={noMargin}
              >
                <Typography variant="body1" gutterBottom>
                  Please select one of the dates in calendar below or navigate
                  to any date using the buttons below
                </Typography>
                <div style={{ paddingTop: `10px`, paddingBottom: `10px` }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.goBefore}
                  >
                    <KeyboardArrowLeftIcon /> Previous 12 months
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.goAfter}
                    style={{ marginLeft: `10px` }}
                  >
                    Next 12 months <KeyboardArrowRightIcon />
                  </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={16}
                >
                  {calendarGrids}
                </Grid>
              </div>
            </div>
          </div>
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

export default ProductAllotmentsPage;
