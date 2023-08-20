import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import Collapse from "@material-ui/core/Collapse";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import InfoIcon from "@material-ui/icons/Info";
import PeopleIcon from "@material-ui/icons/People";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { requestCheckins, setCheckin, setNoShow } from "../actions/checkin";
import { setActivePageTitle } from "../actions/settings";
import config from "../config";

import Calendar from "react-calendar";
import DatePicker from "./../components/BonzaDatePicker/entry";

const productNamesToShowInAdditionalNotes = ["e-bike", "tEst-proD"];

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  redColorSwitchBase: {
    color: red[100],
    "&$redColorChecked": {
      color: red[500],
      "& + $redColorBar": {
        backgroundColor: red[500],
      },
    },
  },
  redColorBar: {},
  redColorChecked: {},
  greenColorSwitchBase: {
    color: green[100],
    "&$greenColorChecked": {
      color: green[500],
      "& + $greenColorBar": {
        backgroundColor: green[500],
      },
    },
  },
  greenColorBar: {},
  greenColorChecked: {},
});

class CheckinPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMonthCalendarActiveDate: moment(new Date())
        .startOf(`month`)
        .toDate(),
      nextMonthCalendarActiveDate: moment(new Date())
        .add(1, `months`)
        .startOf(`month`)
        .toDate(),
      nextNextMonthCalendarActiveDate: moment(new Date())
        .add(2, `months`)
        .startOf(`month`)
        .toDate(),
      selectedDate: new Date(),
      expandedPurchases: [],
    };

    this.handleSelectedDateChange = this.handleSelectedDateChange.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.setCheckin = this.setCheckin.bind(this);
    this.setNoShow = this.setNoShow.bind(this);

    props.dispatch(setActivePageTitle(`Daily check-in`));
  }

  updateList(date) {
    if (!date) date = new Date();
    let dateRepresentation = moment(date).format(`YYYY-MM-DD`);
    this.props.dispatch(requestCheckins(dateRepresentation));
  }

  componentWillMount() {
    if (this.props.location.query.date) {
      let newDate = moment(
        this.props.location.query.date,
        `YYYY-MM-DD`,
      ).toDate();
      this.setState({ selectedDate: newDate }, () => {
        this.updateList(newDate);
      });
    } else {
      this.updateList();
    }
  }

  handleSelectedDateChange(value) {
    let selectedDate = new Date(value);
    this.setState({
      currentMonthCalendarActiveDate: moment(selectedDate)
        .startOf(`month`)
        .toDate(),
      nextMonthCalendarActiveDate: moment(selectedDate)
        .add(1, `months`)
        .startOf(`month`)
        .toDate(),
      nextNextMonthCalendarActiveDate: moment(selectedDate)
        .add(2, `months`)
        .startOf(`month`)
        .toDate(),
      selectedDate,
    });

    this.updateList(selectedDate);
  }

  clearFilters() {
    this.setState({
      currentMonthCalendarActiveDate: moment(new Date())
        .startOf(`month`)
        .toDate(),
      nextMonthCalendarActiveDate: moment(new Date())
        .add(1, `months`)
        .startOf(`month`)
        .toDate(),
      nextNextMonthCalendarActiveDate: moment(new Date())
        .add(2, `months`)
        .startOf(`month`)
        .toDate(),
      selectedDate: new Date(),
    });

    this.updateList();
  }

  getMiscPurchases(miscPurchases) {
    if (!miscPurchases) throw new Error(`Invalid misc purchases object`);

    let results = [];
    miscPurchases.split(",").map((purchase) => {
      let splitMiscPurchase = purchase.split(":");
      let productId = parseInt(splitMiscPurchase[0]);
      let quantity = parseInt(splitMiscPurchase[1]);

      if (productId > 0 && quantity > 0) {
        this.props.products.map((product) => {
          if (product.productID === productId) {
            results.push({ product, quantity });
          }
        });
      }
    });

    return results;
  }

  /**
   * Generates header and data rows for tour purchases table
   *
   * @param {Object} item Tour purchase description
   *
   * @returns {Array}
   */
  generateRows(item) {
    // Table header cells
    let headerCells = [
      <TableCell key={`${item.purchaseId}_h1`}>Date of tour</TableCell>,
      <TableCell key={`${item.purchaseId}_h2`}>Lead Traveller</TableCell>,
      <TableCell key={`${item.purchaseId}_h3`}>Tour Type</TableCell>,
    ];

    if (parseInt(item.family) === 0) {
      headerCells.push(
        <TableCell key={`${item.purchaseId}_h4`}>Adults</TableCell>,
      );
      headerCells.push(
        <TableCell key={`${item.purchaseId}_h5`}>Children</TableCell>,
      );
    } else {
      headerCells.push(
        <TableCell key={`${item.purchaseId}_h4`}>Family Groups</TableCell>,
      );
      headerCells.push(
        <TableCell key={`${item.purchaseId}_h5`}>Additional Riders</TableCell>,
      );
    }

    headerCells.push(
      <TableCell key={`${item.purchaseId}_h6`}>Babies</TableCell>,
    );
    headerCells.push(
      <TableCell key={`${item.purchaseId}_h7`}>Total Riders</TableCell>,
    );
    headerCells.push(
      <TableCell key={`${item.purchaseId}_h8`}>Amount Owing/Owed</TableCell>,
    );

    let additionalMiscPurchaseText = ``;
    if (item.miscPurchases) {
      let texts = [];
      let miscPurchases = this.getMiscPurchases(item.miscPurchases);
      miscPurchases.map((item) => {
        // item.product
        // item.quantity
        texts.push(item.product.name + ` (` + item.quantity + `)`);
      });

      if (texts.length > 0) {
        additionalMiscPurchaseText = ` + ` + texts.join(`, `);
      }
    }

    // Table data cells
    let dataCells = [
      <TableCell key={`${item.purchaseId}_d1`}>
        {item.tourDate && item.tourDate.split(`T`).length === 2
          ? moment(item.tourDate.split(`T`)[0], `YYYY-MM-DD`).format(
              config.momentDateFormat,
            )
          : ``}
      </TableCell>,
      <TableCell key={`${item.purchaseId}_d2`}>
        {item.travelerLastname +
          ` ` +
          (item.travelerFirstname ? item.travelerFirstname : ``)}
      </TableCell>,
      <TableCell key={`${item.purchaseId}_d3`}>
        {item.name} {additionalMiscPurchaseText}
      </TableCell>,
    ];

    let numberOfAdults = 0,
      numberOfChildren = 0,
      numberOfBabies = 0,
      numberOfFamilyGroups = 0,
      numberOfAdditionals = 0,
      numberOfAddChildren = 0;

    if (parseInt(item.family) === 0) {
      numberOfAdults = item.noOfAdult ? parseInt(item.noOfAdult) : 0;
      numberOfChildren = item.noOfChildren ? parseInt(item.noOfChildren) : 0;

      dataCells.push(
        <TableCell key={`${item.purchaseId}_d4`}>{numberOfAdults}</TableCell>,
      );
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d5`}>{numberOfChildren}</TableCell>,
      );
    } else {
      numberOfFamilyGroups = item.noOfFamilyGroups
        ? parseInt(item.noOfFamilyGroups)
        : 0;
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d4`}>
          {numberOfFamilyGroups}
        </TableCell>,
      );

      numberOfAdditionals = item.noOfAdditionals
        ? parseInt(item.noOfAdditionals)
        : 0;
      numberOfAddChildren = item.noOfAddChildren
        ? parseInt(item.noOfAddChildren)
        : 0;
      numberOfAdditionals = numberOfAdditionals + numberOfAddChildren;
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d5`}>
          {numberOfAdditionals}
        </TableCell>,
      );
    }

    let numberOfBabySeats = item.babySeats ? item.babySeats : 0;
    let numberOfTrailAlongs = item.trailAlongs ? item.trailAlongs : 0;
    let numberOfLargeKidsBikes = item.largeKidsBikes ? item.largeKidsBikes : 0;
    let numberOfSmallKidsBikes = item.smallKidsBikes ? item.smallKidsBikes : 0;

    numberOfBabies = item.noOfBabies ? parseInt(item.noOfBabies) : 0;
    dataCells.push(
      <TableCell key={`${item.purchaseId}_d6`}>{numberOfBabies}</TableCell>,
    );

    let totalPeople = 0;
    if (parseInt(item.family) === 0) {
      totalPeople = numberOfAdults + numberOfChildren;
    } else {
      totalPeople = numberOfFamilyGroups * 4 + numberOfAdditionals;
    }

    dataCells.push(
      <TableCell key={`${item.purchaseId}_d7`}>{totalPeople}</TableCell>,
    );

    if (!item.totalPaid) item.totalPaid = 0;
    let amount = parseFloat(item.totalNet) - parseFloat(item.totalPaid);
    if (amount > 0) {
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d8`} style={{ color: `red` }}>
          <strong>${amount}</strong>
        </TableCell>,
      );
    } else if (amount === 0) {
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d8`}>
          <strong>$0</strong>
        </TableCell>,
      );
    } else {
      dataCells.push(
        <TableCell key={`${item.purchaseId}_d8`} style={{ color: `red` }}>
          <strong>${amount}</strong>
          <Tooltip
            placement="top"
            title="Amount paid by client is bigger than they actually have to pay"
          >
            <IconButton style={{ color: `red` }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </TableCell>,
      );
    }

    return {
      headerCells,
      dataCells,
      amount,
      totalPeople,
      totalPaid: parseFloat(item.totalPaid),
      numberOfAdults,
      numberOfChildren,
      numberOfFamilyGroups,
      numberOfAdditionals,
      numberOfBabies,
      numberOfBabySeats,
      numberOfTrailAlongs,
      numberOfLargeKidsBikes,
      numberOfSmallKidsBikes,
    };
  }

  /**
   * Generates additional header and data rows for tour purchases table
   *
   * @param {Object} item Tour purchase description
   *
   * @returns {Array}
   */
  generateAdditionalRows(item) {
    // Table header cells
    let headerCells = [
      [
        <TableCell key={`${item.purchaseId}_ah0`}>Phone Number</TableCell>,
        <TableCell key={`${item.purchaseId}_ah1`}>Hotel</TableCell>,
        <TableCell key={`${item.purchaseId}_ah2`} colSpan={2}>
          Additional Travellers
        </TableCell>,
        <TableCell key={`${item.purchaseId}_ah3`}>Baby Seats</TableCell>,
        <TableCell key={`${item.purchaseId}_ah4`}>Trail Alongs</TableCell>,
        <TableCell key={`${item.purchaseId}_ah5`}>Small Kids Bikes</TableCell>,
        <TableCell key={`${item.purchaseId}_ah6`}>Large Kids Bikes</TableCell>,
        <TableCell key={`${item.purchaseId}_ah7`}>Booking partner</TableCell>,
      ],
      [
        <TableCell key={`${item.purchaseId}_aah0`} style={{ width: `30%` }}>
          Internal Notes
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aah1`} style={{ width: `30%` }}>
          Guest Notes
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aah2`} style={{ width: `30%` }}>
          Customer Notes
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aah3`}>Entered By</TableCell>,
      ],
    ];

    // Table data cells
    let dataCells = [
      [
        <TableCell key={`${item.purchaseId}_ad0`}>{item.phone}</TableCell>,
        <TableCell key={`${item.purchaseId}_ad1`}>{item.hotel}</TableCell>,
        <TableCell key={`${item.purchaseId}_ad2`} colSpan={2}>
          {item.additionalNames}
        </TableCell>,
        <TableCell key={`${item.purchaseId}_ad3`}>{item.babySeats}</TableCell>,
        <TableCell key={`${item.purchaseId}_ad4`}>
          {item.trailAlongs}
        </TableCell>,
        <TableCell key={`${item.purchaseId}_ad5`}>
          {item.smallKidsBikes}
        </TableCell>,
        <TableCell key={`${item.purchaseId}_ad6`}>
          {item.largeKidsBikes}
        </TableCell>,
        <TableCell key={`${item.purchaseId}_ad7`}>
          {item.customerName ? item.customerName : ``}
        </TableCell>,
      ],
      [
        <TableCell key={`${item.purchaseId}_aad0`}>
          <div style={{ overflow: `auto` }}>{item.internalNotes}</div>
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aad1`}>
          <div style={{ overflow: `auto` }}>{item.guestNote}</div>
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aad2`}>
          {item.customerNotes}
        </TableCell>,
        <TableCell key={`${item.purchaseId}_aad3`}>
          {item.enteredByName}
        </TableCell>,
      ],
    ];

    return { headerCells, dataCells };
  }

  setCheckin(e) {
    let value = e.target.value.split(`_`);
    this.props.dispatch(setCheckin(parseInt(value[0]), value[1] === `1`));
  }

  setNoShow(e) {
    let value = e.target.value.split(`_`);
    this.props.dispatch(setNoShow(parseInt(value[0]), value[1] === `0`));
  }

  expandInformation(detailId) {
    let expandedPurchases = this.state.expandedPurchases.slice();
    if (expandedPurchases.indexOf(detailId) === -1) {
      expandedPurchases.push(detailId);
    } else {
      expandedPurchases.splice(expandedPurchases.indexOf(detailId), 1);
    }

    this.setState({ expandedPurchases });
  }

  shiftDates(shift) {
    if (parseInt(shift) > 0) {
      this.setState({
        currentMonthCalendarActiveDate: moment(
          this.state.currentMonthCalendarActiveDate,
        )
          .add(parseInt(shift), `months`)
          .startOf(`month`)
          .toDate(),
        nextMonthCalendarActiveDate: moment(
          this.state.nextMonthCalendarActiveDate,
        )
          .add(parseInt(shift), `months`)
          .startOf(`month`)
          .toDate(),
        nextNextMonthCalendarActiveDate: moment(
          this.state.nextNextMonthCalendarActiveDate,
        )
          .add(parseInt(shift), `months`)
          .startOf(`month`)
          .toDate(),
      });
    } else {
      this.setState({
        currentMonthCalendarActiveDate: moment(
          this.state.currentMonthCalendarActiveDate,
        )
          .subtract(parseInt(shift) * -1, `months`)
          .startOf(`month`)
          .toDate(),
        nextMonthCalendarActiveDate: moment(
          this.state.nextMonthCalendarActiveDate,
        )
          .subtract(parseInt(shift) * -1, `months`)
          .startOf(`month`)
          .toDate(),
        nextNextMonthCalendarActiveDate: moment(
          this.state.nextNextMonthCalendarActiveDate,
        )
          .subtract(parseInt(shift) * -1, `months`)
          .startOf(`month`)
          .toDate(),
      });
    }
  }

  render() {
    const { classes } = this.props;

    let totalRiders = 0;
    let totalBabies = 0;

    let loadingIndication = false;
    if (this.props.loading) {
      loadingIndication = (
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
            <LinearProgress />
          </div>
        </div>
      );
    }

    let checkinsBlocks = (
      <div className="row">
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
          style={{ textAlign: `center` }}
        >
          <p>No data to display</p>
        </div>
      </div>
    );

    if (this.props.checkins.length > 0) {
      checkinsBlocks = [];
      for (let productKey in this.props.booked) {
        let productId = parseInt(productKey.replace(`product_`, ``));
        let productName = false;

        let currentProductItems = [];
        this.props.checkins.map((item, index) => {
          if (item.productID === productId) {
            currentProductItems.push(item);
          }
        });

        let checkinsSubBlocks = [];
        for (let timeKey in this.props.booked[productKey].times) {
          for (let languageKey in this.props.booked[productKey].times[
            timeKey
          ]) {
            let purchases = [];

            let subBlockTotalPeople = 0;
            let numberOfAdultsSubBlock = 0,
              numberOfChildrenSubBlock = 0,
              numberOfFamilyGroupsSubBlock = 0,
              numberOfAdditionalsSubBlock = 0,
              numberOfBabiesSubBlock = 0,
              numberOfBabySeatsSubBlock = 0,
              numberOfTrailAlongsSubBlock = 0,
              numberOfLargeKidsBikesSubBlock = 0,
              numberOfSmallKidsBikesSubBlock = 0;

            let blockItems = [];
            this.props.booked[productKey].times[timeKey][languageKey].map(
              (purchaseId) => {
                this.props.checkins.map((item, index) => {
                  if (item.purchaseID === purchaseId) {
                    blockItems.push(item);
                  }
                });
              },
            );

            blockItems.sort((a, b) => {
              let aHasData =
                a.enteredAt === null || a.enteredAt === `null` ? false : true;
              let bHasData =
                b.enteredAt === null || b.enteredAt === `null` ? false : true;

              if (aHasData && bHasData === false) return 1;
              if (aHasData === false && bHasData) return -1;
              if (aHasData === false && bHasData === false) return 0;
              if (aHasData && bHasData) {
                if (moment(a.enteredAt).isBefore(moment(b.enteredAt))) {
                  return -1;
                } else {
                  return 1;
                }
              }
            });

            blockItems.map((item, index) => {
              let isCheckedIn = item.checkIn === 1 ? true : false;
              let isNotShown = item.noShow === 1 ? true : false;

              let checkInSwitcher = (
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCheckedIn}
                      disabled={
                        !(
                          this.props.pendingCheckIn.indexOf(item.detailID) ===
                          -1
                        ) || isNotShown
                      }
                      onChange={this.setCheckin}
                      value={item.detailID + `_` + (isCheckedIn ? 0 : 1)}
                      classes={{
                        switchBase: classes.greenColorSwitchBase,
                        checked: classes.greenColorChecked,
                        bar: classes.greenColorBar,
                      }}
                    />
                  }
                  label="Checked in"
                />
              );

              let noShowSwitcher = (
                <FormControlLabel
                  control={
                    <Switch
                      checked={isNotShown}
                      disabled={
                        !(
                          this.props.pendingNoShow.indexOf(item.detailID) === -1
                        ) || isCheckedIn
                      }
                      onChange={this.setNoShow}
                      value={item.detailID + `_` + (isNotShown ? 1 : 0)}
                      classes={{
                        switchBase: classes.redColorSwitchBase,
                        checked: classes.redColorChecked,
                        bar: classes.redColorBar,
                      }}
                    />
                  }
                  label="No show"
                  style={{ paddingLeft: `40px` }}
                />
              );

              productName = item.name;
              let {
                headerCells,
                dataCells,
                amount,
                totalPeople,
                totalPaid,
                numberOfAdults,
                numberOfChildren,
                numberOfFamilyGroups,
                numberOfAdditionals,
                numberOfBabies,
                numberOfBabySeats,
                numberOfTrailAlongs,
                numberOfLargeKidsBikes,
                numberOfSmallKidsBikes,
              } = this.generateRows(item);

              subBlockTotalPeople = subBlockTotalPeople + totalPeople;
              numberOfAdultsSubBlock += numberOfAdults;
              numberOfChildrenSubBlock += numberOfChildren;
              numberOfFamilyGroupsSubBlock += numberOfFamilyGroups;
              numberOfAdditionalsSubBlock += numberOfAdditionals;
              numberOfBabiesSubBlock += numberOfBabies;

              numberOfBabySeatsSubBlock += numberOfBabySeats;
              numberOfTrailAlongsSubBlock += numberOfTrailAlongs;
              numberOfLargeKidsBikesSubBlock += numberOfLargeKidsBikes;
              numberOfSmallKidsBikesSubBlock += numberOfSmallKidsBikes;

              let takePaymentLink = false;
              if (amount > 0) {
                takePaymentLink = (
                  <Link
                    to={`/purchases/${item.purchaseID}/payment`}
                    className="no-underline"
                    style={{ marginLeft: `10px` }}
                  >
                    <Button variant="contained" size="small" color="primary">
                      Payment
                    </Button>
                  </Link>
                );
              }

              let refundLink = false;
              if (totalPaid > 0) {
                refundLink = (
                  <Link
                    to={`/purchases/${item.purchaseID}/refund`}
                    className="no-underline"
                    style={{ marginLeft: `10px` }}
                  >
                    <Button variant="contained" size="small" color="primary">
                      Refund
                    </Button>
                  </Link>
                );
              }

              let additionalTable = false;
              let expandLink = (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    this.expandInformation(item.detailID);
                  }}
                >
                  Expand
                </Button>
              );
              if (this.state.expandedPurchases.indexOf(item.detailID) > -1) {
                expandLink = (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      this.expandInformation(item.detailID);
                    }}
                  >
                    Collapse
                  </Button>
                );

                let { headerCells, dataCells } =
                  this.generateAdditionalRows(item);
                additionalTable = (
                  <Collapse in={true}>
                    <div>
                      <Table padding="dense" className="checkin-table">
                        <TableHead>
                          <TableRow>{headerCells[0]}</TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>{dataCells[0]}</TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <Table padding="dense" style={{ tableLayout: `fixed` }}>
                        <TableHead>
                          <TableRow>{headerCells[1]}</TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>{dataCells[1]}</TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </Collapse>
                );
              }

              let tourTime = item.tourTime;
              if (tourTime) {
                tourTime = moment(item.tourTime, `HH:mm:ss`).format(`hh:mm a`);
              }

              purchases.push(
                <div key={`purchase_${index}`}>
                  <div>
                    <Table padding="dense" className="checkin-table">
                      <TableHead>
                        <TableRow className="checkin-table-header">
                          {headerCells}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>{dataCells}</TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div>{additionalTable}</div>
                  <div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={{ textAlign: `left` }}
                      >
                        {checkInSwitcher}
                        {noShowSwitcher}
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={{ textAlign: `right`, paddingTop: `6px` }}
                      >
                        {expandLink}
                        {takePaymentLink}
                        {refundLink}
                        <Link
                          to={`/purchases/edit-tour/${item.purchaseID}`}
                          className="no-underline"
                          style={{ marginLeft: `10px` }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                          >
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>,
              );
            });

            let additionalPeopleInformation = [];
            if (numberOfAdultsSubBlock > 0)
              additionalPeopleInformation.push(
                `Adults (${numberOfAdultsSubBlock})`,
              );
            if (numberOfChildrenSubBlock > 0)
              additionalPeopleInformation.push(
                `Children (${numberOfChildrenSubBlock})`,
              );
            if (numberOfFamilyGroupsSubBlock > 0)
              additionalPeopleInformation.push(
                `Families (${numberOfFamilyGroupsSubBlock})`,
              );
            if (numberOfAdditionalsSubBlock > 0)
              additionalPeopleInformation.push(
                `Additional family riders (${numberOfAdditionalsSubBlock})`,
              );

            if (additionalPeopleInformation.length > 0) {
              additionalPeopleInformation =
                additionalPeopleInformation.join(` - `);
            } else {
              additionalPeopleInformation = false;
            }

            // Detecting specific products in linked misc purchases
            let additionalMiscItems = {};
            blockItems.map((item) => {
              if (item.miscPurchases) {
                let miscPurchases = this.getMiscPurchases(item.miscPurchases);
                miscPurchases.map((subItem) => {
                  let key = "product_" + subItem.product.productID;
                  if (key in additionalMiscItems) {
                    additionalMiscItems[key] =
                      additionalMiscItems[key] + subItem.quantity;
                  } else {
                    additionalMiscItems[key] = subItem.quantity;
                  }
                });
              }
            });

            let miscPurchasesTexts = [];
            for (let key in additionalMiscItems) {
              let productId = parseInt(key.replace("product_", ""));
              this.props.products.map((product) => {
                if (product.productID === productId) {
                  productNamesToShowInAdditionalNotes.map((shownProduct) => {
                    if (
                      (product.name + "")
                        .toLowerCase()
                        .indexOf(shownProduct.toLowerCase()) > -1
                    ) {
                      miscPurchasesTexts.push(
                        `${product.name} (${additionalMiscItems[key]})`,
                      );
                    }
                  });
                }
              });
            }

            let importantNotes = [];

            if (numberOfBabiesSubBlock > 0)
              importantNotes.push(`Infants (${numberOfBabiesSubBlock})`);
            if (numberOfBabySeatsSubBlock > 0)
              importantNotes.push(`Baby Seats (${numberOfBabySeatsSubBlock})`);
            if (numberOfTrailAlongsSubBlock > 0)
              importantNotes.push(
                `Trail Alongs (${numberOfTrailAlongsSubBlock})`,
              );
            if (numberOfSmallKidsBikesSubBlock > 0)
              importantNotes.push(
                `Small Kids Bikes (${numberOfSmallKidsBikesSubBlock})`,
              );
            if (numberOfLargeKidsBikesSubBlock > 0)
              importantNotes.push(
                `Large Kids Bikes (${numberOfLargeKidsBikesSubBlock})`,
              );
            if (miscPurchasesTexts.length > 0)
              importantNotes.push(miscPurchasesTexts.join(", "));
            if (importantNotes.length > 0) {
              importantNotes = "Important notes: " + importantNotes.join(` - `);
            } else {
              importantNotes = false;
            }

            totalRiders += subBlockTotalPeople;
            totalBabies += numberOfBabiesSubBlock;

            let tourTimeText =
              timeKey === `not_defined`
                ? ``
                : moment(timeKey, `HH:mm:ss`).format(`hh:mm a`) + " - ";
            let tourLanguageText = languageKey ? languageKey : `English`;
            let checkinsSubBlock = (
              <div key={`subblock_${timeKey}_${languageKey}`}>
                <Typography variant="subtitle1" gutterBottom>
                  {tourTimeText} {tourLanguageText} [{subBlockTotalPeople} Total
                  Riders: {additionalPeopleInformation}]
                </Typography>
                {importantNotes ? (
                  <div style={{ paddingBottom: `10px` }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {importantNotes}
                    </Typography>
                  </div>
                ) : (
                  false
                )}
                <div>{purchases}</div>
              </div>
            );

            checkinsSubBlocks.push(checkinsSubBlock);
          }
        }

        let subSection = (
          <div key={`subsection_${productKey}`}>
            <Card style={{ marginBottom: `10px` }}>
              <CardContent
                style={{
                  padding: `10px`,
                  paddingBottom: `0px`,
                }}
              >
                <div>
                  <Typography variant="h6" gutterBottom>
                    {productName} [{this.props.booked[productKey].totalBooked}{" "}
                    riders]
                  </Typography>
                </div>
                <div>{checkinsSubBlocks}</div>
              </CardContent>
            </Card>
          </div>
        );

        checkinsBlocks.push(subSection);
      }
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div style={{ paddingRight: `10px` }}>
                <Typography variant="overline" gutterBottom>
                  Filter:
                </Typography>
              </div>
              <div style={{ paddingRight: `10px` }}>
                <DatePicker
                  locale="en-AU"
                  clearIcon={null}
                  dataFormat={config.momentDateFormat}
                  onChange={(value) => {
                    this.handleSelectedDateChange(value);
                  }}
                  value={this.state.selectedDate}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div
            className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15"
            style={{ textAlign: `center`, marginBottom: `0px` }}
          >
            <Typography variant="h6">
              {moment(this.state.currentMonthCalendarActiveDate).format(
                "MMMM YY",
              )}
            </Typography>
          </div>
          <div
            className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15"
            style={{ textAlign: `center`, marginBottom: `0px` }}
          >
            <Typography variant="h6">
              {moment(this.state.nextMonthCalendarActiveDate).format("MMMM YY")}
            </Typography>
          </div>
          <div
            className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15"
            style={{ textAlign: `center`, marginBottom: `0px` }}
          >
            <Typography variant="h6">
              {moment(this.state.nextNextMonthCalendarActiveDate).format(
                "MMMM YY",
              )}
            </Typography>
          </div>
        </div>
        <div className="row check-in_calendars">
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15">
            <Calendar
              onChange={this.handleSelectedDateChange}
              value={
                moment(this.state.selectedDate).isSame(
                  this.state.currentMonthCalendarActiveDate,
                  "month",
                )
                  ? this.state.selectedDate
                  : null
              }
              minDetail="month"
              showNavigation={false}
              showNeighboringMonth={false}
              activeStartDate={this.state.currentMonthCalendarActiveDate}
              style={{ minHeight: `240px` }}
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15">
            <Calendar
              onChange={this.handleSelectedDateChange}
              value={
                moment(this.state.selectedDate).isSame(
                  this.state.nextMonthCalendarActiveDate,
                  "month",
                )
                  ? this.state.selectedDate
                  : null
              }
              minDetail="month"
              showNavigation={false}
              showNeighboringMonth={false}
              activeStartDate={this.state.nextMonthCalendarActiveDate}
              style={{ minHeight: `240px` }}
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15">
            <Calendar
              onChange={this.handleSelectedDateChange}
              value={
                moment(this.state.selectedDate).isSame(
                  this.state.nextNextMonthCalendarActiveDate,
                  "month",
                )
                  ? this.state.selectedDate
                  : null
              }
              minDetail="month"
              showNavigation={false}
              showNeighboringMonth={false}
              activeStartDate={this.state.nextNextMonthCalendarActiveDate}
              style={{ minHeight: `240px` }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 m-b-15">
            <Button
              variant="outlined"
              size="small"
              style={{ width: `100%` }}
              onClick={() => {
                this.shiftDates(`-12`);
              }}
            >
              <ChevronLeftIcon /> 1 year
            </Button>
          </div>
          <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 m-b-15">
            <Button
              variant="outlined"
              size="small"
              color="primary"
              style={{ width: `100%` }}
              onClick={() => {
                this.shiftDates(`-1`);
              }}
            >
              <ChevronLeftIcon />1 month
            </Button>
          </div>
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 m-b-15">
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              style={{ width: `100%` }}
              onClick={() => {
                this.clearFilters();
              }}
            >
              Today
            </Button>
          </div>
          <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 m-b-15">
            <Button
              variant="outlined"
              size="small"
              color="primary"
              style={{ width: `100%` }}
              onClick={() => {
                this.shiftDates(`+1`);
              }}
            >
              1 month <ChevronRightIcon />
            </Button>
          </div>
          <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 m-b-15">
            <Button
              variant="outlined"
              size="small"
              style={{ width: `100%` }}
              onClick={() => {
                this.shiftDates(`+12`);
              }}
            >
              1 year <ChevronRightIcon />
            </Button>
          </div>
        </div>
        <Divider />
        {loadingIndication}
        {totalRiders > 0 ? (
          <Card style={{ marginBottom: `10px` }}>
            <CardContent style={{ padding: `10px` }}>
              <Typography variant="h6">
                <PeopleIcon
                  style={{
                    fontSize: `28px`,
                    float: `left`,
                    marginRight: `10px`,
                  }}
                />{" "}
                {totalRiders + totalBabies} Total Guests [{totalRiders} Riders
                {totalBabies ? " , " + totalBabies + ` Babies]` : `]`}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          false
        )}
        {checkinsBlocks}
      </div>
    );
  }
}

CheckinPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  checkins: PropTypes.array,
  booked: PropTypes.object,
  pendingCheckIn: PropTypes.array.isRequired,
  pendingNoShow: PropTypes.array.isRequired,
};

/* eslint-disable */
function mapStateToProps(state) {
  const { checkinReducer, productReducer } = state;
  const { products } = productReducer;
  const { checkins, booked, loading, pendingCheckIn, pendingNoShow } =
    checkinReducer;
  return { checkins, products, booked, loading, pendingCheckIn, pendingNoShow };
}

export default withStyles(styles)(connect(mapStateToProps)(CheckinPage));
