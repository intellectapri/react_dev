import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { setActivePageTitle } from "../../actions/settings";
import { Link } from "react-router";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import TodayIcon from "@material-ui/icons/Today";

import LoadingOverlay from "../../components/LoadingOverlay";
import BonzaNotification from "../../components/BonzaNotification";

import config from "../../config";
import {
  getUpcomingReport,
  exportUpcomingReport,
} from "../../middleware/api/reports";

class UpcomingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: false,
      today: new Date(),
      errors: [],
    };

    props.dispatch(setActivePageTitle(`Upcoming Tour Calendar`));
  }

  componentWillMount() {
    getUpcomingReport()
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

  exportData() {
    exportUpcomingReport();
  }

  generateCalendar() {
    const today = moment();
    const from_date = moment(today);
    from_date.startOf("isoWeek");
    const to_date = moment(today);
    to_date.endOf("isoWeek").add(4, "weeks");

    let weekRows = [];

    let dayOfWeekColumns = [];
    config.daysOfWeek.map((day, index) => {
      dayOfWeekColumns.push(
        <Grid
          key={`week_day_${index}`}
          item
          style={{
            flexGrow: `1`,
            flexBasis: `0`,
            margin: `2px`,
            textAlign: `center`,
          }}
        >
          {day}
        </Grid>,
      );

      if (index === config.daysOfWeek.length - 1) {
        weekRows.push(
          <Grid key={`week_days`} container style={{ flexGrow: `1` }}>
            {dayOfWeekColumns}
          </Grid>,
        );
      }
    });

    let currentWeekDays = [];
    for (var m = moment(from_date); m.isBefore(to_date); m.add(1, "days")) {
      let tours = [];
      if (m.format("YYYY-MM-DD") in this.state.data) {
        this.state.data[m.format("YYYY-MM-DD")].map((tour, index) => {
          let products = false;
          if (tour.products) {
            products = [];
            tour.products.map((product) => {
              products.push(
                <Typography
                  title={`Bonza booking ID: ${tour.purchaseID}`}
                  variant="body2"
                  gutterBottom
                  style={{ fontSize: `10px` }}
                >
                  - {product.name} ({product.qty})
                </Typography>,
              );
            });
          }

          tours.push(
            <div
              key={`tour_${m.format("YYYY_MM_DD")}_${index}`}
              style={{ textAlign: `right` }}
            >
              <Typography
                title={`Bonza booking ID: ${tour.purchaseID}`}
                variant="body2"
                gutterBottom
                style={{ fontSize: `12px` }}
              >
                {tour.productName} ({tour.totalGuest}/{tour.totalAllotment})
              </Typography>
              {products}
            </div>,
          );
        });
      }

      let icon = <CalendarTodayIcon style={{ fontSize: `14px` }} />;
      let text = m.format(`D MMM`);
      if (moment(this.state.today).isSame(m, "day")) {
        icon = <TodayIcon style={{ fontSize: `14px` }} />;
        text = text + " (today)";
      }

      let cell = (
        <Link
          to={`/purchases/check-in?date=${m.format("YYYY-MM-DD")}`}
          className="no-underline"
        >
          <div
            className="upcoming-report__calendar-cell"
            style={{
              padding: `6px`,
              minHeight: `160px`,
            }}
          >
            <div>
              {icon} {text}
            </div>
            {tours}
          </div>
        </Link>
      );

      if (m.isBefore(this.state.today, "day")) {
        cell = (
          <div style={{ padding: `6px`, height: `calc(100% - 12px)` }}>
            <div>
              <span style={{ color: `gray` }}>
                {icon} {text}
              </span>
            </div>
          </div>
        );
      }

      currentWeekDays.push(
        <Grid
          key={`day_${m.format("YYYY_MM_DD")}`}
          item
          style={{
            flexGrow: `1`,
            flexBasis: `0`,
            minHeight: `90px`,
            margin: `2px`,
            border: `1px solid #DDD`,
          }}
        >
          {cell}
        </Grid>,
      );

      if (currentWeekDays.length === 7) {
        weekRows.push(
          <Grid
            key={`week_${m.format("YYYY_MM_DD")}`}
            container
            style={{ flexGrow: `1` }}
          >
            {currentWeekDays}
          </Grid>,
        );
        currentWeekDays = [];
      }
    }

    return weekRows.length > 0 ? weekRows : false;
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let dataDisplayed = this.state.data ? this.generateCalendar() : false;
    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        {this.state.data ? (
          <div>
            <div style={{ paddingBottom: `10px`, textAlign: `right` }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.exportData.bind(this)}
              >
                Export as CSV file
              </Button>
            </div>
            <div>{dataDisplayed}</div>
          </div>
        ) : (
          false
        )}
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

UpcomingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default UpcomingPage;
