import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaTourTypeSelect from "../components/BonzaTourTypeSelect";
import BonzaDatePickerField from "../components/BonzaDatePickerField";
import LockedPurchaseNotification from "../components/LockedPurchaseNotification";
import config from "../config";

import {
  createTourPurchase,
  updateTourPurchase,
  getTourPurchase,
  getPurchases,
} from "../middleware/api/purchases";
import { getCustomerCommission } from "../middleware/api/customers";
import { getProductTourPricing, getCountTourProduct } from "../middleware/api/products";
import {
  getAllotmentsForRange,
  getAllotmentAvailability,
  checkIfDateIsBooked,
} from "../middleware/api/allotments";
import {
  getDiscount,
  getDiscounts,
  generateCode,
} from "../middleware/api/discounts";

import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import EmailIcon from "@material-ui/icons/Email";
import PaymentIcon from "@material-ui/icons/Payment";
import CheckIcon from "@material-ui/icons/Check";
import InfoIcon from "@material-ui/icons/Info";
import PersonIcon from "@material-ui/icons/Person";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import { requestProductPriceUpdate } from "../actions/product";
import spacing from "@material-ui/core/styles/spacing";

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const noMargin = { marginBottom: `0px` };

const initialState = {
  loading: false,

  purchaseId: 0,
  purchaseWasCreated: false,
  purchaseWasUpdated: false,
  confirmationSent: 0,
  detailId: 0,
  invoicesGenerated: 0,

  status: config.statuses[0],
  travelerSectionCollapsed: false,
  saleSectionCollapsed: false,
  tourSectionCollapsed: false,
  emailConfirmationSectionCollapsed: false,
  bookingStatusSectionCollapsed: false,
  paymentSectionCollapsed: false,
  bookingVoucherSectionCollapsed: false,
  travelerLastname: ``,
  travelerFirstname: ``,
  additionalNames: ``,
  phone: ``,
  hotel: ``,
  originCountry: config.countries[0],

  voucher: 0,
  famils: 0,
  voucherLastname: ``,
  voucherFirstname: ``,
  customerId: 0,
  customerNotes: ``,
  bookingRefIDInitial: ``,
  bookingRefID: ``,
  bookingRefIDIsUnique: true,
  bookingRefIDIsRequired: false,
  travelAgency: ``,
  bookingSource: ``,
  bookingSourceIsRequired: false,

  productId: false,
  productIdCheckRangeShow: 0,
  productIdCheckRange: `3:18`,
  twoDayRule: 0,
  tourDate: null,
  bookedDate: 0,
  tourCity: ``,
  optionTourTime: 0,
  overrideTourTime: ``,

  family: 0,

  noOfFamilyGroups: 0,
  familyRate: 0,
  noOfAdditionals: 0,
  additionalRate: 0,
  noOfAddChildren: 0,

  noOfAdult: 0,
  adultPrice: 0,
  noOfChildren: 0,
  childPrice: 0,

  noOfBabies: 0,

  totalRiders: 0,
  totalRidersDisabled: false,

  language: config.languages[0],

  babySeats: 0,
  trailAlongs: 0,
  smallKidsBikes: 0,
  largeKidsBikes: 0,

  sendToPartner: 0,
  partnerEmail: ``,
  sendToTourOperator: 0,
  operatorEmail: ``,
  operatorEmail2: ``,
  sendToGuest: 0,
  email: ``,
  guestNote: ``,

  checkIn: 0,
  noShow: 0,
  confirmedByPartner: 1,

  totalGross: 0,
  commission: 0,
  commissionLevel: 0,
  totalNet: 0,
  internalNotes: ``,
  emailTemplate: ``,
  voucherCode: "",
  voucherValue: 0,
  voucherIDs: "",

  validationErrors: [],
  purchaseIsVoucher: false,
  discounted: false,

  allotmentsData: false,
};

class TourPurchasePage extends React.Component {
  constructor(props) {
    super(props);

    let stateCopy = initialState;
    (stateCopy.userId = props.user.userId), (this.state = stateCopy);

    this.togglePanel = this.togglePanel.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setValueVoucher = this.setValueVoucher.bind(this);
    this.setValueNoOfBabies = this.setValueNoOfBabies.bind(this);
    this.setValueTotalGross = this.setValueTotalGross.bind(this);
    this.setValueTourType = this.setValueTourType.bind(this);
    this.totalRider = this.totalRider.bind(this);
    this.updateSinglePrice = this.updateSinglePrice.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormSubmitAndTakePayment =
      this.onFormSubmitAndTakePayment.bind(this);
    this.checkReferenceIdUniqueness =
      this.checkReferenceIdUniqueness.bind(this);

    if (props.params.id) {
      props.dispatch(setActivePageTitle(`Edit tour purchase`));
    } else {
      props.dispatch(setActivePageTitle(`Add tour purchase`));
    }
  }

