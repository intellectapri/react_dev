import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import { setActivePageTitle } from "../actions/settings";
import BonzaTextField from "../components/BonzaTextField";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaSelectField from "../components/BonzaSelectField";
import BonzaDatePickerField from "../components/BonzaDatePickerField";
import BonzaNotification from "../components/BonzaNotification";
import LockedPurchaseNotification from "../components/LockedPurchaseNotification";

import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import config from "../config";
import { getProducts } from "../middleware/api/products";
import { getCustomers } from "../middleware/api/customers";
import {
  getMiscPurchase,
  createMiscPurchase,
  getPurchaseHistory,
  updateMiscPurchase,
  deleteMiscPurchase,
} from "../middleware/api/purchases";

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const noMargin = { marginBottom: `0px` };

const initialState = {
  loading: true,
  products: [],
  payments: [],
  purchaseId: 0,
  detailId: 0,
  purchaseWasCreated: false,
  purchaseWasUpdated: false,
  purchaseDate: new Date(),
  purchaseDateLocked: false,
  city: config.cities[0],
  addedProductId: 0,
  addedProductPrice: 0,
  addedProductQuantity: 0,
  addedProductTotal: 0,
  internalNotes: ``,
  bookingPartnerEmail: ``,
  purchasedProducts: [],
  validationErrors: [],
  baseTourPrice: 0,
  sendConfirmationToBookingPartner: 0,
};

class MiscPurchasePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    props.dispatch(setActivePageTitle(`Add misc purchase`));

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.clearAddProductForm = this.clearAddProductForm.bind(this);
    this.deletePurchasedProduct = this.deletePurchasedProduct.bind(this);
  }

  deletePurchasedProduct(index) {
    let purchasedProducts = this.state.purchasedProducts;
    purchasedProducts.splice(index, 1);

    this.setState({ purchasedProducts });
  }

  addProduct() {
    let purchasedProducts = this.state.purchasedProducts;
    purchasedProducts.push({
      detailId: 0,
      productId: this.state.addedProductId,
      price: this.state.addedProductPrice,
      qty: this.state.addedProductQuantity,
    });

    this.setState({ purchasedProducts }, () => {
      this.clearAddProductForm();
    });
  }

  clearAddProductForm() {
    this.setState({
      addedProductId: this.state.products[0].productID,
      addedProductPrice: this.state.products[0].basePrice
        ? parseFloat(this.state.products[0].basePrice)
        : 0,
      addedProductQuantity: 0,
      addedProductTotal: 0,
    });
  }

  intializeForm() {
    getCustomers()
      .then((customers) => {
        getProducts({ typeCodes: [`MERCH`, `DRINKS`] })
          .then((products) => {
            let newState = {
              addedProductId: products[0].productID,
              addedProductPrice: products[0].basePrice
                ? parseFloat(products[0].basePrice)
                : 0,
              products,
              customers: customers.data,
            };

            if (this.props.params.id) {
              this.props.dispatch(setActivePageTitle(`Edit misc purchase`));
              getPurchaseHistory(this.props.params.id)
                .then((payments) => {
                  getMiscPurchase(this.props.params.id)
                    .then((editedPurchase) => {
                      newState.locked = editedPurchase.locked ? true : false;
                      newState.loading = false;
                      newState.payments = payments.history;
                      newState.purchaseId = editedPurchase.purchaseId;
                      newState.internalNotes = editedPurchase.internalNotes
                        ? editedPurchase.internalNotes
                        : ``;
                      newState.detailId = editedPurchase.detailId;
                      newState.city = editedPurchase.purchaseCity;
                      newState.purchaseDate = editedPurchase.purchaseDate
                        ? new Date(editedPurchase.purchaseDate)
                        : new Date();
                      newState.purchasedProducts = editedPurchase.products;

                      newState.tourPurchase = false;
                      if (editedPurchase.tourPurchase) {
                        newState.tourPurchase = editedPurchase.tourPurchase;
                        newState.purchaseDateLocked = true;

                        let totalPrice = 0;
                        newState.purchasedProducts.map((item, index) => {
                          totalPrice = totalPrice + item.price * item.qty;
                        });

                        newState.customers.map((customer) => {
                          if (
                            customer.customerID === editedPurchase.customerId &&
                            customer.reservationConfirmEmail
                          ) {
                            newState.bookingPartnerEmail =
                              customer.reservationConfirmEmail;
                          }
                        });

                        newState.baseTourPrice = parseFloat(
                          newState.tourPurchase.totalGross,
                        );
                      }

                      this.setState(newState);
                    })
                    .catch(() => {
                      this.setState({
                        loading: false,
                        validationErrors: [
                          `Unable to get the purchase with identifier ${this.props.params.id}`,
                        ],
                      });
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
            } else {
              newState.loading = false;
              if (
                this.props.location.query &&
                this.props.location.query.purchaseId
              ) {
                newState.purchaseId = parseInt(
                  this.props.location.query.purchaseId,
                );
              }

              this.setState(newState);
            }
          })
          .catch((error) => {
            this.setState({
              loading: false,
              validationErrors: [`Unable to get available products`],
            });
          });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          validationErrors: [`Unable to get available booking partners`],
        });
      });
  }

  componentWillMount() {
    this.intializeForm();
  }

  handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      validationErrors: [],
    });
  }

  onFormSubmit() {
    this.setState({ loading: true });

    let total = 0;
    let productsData = [];
    this.state.purchasedProducts.map((item) => {
      let data = {
        detailId: item.detailID ? item.detailID.toString() : "0",
        productId: item.productId.toString(),
        price: item.price.toString(),
        qty: item.qty.toString(),
        subtotal: (parseFloat(item.price) * parseFloat(item.qty)).toString(),
      };

      productsData.push(data);
      total = total + parseFloat(data.subtotal);
    });

    let data = {
      purchaseDate: moment(this.state.purchaseDate).format(`YYYY-MM-DD`),
      internalNotes: this.state.internalNotes,
      city: this.state.city,
      products: productsData,
      total: total.toString(),
      sendConfirmationToBookingPartner:
        this.state.sendConfirmationToBookingPartner,
      bookingPartnerEmail: this.state.bookingPartnerEmail,
    };

    if (this.state.purchaseId > 0) {
      updateMiscPurchase(this.state.purchaseId, data)
        .then(() => {
          this.setState({ purchaseWasUpdated: true });
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [`Error occured while updating purchase`],
          });
        });
    } else {
      createMiscPurchase(data)
        .then((identifiers) => {
          let newState = {};
          newState.purchaseId = identifiers.purchaseId;
          newState.purchaseWasCreated = true;
          this.setState(newState);
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [`Error occured while creating purchase`],
          });
        });
    }
  }

  setValue(name, value) {
    let newState = { [name]: value };
    if (name === `addedProductId`) {
      value = parseInt(value);
      let addedProductPrice = 0;
      this.state.products.map((item) => {
        if (item.productID === value) {
          addedProductPrice = parseFloat(item.basePrice);
        }
      });

      newState = {
        addedProductId: value,
        addedProductPrice,
      };
    }

    this.setState(newState, () => {
      let addedProductTotal = this.state.addedProductTotal;
      if (this.state.addedProductId && this.state.addedProductQuantity) {
        addedProductTotal =
          this.state.addedProductPrice * this.state.addedProductQuantity;
      }

      this.setState({ addedProductTotal });
    });
  }

  resetForm() {
    this.setState(
      Object.assign({}, initialState, { purchasedProducts: [] }),
      () => {
        this.intializeForm();
      },
    );
  }

  deletePurchase() {
    if (confirm(`Delete purchase?`)) {
      this.setState({ loading: true });
      deleteMiscPurchase(
        this.props.params.id,
        this.state.sendConfirmationToBookingPartner &&
          this.state.bookingPartnerEmail
          ? this.state.bookingPartnerEmail
          : false,
      )
        .then(() => {
          if (this.state.tourPurchase) {
            this.props.router.push(
              `/purchases/edit-tour/${this.props.params.id}`,
            );
          } else {
            this.props.router.push(`/`);
          }
        })
        .catch(() => {
          this.setState({
            loading: false,
            validationErrors: [`Unable to delete purchase`],
          });
        });
    }
  }

  render() {
    const { classes } = this.props;

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
            Misc purchase was created (Bonza booking ID: {this.state.purchaseId}
            )
          </p>
        );
        let link = (
          <div>
            <p>
              <Link
                to={`/purchases/edit-misc/${this.state.purchaseId}`}
                className="no-underline"
              >
                <Button variant="contained" size="small" color="primary">
                  Edit purchase
                </Button>
              </Link>
            </p>
            <p>
              <Link
                to={`/purchases/${this.state.purchaseId}/payment`}
                className="no-underline"
              >
                <Button variant="contained" size="small">
                  Take payment
                </Button>
              </Link>
            </p>
            <p>
              <Button
                variant="contained"
                className="button-orange"
                onClick={this.resetForm.bind(this)}
              >
                Add another purchase
              </Button>
            </p>
            <p>
              <Link to="/" className="no-underline">
                <Button variant="contained" color="primary">
                  Back to home
                </Button>
              </Link>
            </p>
          </div>
        );

        if (this.state.purchaseWasUpdated) {
          text = (
            <p>
              Misc purchase was updated (Bonza booking ID:{" "}
              {this.state.purchaseId})
            </p>
          );
          link = (
            <div>
              <p>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    this.setState({
                      loading: false,
                      purchaseWasUpdated: false,
                    });
                  }}
                >
                  Back to editing purchase
                </Button>
              </p>
              <p>
                <Link
                  to={`/purchases/${this.state.purchaseId}/payment`}
                  className="no-underline"
                >
                  <Button variant="contained" className="button-green">
                    Take payment
                  </Button>
                </Link>
              </p>
              <p>
                <Link to="/" className="no-underline">
                  <Button variant="contained" color="primary">
                    Back to home
                  </Button>
                </Link>
              </p>
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
            position: `absolute`,
            width: `100%`,
            height: `100%`,
            backgroundColor: `rgba(255,255,255,0.6)`,
            zIndex: `100`,
          }}
        >
          {overlayContent}
        </div>
      );
    }

    let totalPrice = 0;
    let productsTable = false;
    if (this.state.purchasedProducts.length === 0) {
      productsTable = (
        <div style={{ textAlign: `center` }}>No products to display</div>
      );
    } else {
      let tableRows = [];
      this.state.purchasedProducts.map((item, index) => {
        totalPrice = totalPrice + item.price * item.qty;

        let productName = ``;
        this.state.products.map((product) => {
          if (product.productID === item.productId) {
            productName = product.name;
          }
        });

        tableRows.push(
          <TableRow key={`product_row_${index}`}>
            <TableCell component="th" scope="row">
              {productName}
            </TableCell>
            <TableCell style={{ textAlign: `center` }}>${item.price}</TableCell>
            <TableCell style={{ textAlign: `center` }}>{item.qty}</TableCell>
            <TableCell style={{ textAlign: `center` }}>
              ${item.price * item.qty}
            </TableCell>
            <TableCell style={{ textAlign: `right` }}>
              <Button
                disabled={this.state.locked}
                size="small"
                variant="contained"
                onClick={() => {
                  this.deletePurchasedProduct(index);
                }}
                style={{ marginLeft: `10px` }}
              >
                <DeleteIcon className={classes.leftIcon} /> Delete
              </Button>
            </TableCell>
          </TableRow>,
        );
      });

      tableRows.push(
        <TableRow key={`total_row`}>
          <TableCell colSpan="5" style={{ textAlign: `right` }}>
            Total: ${totalPrice}
          </TableCell>
        </TableRow>,
      );

      productsTable = (
        <Table>
          <TableBody>{tableRows}</TableBody>
        </Table>
      );
    }

    let addProductButtonIsDisabled = true;
    let addProductButtonText = ``;
    if (this.state.addedProductId && this.state.addedProductQuantity > 0) {
      addProductButtonIsDisabled = false;
      addProductButtonText = `(${`$` + this.state.addedProductTotal})`;
    }

    return (
      <div style={{ position: `relative` }}>
        {overlay}
        <div style={{ paddingBottom: `10px` }}>
          {this.state.locked ? (
            <div style={{ paddingBottom: `10px` }}>
              <LockedPurchaseNotification />
            </div>
          ) : (
            false
          )}

          <div className="row">
            <div
              className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
              style={noMargin}
            >
              <BonzaDatePickerField
                title="Purchase date"
                value={this.state.purchaseDate}
                name="purchaseDate"
                disabled={this.state.locked || this.state.purchaseDateLocked}
                onChange={this.setValue}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15">
              <BonzaSelectField
                title="Product"
                type="number"
                options={this.state.products.filter((item) => !item.archived)}
                optionsIdField="productID"
                optionsTitleField="name"
                value={this.state.addedProductId}
                name="addedProductId"
                disabled={this.state.locked}
                onChange={this.setValue}
              />
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15">
              <BonzaTextField
                title="Price ($)"
                type="number"
                value={this.state.addedProductPrice}
                name="addedProductPrice"
                disabled={this.state.locked}
                onChange={this.setValue}
              />
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15">
              <BonzaTextField
                title="Quantity"
                type="number"
                value={this.state.addedProductQuantity}
                name="addedProductQuantity"
                disabled={this.state.locked}
                onChange={this.setValue}
              />
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15">
              <Button
                disabled={this.state.locked}
                variant="contained"
                size="small"
                onClick={this.addProduct}
                color="primary"
                disabled={addProductButtonIsDisabled}
              >
                <AddIcon className={classes.leftIcon} /> Add{" "}
                {addProductButtonText}
              </Button>
              <Button
                disabled={this.state.locked}
                variant="contained"
                size="small"
                onClick={this.clearAddProductForm}
                style={{ marginLeft: `10px` }}
              >
                <ClearIcon className={classes.leftIcon} /> Clear
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
              <Card>
                <CardContent>{productsTable}</CardContent>
              </Card>
            </div>
          </div>
          <div className="row">
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
              style={noMargin}
            >
              <BonzaTextField
                title="Internal notes"
                value={this.state.internalNotes}
                multiline={true}
                fullWidth={true}
                rows={2}
                name="internalNotes"
                onChange={this.setValue}
              />
            </div>
          </div>
          {this.state.tourPurchase ? (
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                style={noMargin}
              >
                <p>
                  The miscellaneous purchase has additional tour purchase: $
                  {this.state.baseTourPrice.toFixed(2)}
                </p>
                <p>
                  Total purchase: {this.state.baseTourPrice.toFixed(2)} (tour) +{" "}
                  {totalPrice.toFixed(2)} (misc) ={" "}
                  <strong>
                    ${this.state.baseTourPrice + totalPrice} total
                  </strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
                style={noMargin}
              >
                <p>Standalone purchase</p>
              </div>
            </div>
          )}

          {this.state.tourPurchase ? (
            <div className="row">
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                style={noMargin}
              >
                <BonzaBooleanField
                  title="Send confirmation email to booking partner reservations staff"
                  value={this.state.sendConfirmationToBookingPartner}
                  name="sendConfirmationToBookingPartner"
                  onChange={this.setValue}
                />
              </div>
              {this.state.sendConfirmationToBookingPartner ? (
                <div
                  className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15"
                  style={noMargin}
                >
                  <BonzaTextField
                    title="Booking partner email address"
                    type="email"
                    fullWidth={true}
                    value={this.state.bookingPartnerEmail}
                    name="bookingPartnerEmail"
                    onChange={this.setValue}
                  />
                </div>
              ) : (
                false
              )}
            </div>
          ) : (
            false
          )}

          <div className="row" style={{ paddingTop: `10px` }}>
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15"
              style={noMargin}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={
                  this.state.purchasedProducts.length === 0 ||
                  (this.state.sendConfirmationToBookingPartner === 1 &&
                    !this.state.bookingPartnerEmail)
                }
                onClick={this.onFormSubmit}
              >
                {this.state.purchaseId > 0 ? (
                  <span>Update purchase</span>
                ) : (
                  <span>Add purchase</span>
                )}
              </Button>
              {this.state.purchaseId > 0 ? (
                <span>
                  <Button
                    color="secondary"
                    variant="contained"
                    disabled={this.state.payments.length > 0}
                    onClick={this.deletePurchase.bind(this)}
                    style={{ marginLeft: `10px` }}
                  >
                    Delete purchase
                  </Button>

                  {this.state.payments.length > 0 ? (
                    <Tooltip
                      title="All payments should be deleted beforehand"
                      placement="top"
                    >
                      <IconButton
                        variant="contained"
                        size="small"
                        color="primary"
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    false
                  )}
                </span>
              ) : (
                false
              )}
              {this.state.purchaseId > 0 ? (
                <Link
                  to={`/purchases/${this.state.purchaseId}/payment`}
                  className="no-underline"
                  style={{ paddingLeft: `10px` }}
                >
                  <Button variant="contained">Take payment</Button>
                </Link>
              ) : (
                false
              )}
              {this.state.purchaseId > 0 ? (
                <Link
                  to={`/purchases/${this.state.purchaseId}/history`}
                  className="no-underline"
                  style={{ paddingLeft: `10px` }}
                >
                  <Button variant="contained">Payment history</Button>
                </Link>
              ) : (
                false
              )}
              {this.state.tourPurchase ? (
                <Link
                  to={`/purchases/edit-tour/${this.state.purchaseId}`}
                  className="no-underline"
                  style={{ paddingLeft: `10px` }}
                >
                  <Button variant="contained">Edit tour purchase</Button>
                </Link>
              ) : (
                false
              )}
            </div>
          </div>
        </div>
        <BonzaNotification
          errors={this.state.validationErrors}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

MiscPurchasePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

/* eslint-disable */
function mapStateToProps() {
  return {};
}

export default withStyles(styles)(connect(mapStateToProps)(MiscPurchasePage));