  componentWillMount() {
    if (this.props.params.id) {
      this.setState({ loading: true });
      getTourPurchase(this.props.params.id)
        .then((editedPurchase) => {
          // No null values are allowed
          for (let key in editedPurchase) {
            if (editedPurchase[key] === null) editedPurchase[key] = ``;
          }

          // Customer notes
          if (!editedPurchase.customerNotes) {
            editedPurchase.customerNotes = ``;
          } else {
            editedPurchase.customerNotes = editedPurchase.customerNotes.trim();
          }

          // Overridden tour time
          if (editedPurchase.overrideTourTime) {
            editedPurchase.optionTourTime = 1;
          }

          // Normalizing integer values
          [
            `noOfFamilyGroups`,
            `noOfAdditionals`,
            `noOfAddChildren`,
            `noOfAdult`,
            `noOfChildren`,
            `noOfBabies`,
            `totalRiders`,
            `babySeats`,
            `trailAlongs`,
            `smallKidsBikes`,
            `largeKidsBikes`,
          ].map((item) => {
            if (editedPurchase[item] === ``) {
              editedPurchase[item] = 0;
            } else {
              editedPurchase[item] = parseInt(editedPurchase[item]);
            }
          });

          // Normalizing float values
          [
            `familyRate`,
            `additionalRate`,
            `adultPrice`,
            `childPrice`,
            `totalGross`,
            `commission`,
            `commissionLevel`,
            `totalNet`,
          ].map((item) => {
            if (editedPurchase[item] === ``) {
              editedPurchase[item] = 0;
            } else {
              editedPurchase[item] = parseFloat(editedPurchase[item]);
            }
          });

          if (editedPurchase.operatorEmail)
            editedPurchase.operatorEmail2 = editedPurchase.operatorEmail;
          editedPurchase.tourDate = new Date(
            editedPurchase.tourDate.indexOf("T") === -1
              ? editedPurchase.tourDate
              : editedPurchase.tourDate.split(`T`)[0] + "T00:00:00",
          );
          editedPurchase.totalRidersDisabled = true;

          editedPurchase.loading = false;

          if (editedPurchase.bookingRefID) {
            editedPurchase.bookingRefIDInitial = editedPurchase.bookingRefID;
          }

          editedPurchase.totalRiders =
            this.getTotalRiders(editedPurchase).total;

          this.setState(editedPurchase, () => {
            this.setValueTourType(
              `tourType`,
              this.state.productId,
              false,
              false,
            );

            if (editedPurchase.product.typeCode !== "VOUCHERS") {
              if (editedPurchase.voucherCode && !editedPurchase.discounted) {
                getDiscounts({ discountCode: editedPurchase.voucherCode })
                  .then((discounts) => {
                    this.setState((state) => {
                      return {
                        ...state,
                        voucherValue: discounts[0].discountAmount,
                      };
                    });
                  })
                  .catch((err) => {
                    this.setState((state) => {
                      return {
                        ...state,
                        validationErrors: [`Couldn't get discount`],
                      };
                    });
                  });
              }
            } else {
              const discountsPromised = this.state.voucherIDs
                .split(",")
                .map((discountID) => {
                  return getDiscount(discountID);
                });

              Promise.all(discountsPromised)
                .then((response) => {
                  const voucherCodes = response.reduce((acc, cur) => {
                    return acc
                      ? `${acc},${cur.discountCode}`
                      : cur.discountCode;
                  }, "");

                  if (voucherCodes !== undefined) {
                    this.setState((state) => {
                      return {
                        ...state,
                        voucherCode: voucherCodes,
                      };
                    });
                  }
                })
                .catch((err) => {
                  this.setState((state) => {
                    return {
                      ...state,
                      validationErrors: [
                        `Failed to load discount codes: ${JSON.stringify(err)}`,
                      ],
                    };
                  });
                });
            }
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [
              `Unable to get the purchase with identifier ${this.props.params.id}`,
            ],
          });
        });
    }
  }
  isPurchasedProductVoucher() {
    if (!this.state.product || this.state.product === undefined) {
      return false;
    }
    return this.state.product.typeCode === "VOUCHERS";
  }
  getTotalRiders(stateCopy) {
    let total = 0,
      sum = 0;
    if (stateCopy.family === 0) {
      total = stateCopy.noOfAdult + stateCopy.noOfChildren;
      sum =
        stateCopy.noOfAdult * stateCopy.adultPrice +
        stateCopy.noOfChildren * stateCopy.childPrice;
    } else {
      total =
        stateCopy.noOfFamilyGroups * 4 +
        stateCopy.noOfAdditionals +
        stateCopy.noOfAddChildren;
      sum =
        stateCopy.noOfFamilyGroups * stateCopy.familyRate +
        stateCopy.noOfAdditionals * stateCopy.additionalRate +
        stateCopy.noOfAddChildren * stateCopy.additionalRate;
    }

    return { total, sum };
  }
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      validationErrors: [],
    });
  };

  checkReferenceIdUniqueness(value) {
    if (!this.state.bookingRefIDIsUnique) {
      this.setState({ bookingRefIDIsUnique: true });
    }

    if (value) {
      getPurchases({ bookingReferenceId: value, purchaseType: `tour` }).then(
        (result) => {
          if (result.total > 0) {
            this.setState({ bookingRefIDIsUnique: false });
          }
        },
      );
    }
  }

  validate() {
    return new Promise((resolve, reject) => {
      let errors = [];

      let nexttwo = new Date();
      nexttwo.setDate(nexttwo.getDate() + 2);
      nexttwo = moment(nexttwo).format(`YYYYMMDD`);
      let strTourDate = moment(this.state.tourDate).format(`YYYYMMDD`);
      let todayTourDate = moment(new Date()).format(`YYYYMMDD`);

      // 2 Day Rule
      if (
        this.state.bookedDate === 0 &&
        this.state.totalRiders == 1 &&
        this.state.twoDayRule &&
        nexttwo > strTourDate &&
        strTourDate >= todayTourDate
      ) {
        errors.push(`Single Rider 2-Day Rule, unable to process purchase`);
      }

      if (this.state.optionTourTime && !this.state.overrideTourTime) {
        errors.push(`Departure time needs to be filled`);
      }

      if (
        (this.state.sendToPartner ||
          this.state.sendToTourOperator ||
          this.state.sendToGuest) &&
        this.state.emailTemplate === ``
      ) {
        errors.push(
          `Email template has not been assigned to the product, please assign an email template first`,
        );
      }

      if (this.state.sendToPartner) {
        if (this.state.partnerEmail === ``) {
          errors.push(`Booking partner email needs to be filled`);
        }
      }

      if (this.state.sendToTourOperator) {
        if (this.state.operatorEmail === ``) {
          errors.push(`Please enter operator email`);
        } else if (this.state.operatorEmail !== this.state.operatorEmail2) {
          errors.push(
            `Operator emails do not match, please retype operator email`,
          );
        }
      }

      if (this.state.sendToGuest) {
        if (this.state.email === ``) {
          errors.push(`Please enter traveller email`);
        }
      }

      // Ref ID Check
      if (this.state.bookingRefIDIsRequired && this.state.bookingRefID === ``) {
        errors.push(`Booking reference needs to be filled`);
      }

      if (this.state.bookingSourceIsRequired) {
        errors.push(`Booking source needs to be filled`);
      }

      if (!this.state.travelerLastname) {
        errors.push(`Traveller last name needs to be filled`);
      }

      if (this.state.customerId === 0) {
        errors.push(`Booking partner needs to be selected`);
      }

      if (!this.state.tourDate) {
        errors.push(`Tour date needs to be set`);
      }

      if (this.state.totalRiders === 0) {
        errors.push(`Please add at least one rider`);
      }

      this.props.products.map((product) => {
        if (parseInt(product.productID) === parseInt(this.state.productId)) {
          console.log(product);
          if (
            product.minGuestNo &&
            this.state.totalRiders < product.minGuestNo &&
            this.state.twoDayRule === 0
          ) {
            errors.push(
              `Minimum ${product.minGuestNo} guests required - Override to allow the booking to go ahead`,
            );
          }
        }
      });

      if (this.state.productId){
        getCountTourProduct(this.state.productId)
          .then((results) => {
            let resultCount = JSON.parse(JSON.stringify(results[0]));
            let totRideTour = parseInt(this.state.totalRiders) + parseInt(resultCount.tot_guest);
            let totLess = parseInt(resultCount.minGuestNo) - parseInt(this.state.totalRiders);
            console.log(totLess);
            if(parseInt(totRideTour) < parseInt(resultCount.minGuestNo)){
              errors.push(
                `you less ${totLess} rider to start the tour`,
              );
            }
          })
          .catch(() => {
            this.setState({
              loading: false,
              validationErrors: [`Error occured while count tour product`],
            });
          });
      }


      if (errors.length === 0) {
        // Allotment Check
        if (this.state.purchaseIsVoucher) {
          resolve();
        } else {
          getAllotmentAvailability(
            this.state.productId,
            moment(this.state.tourDate).format(`YYYY-MM-DD`),
          ).then((result) => {
            let available = result.available;
            if (available !== 0) {
              if (
                available < this.state.totalRiders &&
                this.state.twoDayRule === 0
              ) {
                errors.push(
                  `Not enough allotment on the selected day, please adjust the allotment`,
                );
              }
            } else if (
              this.state.voucher === 0 &&
              this.state.twoDayRule === 0
            ) {
              errors.push(
                `No allotment on the day, please adjust the allotment`,
              );
            }

            if (errors.length === 0) {
              resolve();
            } else {
              reject(errors);
            }
          });
        }
      } else {
        reject(errors);
      }
    });
  }

  onFormSubmitAndTakePayment() {
    this.onFormSubmit(true);
  }

  onFormSubmit(payAfterwards = false) {
    this.setState({ loading: true });
    this.validate()
      .then(() => {
        let stateCopy = JSON.parse(JSON.stringify(this.state));

        let data = {};
        [
          `additionalRate`,
          `additionalNames`,
          `adultPrice`,
          `babySeats`,
          `bookingRefID`,
          `bookingSource`,
          `checkIn`,
          `childPrice`,
          `commission`,
          `commissionLevel`,
          `confirmedByPartner`,
          `originCountry`,
          `customerId`,
          `customerNotes`,
          `email`,
          `emailTemplate`,
          `famils`,
          `family`,
          `familyRate`,
          `guestNote`,
          `hotel`,
          `internalNotes`,
          `language`,
          `largeKidsBikes`,
          `travelerFirstname`,
          `travelerLastname`,
          `noOfAddChildren`,
          `noOfAdditionals`,
          `noOfAdult`,
          `noOfBabies`,
          `noOfChildren`,
          `noOfFamilyGroups`,
          `noShow`,
          `operatorEmail`,
          `operatorEmail2`,
          `optionTourTime`,
          `overrideTourTime`,
          `partnerEmail`,
          `phone`,
          `productId`,
          `purchaseId`,
          `sendToGuest`,
          `sendToTourOperator`,
          `sendToPartner`,
          `smallKidsBikes`,
          `status`,
          `totalGross`,
          `totalNet`,
          `totalRiders`,
          `tourCity`,
          `trailAlongs`,
          `travelAgency`,
          `twoDayRule`,
          `userId`,
          `voucher`,
          `voucherFirstname`,
          `voucherLastname`,
          `voucherCode`,
          `voucherIDs`,
          `discounted`,
        ].map((item) => {
          if (stateCopy[item] !== null) {
            data[item] = stateCopy[item].toString();
          }
        });

        data.tourDate = moment(stateCopy.tourDate).format(`YYYY-MM-DD`);
        data.voucherExpireDate = moment(stateCopy.voucherExpireDate).format(
          `YYYY-MM-DD`,
        );

        data.city = stateCopy.tourCity;
        data.family = stateCopy.family.toString();

        if (stateCopy.purchaseId > 0) {
          updateTourPurchase(stateCopy.detailId, data)
            .then(() => {
              this.setState({ purchaseWasUpdated: true });
            })
            .catch((err) => {
              this.setState({
                loading: false,
                validationErrors: [`Error occured while updating purchase`],
              });
            });
        } else {
          createTourPurchase(data)
            .then((identifiers) => {
              if (payAfterwards === true) {
                this.props.router.push(
                  `/purchases/${identifiers.purchaseId}/payment`,
                );
              } else {
                identifiers.purchaseWasCreated = true;
                this.setState(identifiers);
              }
            })
            .catch(() => {
              this.setState({
                loading: false,
                validationErrors: [`Error occured while creating purchase`],
              });
            });
        }
      })
      .catch((validationErrors) => {
        console.log(validationErrors);
        this.setState({
          loading: false,
          validationErrors: Array.isArray(validationErrors)
            ? validationErrors
            : [validationErrors],
        });
      });
  }

  togglePanel(name) {
    if (name in this.state === false) {
      throw new Error(`Invalid panel name ${name}`);
    }

    this.setState({ [name]: !this.state[name] });
  }

  totalRider(optionalTotalGross = false) {
    let { total, sum } = this.getTotalRiders(this.state);

    let newState = {};
    newState.totalRiders = total;
    newState.totalGross =
      optionalTotalGross === false
        ? parseFloat(sum.toFixed(2))
        : optionalTotalGross;

    let commission = (newState.totalGross * this.state.commissionLevel) / 100;
    sum = newState.totalGross - commission;
    newState.commission = commission;
    let voucherValue = !!newState.voucherValue ? newState.voucherValue : 0;
    newState.totalNet = parseFloat(sum.toFixed(2)) - parseFloat(voucherValue);

    if (this.state.status.toLowerCase() === `cancelled`) {
      newState.commission = 0;
      newState.totalNet = 0;
      newState.totalGross = 0;
    }

    this.setState(newState);
  }

  updateSinglePrice() {
    let newState = {};

    let noOfRiders = 0;
    let totalPrice = 0;
    if (this.state.family === 0) {
      noOfRiders = noOfRiders + this.state.noOfAdult;
      totalPrice = totalPrice + this.state.noOfAdult * this.state.adultPrice;
      noOfRiders = noOfRiders + this.state.noOfChildren;
      totalPrice = totalPrice + this.state.noOfChildren * this.state.childPrice;
    } else {
      noOfRiders = noOfRiders + this.state.noOfFamilyGroups;
      totalPrice =
        totalPrice + this.state.noOfFamilyGroups * this.state.familyRate;
      noOfRiders = noOfRiders + this.state.noOfAdditionals;
      totalPrice =
        totalPrice + this.state.noOfAdditionals * this.state.additionalRate;
    }

    let diff = this.state.totalGross - totalPrice;
    let singleDiff = diff / noOfRiders;

    if (this.state.family === 0) {
      if (this.state.noOfAdult !== 0) {
        let adultPrice = this.state.adultPrice + singleDiff;
        newState.adultPrice = parseFloat(adultPrice.toFixed(2));
      }

      if (this.state.noOfChildren !== 0) {
        let childPrice = this.state.childPrice + singleDiff;
        newState.childPrice = parseFloat(childPrice.toFixed(2));
      }
    } else {
      if (this.state.noOfFamilyGroups !== 0) {
        let familyRate = this.state.familyRate + singleDiff;
        newState.familyRate = parseFloat(familyRate.toFixed(2));
      }

      if (this.state.noOfAdditionals !== 0) {
        let additionalRate = this.state.additionalRate + singleDiff;
        newState.additionalRate = parseFloat(additionalRate.toFixed(2));
      }
    }

    return newState;
  }

  generatePriceOriginMessage(newPrices) {
    let message = ``;
    if (newPrices.overriddenByBookingPartner) {
      message = `Prices are taken from Booking partner override values`;
    } else if (newPrices.appliedSeasonName) {
      message = `Prices are taken from Product price season "${newPrices.appliedSeasonName}"`;
    } else {
      message = `Prices are taken from regular product settings`;
    }

    return message;
  }

  setValueTourType(
    name,
    value,
    recalculate = true,
    setPricesAndTourTime = true,
  ) {
    this.setState({ loading: true });

    let requestedDate = moment().format(`YYYY-MM-DD`);
    if (this.state.tourDate)
      requestedDate = moment(this.state.tourDate).format(`YYYY-MM-DD`);

    getProductTourPricing(this.state.customerId, value, requestedDate)
      .then((result) => {
        let newState = { productId: value };
        if (result) {
          newState.confirmedByPartner = parseInt(result.confirmedByPartner);
          if (setPricesAndTourTime) {
            newState.additionalRate = result.additionalRate
              ? parseFloat(result.additionalRate)
              : 0;
            newState.adultPrice = result.adultPrice
              ? parseFloat(result.adultPrice)
              : 0;
            newState.childPrice = result.childPrice
              ? parseFloat(result.childPrice)
              : 0;
            newState.familyRate = result.familyRate
              ? parseFloat(result.familyRate)
              : 0;
            newState.priceOrigin = this.generatePriceOriginMessage(result);
          }

          newState.tourCity = result.tourCity;
          newState.emailTemplate = result.emailTemplate;
        }

        getAllotmentsForRange(value, this.state.productIdCheckRange)
          .then((result) => {
            newState.allotmentsData = result;
            newState.loading = false;

            // Whenever new product is seleted, the departure time needd to be set to the default value
            if (setPricesAndTourTime) {
              newState.optionTourTime = 0;
              newState.overrideTourTime = ``;
            }

            this.setState(newState, () => {
              if (recalculate) this.totalRider();
            });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
    if (name === "productId") {
      const found = !!this.props.products
        ? this.props.products.find((product) => {
            return product.productID === Number(value);
          })
        : null;

      if (!found) {
        return;
      }
      //const voucherCode = generateCode();
      const purchaseIsVoucher = found.typeCode === "VOUCHERS";
      this.setState((state) => {
        return {
          ...state,
          purchaseIsVoucher: purchaseIsVoucher,
          tourDate:
            found.typeCode === "VOUCHERS"
              ? new Date(2050, 1, 1)
              : this.state.tourDate,
          //voucherCode: purchaseIsVoucher ? voucherCode[0] : ''
        };
      });
    }
  }

  setValueTotalGross(name, value) {
    this.setState({ totalGross: parseFloat(value) }, () => {
      let updatedStateValues = this.updateSinglePrice();
      this.setState(updatedStateValues, () => {
        this.totalRider(parseFloat(value));
      });
    });
  }

  setValueNoOfBabies(name, value) {
    this.setState(
      {
        noOfBabies: value,
        babySeats: value,
      },
      () => {
        this.totalRider();
      },
    );
  }

  setValueVoucher(name, value) {
    let newState = { voucher: value };
    if (value === 1) {
      newState.tourDate = new Date(2050, 1, 1);
    }

    this.setState(newState);
  }

  setValue(name, value) {
    let fieldsToTriggerTheRecalculation = [
      `status`,
      `noOfAdult`,
      `noOfChildren`,
      `adultPrice`,
      `childPrice`,
      `noOfFamilyGroups`,
      `familyRate`,
      `noOfAdditionals`,
      `additionalRate`,
      `noOfAddChildren`,
      `family`,
    ];

    if (name === `tourDate`) {
      this.setState({
        loading: true,
        tourDate: value,
      });

      getProductTourPricing(
        this.state.customerId,
        this.state.productId,
        moment(value).format(`YYYY-MM-DD`),
      )
        .then((result) => {
          let newState = { loading: false };
          if (result) {
            newState.confirmedByPartner = parseInt(result.confirmedByPartner);
            //newState.adultPrice = (result.adultPrice ? parseFloat(result.adultPrice) : 0);
            newState.childPrice = result.childPrice
              ? parseFloat(result.childPrice)
              : 0;
            newState.familyRate = result.familyRate
              ? parseFloat(result.familyRate)
              : 0;
            newState.additionalRate = result.additionalRate
              ? parseFloat(result.additionalRate)
              : 0;
            newState.priceOrigin = this.generatePriceOriginMessage(result);
          }

          checkIfDateIsBooked(
            this.state.productId,
            moment(value).format(`YYYY-MM-DD`),
          )
            .then((result) => {
              newState.bookedDate = result.isBooked ? true : false;
              this.setState(newState, this.totalRider);
            })
            .catch(() => {
              this.setState({ loading: false });
            });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    } else if (name === `customerId`) {
      this.setState({ loading: true });
      let newStateFragment = { customerId: value };
      getCustomerCommission(value)
        .then((result) => {
          if (result) {
            let commission = result.commission
              ? (parseFloat(result.commission) * this.state.totalGross) / 100
              : 0;
            let net = this.state.totalGross - commission;
            newStateFragment.commissionLevel = result.commission
              ? parseFloat(result.commission)
              : 0;
            newStateFragment.commission = parseFloat(
              parseFloat(commission).toFixed(2),
            );
            newStateFragment.totalNet = parseFloat(parseFloat(net).toFixed(2));
            newStateFragment.partnerEmail = result.email ? result.email : ``;
            newStateFragment.customerNotes = result.customerNotes
              ? result.customerNotes.trim()
              : ``;

            if (result.bookingRefID && parseInt(result.bookingRefID) === 1) {
              newStateFragment.bookingRefIDIsRequired = true;
            } else {
              newStateFragment.bookingRefIDIsRequired = false;
            }
          }

          let requestedDate = moment().format(`YYYY-MM-DD`);
          if (this.state.tourDate)
            requestedDate = moment(this.state.tourDate).format(`YYYY-MM-DD`);
          getProductTourPricing(value, this.state.productId, requestedDate)
            .then((result) => {
              if (Number(value) === 211) {
                newStateFragment.bookingSourceIsRequired = true;
              } else {
                newStateFragment.bookingSourceIsRequired = false;
              }

              if (result) {
                newStateFragment.additionalRate = result.additionalRate
                  ? parseFloat(result.additionalRate)
                  : 0;
                //newStateFragment.adultPrice = (result.adultPrice ? parseFloat(result.adultPrice) : 0);
                newStateFragment.childPrice = result.childPrice
                  ? parseFloat(result.childPrice)
                  : 0;
                newStateFragment.familyRate = result.familyRate
                  ? parseFloat(result.familyRate)
                  : 0;
                newStateFragment.priceOrigin =
                  this.generatePriceOriginMessage(result);
              }

              newStateFragment.loading = false;

              this.setState(newStateFragment, this.totalRider);
            })
            .catch(() => {
              this.setState({ loading: false });
            });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    } else if (fieldsToTriggerTheRecalculation.indexOf(name) > -1) {
      this.setState({ [name]: value }, this.totalRider);
    } else {
      this.setState({ [name]: value });
    }
    if (name === "voucherValue") {
      this.setState((state) => {
        return {
          ...state,
          voucherValue: Math.abs(value),
        };
      });
    }
    if (name === "bookingSource") {
      this.setState((state) => {
        return {
          ...state,
          bookingSourceIsRequired: false,
        };
      });
    }
    if (name === "voucherCode") {
      this.setState({ voucher: 1 });
    }
  }
  recalculateTotal = (e) => {};
  applyDiscount = () => {
    if (!this.state.voucherCode) {
      return;
    }
    if (this.state.discounted) {
      return;
    }

    getDiscounts({ discountCode: this.state.voucherCode })
      .then((discount) => {
        if (discount.length < 1) {
          this.setState((state) => {
            return {
              ...state,
              validationErrors: ["Discount does not exists"],
            };
          });
          return;
        }
        const expireDate = moment(discount[0]["expireDate"]);
        const today = new Date();

        if (!discount[0].active || expireDate.isBefore(moment(today))) {
          this.setState((state) => {
            return {
              ...state,
              validationErrors: [
                "Discount has either expired or it has been used",
              ],
            };
          });
          return;
        }

        const discountAmount =
          discount[0].discountType == "ABSOLUTE"
            ? discount[0].discountAmount
            : (discount[0].discountAmount / 100) * this.state.totalGross;
        this.setState((state) => {
          return {
            ...state,
            voucherValue: discountAmount,
            totalNet: state.totalNet - discountAmount,
            discounted: true,
          };
        });
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            validationErrors: ["Something went wrong applying the discount"],
          };
        });
      });
  };

  resetForm() {
    let stateCopy = initialState;
    (stateCopy.userId = this.props.user.userId), this.setState(stateCopy);
  }

  render() {
    let overlay = false;

    if (this.state.loading) {
      let overlayContent = (
        <div
          style={{
            top: `50%`,
            position: `absolute`,
            left: `50%`,
          }}
        >
          <CircularProgress />
        </div>
      );

      if (this.state.purchaseWasCreated || this.state.purchaseWasUpdated) {
        let text = (
          <p>
            Tour purchase was created (Bonza booking ID: {this.state.purchaseId}
            )
          </p>
        );
        let link = (
          <div>
            <div>
              <Link
                to={`/purchases/edit-tour/${this.state.purchaseId}`}
                className="no-underline"
              >
                <Button variant="contained">Edit purchase</Button>
              </Link>
            </div>
            <div style={{ paddingTop: `10px` }}>
              <Link
                to={`/purchases/${this.state.purchaseId}/payment`}
                className="no-underline"
              >
                <Button variant="contained" className="button-green">
                  Take payment
                </Button>
              </Link>
            </div>
            <div style={{ paddingTop: `10px` }}>
              <Button
                variant="contained"
                className="button-orange"
                onClick={this.resetForm.bind(this)}
              >
                Add another purchase
              </Button>
            </div>
            <div style={{ paddingTop: `10px` }}>
              <Link to="/" className="no-underline">
                <Button variant="contained" color="primary">
                  Back to home
                </Button>
              </Link>
            </div>
          </div>
        );

        if (this.state.purchaseWasUpdated) {
          text = <p>Tour purchase was updated</p>;
          link = (
            <div>
              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    this.setState({
                      loading: false,
                      purchaseWasUpdated: false,
                    });
                  }}
                >
                  Edit purchase
                </Button>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Link
                  to={`/purchases/${this.state.purchaseId}/payment`}
                  className="no-underline"
                >
                  <Button variant="contained" className="button-green">
                    Take payment
                  </Button>
                </Link>
              </div>
              <div style={{ paddingTop: `10px` }}>
                <Link to="/" className="no-underline">
                  <Button variant="contained" color="primary">
                    Back to home
                  </Button>
                </Link>
              </div>
            </div>
          );
        }

        overlayContent = (
          <div
            style={{
              top: `calc(40% - 80px)`,
              left: `calc(50% - 80px)`,
              position: `fixed`,
              textAlign: `center`,
            }}
          >
            <CheckIcon color="primary" style={{ fontSize: 80 }} />
            <br />
            {text}
            {link}
          </div>
        );
      }

      overlay = (
        <div
          style={{
            position: `fixed`,
            width: `100%`,
            height: `100%`,
            backgroundColor: `rgba(255,255,255,0.6)`,
            zIndex: `100`,
            top: `0px`,
            left: `0px`,
          }}
        >
          {overlayContent}
        </div>
      );
    }

    let uniqueBookingReferenceIdNotification = false;
    if (this.state.bookingRefID) {
      if (!this.state.bookingRefIDIsUnique) {
        if (
          !this.state.bookingRefIDInitial ||
          (this.state.bookingRefIDInitial &&
            this.state.bookingRefID !== this.state.bookingRefIDInitial)
        ) {
          uniqueBookingReferenceIdNotification = (
            <Tooltip
              title="Such identifier already exists"
              placement="top"
              enterDelay={300}
            >
              <Typography variant="subtitle2" style={{ color: `red` }}>
                This booking ID already exists
              </Typography>
            </Tooltip>
          );
        }
      }
    }

    let panelHeaderStyle = {
      backgroundColor: `rgb(30, 136, 229)`,
      color: `white`,
    };

    let enteredByInfo = false;
    this.props.users.map((item) => {
      let userId = this.state.userId;
      if (this.state.purchaseId > 0) userId = this.state.enteredBy;

      if (item.userId === userId) {
        if (this.state.enteredAt) {
          enteredByInfo = (
            <div>
              <p>
                Entered by: {item.firstname} {item.lastname}
              </p>
              <p>
                Entered on:{" "}
                {moment(this.state.enteredAt).format(
                  config.momentDateTimeFormat,
                )}
              </p>
            </div>
          );
        } else {
          enteredByInfo = (
            <div>
              <p>
                Entered by: {item.firstname} {item.lastname}
              </p>
            </div>
          );
        }
      }
    });

    let updatedByInfo = false;
    if (this.state.purchaseId > 0) {
      this.props.users.map((item) => {
        if (item.userId === this.state.updatedBy) {
          if (this.state.updatedAt) {
            updatedByInfo = (
              <div>
                <p>
                  Last updated by: {item.firstname} {item.lastname}
                </p>
                <p>
                  Last updated on:{" "}
                  {moment(this.state.updatedAt).format(
                    config.momentDateTimeFormat,
                  )}
                </p>
              </div>
            );
          } else {
            updatedByInfo = (
              <div>
                <p>
                  Last updated by: {item.firstname} {item.lastname}
                </p>
              </div>
            );
          }
        }
      });
    }

    let additionaMiscPurchasesText = ``;
    if (
      this.state.miscPurchases &&
      this.state.miscPurchases.items &&
      Array.isArray(this.state.miscPurchases.items)
    ) {
      let texts = [];
      this.state.miscPurchases.items.map((miscPurchase) => {
        let productId = parseInt(miscPurchase.productID);
        let quantity = parseInt(miscPurchase.qty);

        if (productId > 0 && quantity > 0 && this.props.products) {
          this.props.products.map((product) => {
            if (product.productID === productId) {
              texts.push(
                `${product.name} (${quantity} * ${"$" + miscPurchase.price})`,
              );
            }
          });
        }
      });

      if (texts.length > 0) {
        additionaMiscPurchasesText = `(` + texts.join(`, `) + `)`;
      }
    }

    const isPurchasedProductVoucher =
      !!this.state.product && this.state.product.typeCode === "VOUCHERS";
    const miscPurchasesTotal =
      !!this.state.miscPurchases && this.state.miscPurchases.total
        ? this.state.miscPurchases.total
        : 0;
    return (
      <div style={{ position: `relative` }}>
        {overlay}
        <div style={{ paddingBottom: `10px` }}>
          {this.state.locked}
          {this.state.locked ? (
            <div>
              <LockedPurchaseNotification />
            </div>
          ) : (
            false
          )}

          <ExpansionPanel
            expanded={!this.state.travelerSectionCollapsed}
            onChange={() => {
              this.togglePanel(`travelerSectionCollapsed`);
            }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
              style={panelHeaderStyle}
            >
              <div>
                <div style={{ float: `left`, paddingRight: `10px` }}>
                  <PersonIcon />
                </div>{" "}
                Traveller details
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ width: `100%` }}>
                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Lead traveller last name"
                      value={this.state.travelerLastname}
                      fullWidth={true}
                      required={true}
                      name="travelerLastname"
                      onChange={this.setValue}
                      disabled={this.state.locked ? true : false}
                    />
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Lead traveller first name"
                      value={this.state.travelerFirstname}
                      name="travelerFirstname"
                      onChange={this.setValue}
                      disabled={this.state.locked ? true : false}
                    />
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaSelectField
                      title="Origin country"
                      value={this.state.originCountry}
                      options={config.countries}
                      name="originCountry"
                      onChange={this.setValue}
                    />
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Additional traveller names"
                      fullWidth={true}
                      multiline={true}
                      rows={2}
                      value={this.state.additionalNames}
                      name="additionalNames"
                      onChange={this.setValue}
                    />
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Phone number"
                      value={this.state.phone}
                      fullWidth={true}
                      name="phone"
                      onChange={this.setValue}
                    />
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Hotel"
                      value={this.state.hotel}
                      fullWidth={true}
                      name="hotel"
                      onChange={this.setValue}
                    />
                  </div>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={!this.state.saleSectionCollapsed}
            onChange={() => {
              this.togglePanel(`saleSectionCollapsed`);
            }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
              style={panelHeaderStyle}
            >
              <div>
                <div style={{ float: `left`, paddingRight: `10px` }}>
                  <InfoIcon />
                </div>{" "}
                Sale details
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ width: `100%` }}>
                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                    style={noMargin}
                  >
                    <BonzaSelectField
                      title="Status"
                      value={this.state.status}
                      options={config.statuses}
                      name="status"
                      capitalize={true}
                      disabled={this.state.locked ? true : false}
                      onChange={this.setValue}
                    />
                  </div>
                  {this.state.purchaseId > 0 ? (
                    <div
                      className="col-xs-12 col-sm-6 col-md-8 col-lg-9 m-b-15"
                      style={{ textAlign: `right` }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Bonza booking ID:{" "}
                        <strong>{this.state.purchaseId}</strong>
                      </Typography>
                    </div>
                  ) : (
                    false
                  )}
                </div>

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-4 m-b-15"
                    style={noMargin}
                  >
                    <BonzaBooleanField
                      title="Gift Certificate/Voucher Booking"
                      value={this.state.voucher}
                      name="voucher"
                      onChange={this.setValueVoucher}
                    />
                  </div>
                </div>

                {this.state.voucher === 1 ? (
                  <div className="row">
                    <div
                      className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Voucher Purchaser Last Name/Company Name"
                        value={this.state.voucherLastname}
                        name="voucherLastname"
                        onChange={this.setValue}
                      />
                    </div>
                    <div
                      className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                      style={noMargin}
                    >
                      <BonzaTextField
                        title="Voucher Purchaser First Name"
                        value={this.state.voucherFirstname}
                        name="voucherFirstname"
                        onChange={this.setValue}
                      />
                    </div>
                  </div>
                ) : (
                  false
                )}

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                    style={noMargin}
                  >
                    <BonzaSelectField
                      title="Booking partner"
                      options={this.props.customers}
                      optionsIdField="customerID"
                      optionsTitleField="name"
                      required={true}
                      value={this.state.customerId}
                      disabled={this.state.locked ? true : false}
                      name="customerId"
                      onChange={this.setValue}
                    />
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Booking partner notes"
                      value={this.state.customerNotes}
                      multiline={true}
                      disabled={true}
                      rows={this.state.customerNotes ? 8 : 2}
                      fullWidth={true}
                      name="customerNotes"
                      onChange={this.setValue}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
                    <div style={{ display: `flex` }}>
                      <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
                        <FormLabel style={{ whiteSpace: `nowrap` }}>
                          Booking partner reference
                        </FormLabel>
                      </div>
                      <div style={{ paddingRight: `10px` }}>
                        <TextField
                          type="text"
                          required={this.state.bookingRefIDIsRequired}
                          value={this.state.bookingRefID}
                          onBlur={(event) => {
                            this.checkReferenceIdUniqueness(event.target.value);
                          }}
                          onChange={(event) => {
                            this.setValue(`bookingRefID`, event.target.value);
                          }}
                        />
                        {uniqueBookingReferenceIdNotification}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
                    <BonzaSelectField
                      title="Booking source"
                      required={this.state.bookingSourceIsRequired}
                      value={this.state.bookingSource}
                      options={config.bookingSources}
                      name="bookingSource"
                      onChange={this.setValue}
                    />
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTextField
                      title="Travel agency"
                      value={this.state.travelAgency}
                      name="travelAgency"
                      onChange={this.setValue}
                    />
                  </div>
                  <div
                    className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                    style={noMargin}
                  >
                    <BonzaBooleanField
                      title="Famil"
                      value={this.state.famils}
                      name="famils"
                      onChange={this.setValue}
                    />
                  </div>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel
            expanded={!this.state.tourSectionCollapsed}
            onChange={() => {
              this.togglePanel(`tourSectionCollapsed`);
            }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
              style={panelHeaderStyle}
            >
              <div>
                <div style={{ float: `left`, paddingRight: `10px` }}>
                  <DirectionsBikeIcon />
                </div>{" "}
                Tour details
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ width: `100%` }}>
                <div className="row">
                  <div
                    className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                    style={noMargin}
                  >
                    <BonzaTourTypeSelect
                      title="Tour type"
                      value={this.state.productId}
                      name="productId"
                      required={true}
                      disabled={this.state.locked ? true : false}
                      onChange={this.setValueTourType}
                    />
                  </div>
                </div>

                {this.state.productId > 0 ? (
                  <div>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Override allotment"
                          value={this.state.twoDayRule}
                          name="twoDayRule"
                          disabled={this.state.locked ? true : false}
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row tour-purchase-page_date-picker-container">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaDatePickerField
                          title="Tour date"
                          value={this.state.tourDate}
                          name="tourDate"
                          required={!this.state.purchaseIsVoucher}
                          disabled={this.state.locked ? true : false}
                          allotments={
                            this.state.twoDayRule
                              ? false
                              : this.state.allotmentsData
                          }
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Override departure time"
                          value={this.state.optionTourTime}
                          name="optionTourTime"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        {this.state.optionTourTime === 1 ? (
                          <BonzaTextField
                            title="Departure time"
                            value={this.state.overrideTourTime}
                            name="overrideTourTime"
                            onChange={this.setValue}
                          />
                        ) : (
                          false
                        )}
                      </div>
                    </div>

                    <Divider />

                    {this.state.priceOrigin ? (
                      <div className="row">
                        <div
                          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                          style={{ paddingTop: `10px` }}
                        >
                          <Paper elevation={1} style={{ padding: `14px` }}>
                            <Typography component="p">
                              {this.state.priceOrigin}
                            </Typography>
                          </Paper>
                        </div>
                      </div>
                    ) : (
                      false
                    )}

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Family booking"
                          disabled={this.state.locked ? true : false}
                          value={this.state.family}
                          name="family"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    {this.state.family === 1 ? (
                      <div>
                        <div className="row">
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Family groups"
                              type="number"
                              value={this.state.noOfFamilyGroups}
                              name="noOfFamilyGroups"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Family rate ($)"
                              type="number"
                              value={this.state.familyRate}
                              name="familyRate"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Additional family riders (adults)"
                              type="number"
                              value={this.state.noOfAdditionals}
                              name="noOfAdditionals"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Additional rider rate ($)"
                              type="number"
                              value={this.state.additionalRate}
                              name="additionalRate"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Additional family riders (children)"
                              type="number"
                              value={this.state.noOfAddChildren}
                              name="noOfAddChildren"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="row">
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Number of adults"
                              type="number"
                              value={this.state.noOfAdult}
                              name="noOfAdult"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Adult price ($)"
                              type="number"
                              value={this.state.adultPrice}
                              name="adultPrice"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Number of children"
                              type="number"
                              value={this.state.noOfChildren}
                              name="noOfChildren"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                          <div
                            className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                            style={noMargin}
                          >
                            <BonzaTextField
                              title="Child price ($)"
                              type="number"
                              value={this.state.childPrice}
                              name="childPrice"
                              disabled={this.state.locked ? true : false}
                              onChange={this.setValue}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Babies under 2"
                          type="number"
                          value={this.state.noOfBabies}
                          name="noOfBabies"
                          disabled={this.state.locked ? true : false}
                          onChange={this.setValueNoOfBabies}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Total riders"
                          type="number"
                          value={this.state.totalRiders}
                          disabled={
                            this.state.totalRidersDisabled ? true : false
                          }
                          name="totalRiders"
                          disabled={this.state.locked ? true : false}
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        paddingTop: `10px`,
                        paddingBottom: `10px`,
                      }}
                    >
                      <Divider />
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Baby seats required"
                          type="number"
                          value={this.state.babySeats}
                          name="babySeats"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Trail alongs required"
                          type="number"
                          value={this.state.trailAlongs}
                          name="trailAlongs"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Small kids bikes required"
                          type="number"
                          value={this.state.smallKidsBikes}
                          name="smallKidsBikes"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Large kids bikes required"
                          type="number"
                          value={this.state.largeKidsBikes}
                          name="largeKidsBikes"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  false
                )}
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          {this.state.productId > 0 ? (
            <div>
              <ExpansionPanel
                expanded={!this.state.emailConfirmationSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`emailConfirmationSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
                  style={panelHeaderStyle}
                >
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <EmailIcon />
                    </div>{" "}
                    Email confirmation details
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Send confirmation email to booking partner reservations staff"
                          value={this.state.sendToPartner}
                          name="sendToPartner"
                          onChange={this.setValue}
                        />
                      </div>

                      {this.state.sendToPartner === 1 ? (
                        <div
                          className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Booking partner email address"
                            type="email"
                            fullWidth={true}
                            value={this.state.partnerEmail}
                            name="partnerEmail"
                            onChange={this.setValue}
                          />
                        </div>
                      ) : (
                        false
                      )}
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Send confirmation email to traveller"
                          value={this.state.sendToGuest}
                          name="sendToGuest"
                          onChange={this.setValue}
                        />
                      </div>

                      {this.state.sendToGuest === 1 ? (
                        <div
                          className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                          style={noMargin}
                        >
                          <BonzaTextField
                            title="Traveller email address"
                            type="email"
                            fullWidth={true}
                            value={this.state.email}
                            name="email"
                            onChange={this.setValue}
                          />
                        </div>
                      ) : (
                        false
                      )}
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Traveller notes (to be included in confirmation email)"
                          multiline={true}
                          fullWidth={true}
                          value={this.state.guestNote}
                          name="guestNote"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={!this.state.bookingStatusSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`bookingStatusSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
                  style={panelHeaderStyle}
                >
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <CheckIcon />
                    </div>{" "}
                    Booking status
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="Checked in"
                          value={this.state.checkIn}
                          name="checkIn"
                          onChange={this.setValue}
                        />
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        <BonzaBooleanField
                          title="No show"
                          value={this.state.noShow}
                          name="noShow"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={!this.state.bookingVoucherSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`bookingVoucherSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
                  style={panelHeaderStyle}
                >
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <CheckIcon />
                    </div>{" "}
                    Vouchers
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        {
                          <BonzaTextField
                            title={
                              isPurchasedProductVoucher
                                ? "Voucher IDs"
                                : "Enter discount code"
                            }
                            value={this.state ? this.state.voucherCode : ""}
                            name="voucherCode"
                            //disabled={!this.state.purchaseIsVoucher}
                            //disabled={isPurchasedProductVoucher}

                            onChange={this.setValue}
                          />
                        }
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        {isPurchasedProductVoucher && (
                          <BonzaTextField
                            title="Voucher Value"
                            type="number"
                            value={this.state.voucherValue}
                            min={1}
                            name="voucherValue"
                            onChange={this.setValue}
                            disabled={true}
                            onBlur={this.recalculateTotal}
                          />
                        )}
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        {(this.state.voucherExpireDate ||
                          !this.state.purchaseId) &&
                          isPurchasedProductVoucher && (
                            <BonzaDatePickerField
                              title="Voucher Expire Date"
                              value={this.state.voucherExpireDate}
                              name="voucherExpireDate"
                              onChange={this.setValue}
                            />
                          )}
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15"
                        style={noMargin}
                      >
                        {/* {this.state.voucherIsUsed > 0 && <p> Voucher has being used </p>  } */}
                      </div>
                    </div>
                    {!this.state.purchaseIsVoucher && (
                      <div style={{ marginTop: "2rem" }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={this.applyDiscount}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={!this.state.paymentSectionCollapsed}
                onChange={() => {
                  this.togglePanel(`paymentSectionCollapsed`);
                }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: `white` }} />}
                  style={panelHeaderStyle}
                >
                  <div>
                    <div style={{ float: `left`, paddingRight: `10px` }}>
                      <PaymentIcon />
                    </div>{" "}
                    Payment
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div style={{ width: `100%` }}>
                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Total gross sale"
                          type="number"
                          value={this.state.totalGross + miscPurchasesTotal}
                          name="totalGross"
                          disabled={this.state.locked ? true : false}
                          onChange={this.setValueTotalGross}
                        />
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Commissions"
                          type="number"
                          value={this.state.commission}
                          name="commission"
                          disabled={true}
                          onChange={this.setValue}
                        />
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        {this.state.voucherCode &&
                          !isPurchasedProductVoucher && (
                            <span className="MuiFormLabel-root-97">
                              {" "}
                              {this.state.voucherCode}{" "}
                            </span>
                          )}

                        {this.state.voucherValue > 0 && (
                          <BonzaTextField
                            title="Voucher Value"
                            type="number"
                            value={this.state.voucherValue}
                            min={1}
                            name="voucherValue"
                            onChange={this.setValue}
                            disabled={true}
                          />
                        )}
                      </div>

                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Total net sale"
                          type="number"
                          value={this.state.totalNet + miscPurchasesTotal}
                          name="totalNet"
                          disabled={true}
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15"
                        style={noMargin}
                      >
                        <div>{enteredByInfo}</div>
                        <div>{updatedByInfo}</div>
                      </div>
                      <div
                        className="col-xs-12 col-sm-6 col-md-8 col-lg-8 m-b-15"
                        style={noMargin}
                      >
                        <BonzaTextField
                          title="Internal notes"
                          fullWidth={true}
                          multiline={true}
                          rows={6}
                          value={this.state.internalNotes}
                          name="internalNotes"
                          onChange={this.setValue}
                        />
                      </div>
                    </div>

                    {this.state.miscPurchases ? (
                      <div className="row">
                        <div
                          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                          style={noMargin}
                        >
                          <p>
                            Also, the purchase has additional miscellaneous
                            purchases: $
                            {this.state.miscPurchases.total.toFixed(2)}{" "}
                            {additionaMiscPurchasesText}
                          </p>
                          <p>
                            Total purchase: $
                            {this.state.totalGross + this.state.voucherValue}{" "}
                            (tour) + ${this.state.miscPurchases.total} (misc) -
                            ${this.state.voucherValue} (Voucher) ={" "}
                            <strong>
                              ${this.state.totalGross + miscPurchasesTotal}{" "}
                              total
                            </strong>
                          </p>
                        </div>
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              {this.state.locked ? (
                <div style={{ paddingBottom: `10px` }}>
                  <LockedPurchaseNotification />
                </div>
              ) : (
                false
              )}

              {this.state.purchaseId > 0 ? (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Update purchase
                  </Button>
                  <Link
                    to={`/purchases/${this.state.purchaseId}/payment`}
                    className="no-underline"
                    style={{ paddingLeft: `10px` }}
                  >
                    <Button variant="contained">Add payment</Button>
                  </Link>
                  <Link
                    to={`/purchases/${this.state.purchaseId}/refund`}
                    className="no-underline"
                    style={{ paddingLeft: `10px` }}
                  >
                    <Button variant="contained">Add refund</Button>
                  </Link>
                  <Link
                    to={`/purchases/${this.state.purchaseId}/history`}
                    className="no-underline"
                    style={{ paddingLeft: `10px` }}
                  >
                    <Button variant="contained">Payment history</Button>
                  </Link>
                  <Link
                    to={`/purchases/edit-misc/${this.state.purchaseId}`}
                    className="no-underline"
                    style={{ paddingLeft: `10px` }}
                  >
                    <Button variant="contained">
                      Edit miscellaneous purchase
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onFormSubmitAndTakePayment}
                    style={{ paddingLeft: `10px`, marginLeft: `10px` }}
                  >
                    Save and take payment
                  </Button>
                </div>
              )}
            </div>
          ) : (
            false
          )}
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.validationErrors.length > 0}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={
            <div>
              {this.state.validationErrors.map((item, index) => (
                <p key={`error_message_${index}`}>{item}</p>
              ))}
            </div>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

TourPurchasePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any.isRequired,
  purchase: PropTypes.any.isRequired,
  customers: PropTypes.array.isRequired,
  customerComission: PropTypes.any.isRequired,
  tourPricing: PropTypes.any.isRequired,
  onTourPriceChange: PropTypes.func.isRequired,
};

/* eslint-disable */
function mapStateToProps(state) {
  const {
    addPurchaseReducer,
    customerReducer,
    userReducer,
    productReducer,
    auth,
  } = state;
  const { loading, error, purchase } = addPurchaseReducer;
  const { customers, customerComission } = customerReducer;
  const { tourPricing, products, purchasePriceUpdating, purchasePriceUpdated } =
    productReducer;
  const { users } = userReducer;
  const { user } = auth;
  return {
    loading,
    error,
    purchase,
    products,
    customers,
    customerComission,
    tourPricing,
    users,
    user,
    purchasePriceUpdating,
    purchasePriceUpdated,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onTourPriceChange: (data) => dispatch(requestProductPriceUpdate(data)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(TourPurchasePage),
);
