import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import LoadingOverlay from "../components/LoadingOverlay";
import BonzaBooleanField from "../components/BonzaBooleanField";
import config from "../config";

import { requestProducts } from "./../actions/product";
import {
  updateProductsOrder,
  getProductTypes,
  getProducts,
  deleteProduct,
  restoreProduct,
} from "../middleware/api/products";

class ProductsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errors: [],
      products: [],
      productTypes: [],
      showArchived: false,
      orderWasChanged: false,
    };

    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSortHandler = this.onSortHandler.bind(this);
    this.saveOrder = this.saveOrder.bind(this);

    props.dispatch(setActivePageTitle(`Products`));
  }

  onArchiveHandler(productId, productName) {
    if (confirm(`Archive ${productName}?`)) {
      this.setState({ loading: true });
      deleteProduct(productId)
        .then(() => {
          this.loadProductsAndTypes();
          this.props.dispatch(requestProducts());
        })
        .catch(() => {
          this.setState({
            loading: false,
            errors: [`Error occured while archiving ${productName}`],
          });
        });
    }
  }

  onRestoreHandler(productId, productName) {
    if (confirm(`Restore ${productName}?`)) {
      this.setState({ loading: true });
      restoreProduct(productId)
        .then(() => {
          this.loadProductsAndTypes();
          this.props.dispatch(requestProducts());
        })
        .catch(() => {
          this.setState({
            loading: false,
            errors: [`Error occured while archiving ${productName}`],
          });
        });
    }
  }

  sortProducts(productTypes, products) {
    let sortedProducts = [];
    productTypes.map((typeItem) => {
      let categoryProducts = [];
      products.map((product) => {
        if (product.typeCode === typeItem.typeCode) {
          categoryProducts.push(product);
        }
      });

      categoryProducts.sort((a, b) => {
        let aOrder =
          a.displayOrder || a.displayOrder === 0
            ? parseInt(a.displayOrder)
            : 1000;
        if (a.archived) aOrder = 1000;

        let bOrder =
          b.displayOrder || b.displayOrder === 0
            ? parseInt(b.displayOrder)
            : 1000;
        if (b.archived) bOrder = 1000;

        return aOrder > bOrder ? 1 : -1;
      });

      categoryProducts.map((item, index) => {
        categoryProducts[index].displayOrder = index;
        sortedProducts.push(categoryProducts[index]);
      });
    });

    return sortedProducts;
  }

  loadProductsAndTypes() {
    this.setState({ loading: true });
    getProductTypes()
      .then((productTypes) => {
        getProducts()
          .then((products) => {
            this.setState({
              loading: false,
              products: this.sortProducts(productTypes, products),
              productTypes,
            });
          })
          .catch((error) => {
            console.error(error);
            this.setState({
              loading: false,
              errors: [`Unable to load products`],
            });
          });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          loading: false,
          errors: [`Unable to load product types`],
        });
      });
  }

  componentWillMount() {
    this.loadProductsAndTypes();
  }

  onSortHandler(item, swappedProduct) {
    let productsCopy = JSON.parse(JSON.stringify(this.state.products));

    productsCopy.map((product, index) => {
      if (product.productID === item.productID) {
        productsCopy[index].displayOrder = swappedProduct.displayOrder;
      }

      if (product.productID === swappedProduct.productID) {
        productsCopy[index].displayOrder = item.displayOrder;
      }
    });

    this.setState({
      orderWasChanged: true,
      products: this.sortProducts(this.state.productTypes, productsCopy),
    });
  }

  saveOrder() {
    let order = [];
    let productsCopy = JSON.parse(JSON.stringify(this.state.products));
    productsCopy.map((product, index) => {
      if (!product.archived) {
        order.push({
          productID: product.productID,
          displayOrder: product.displayOrder,
        });
      }
    });

    this.setState({ loading: true });
    updateProductsOrder(order)
      .then(() => {
        this.setState({
          loading: false,
          orderWasChanged: false,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          loading: false,
          errors: [`Unable to save sorting order`],
        });
      });
  }

  render() {
    const sortedTypes = [`TOURS`, `PACKAGES`, `HIRES`];

    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let rows = [];
    this.state.productTypes.map((typeItem) => {
      let categoryProducts = [];
      this.state.products.map((productItem) => {
        if (typeItem.typeCode === productItem.typeCode) {
          categoryProducts.push(productItem);
        }
      });

      rows.push(
        <TableRow key={`product_type_header_row_${typeItem.typeID}`}>
          <TableCell colSpan={3}>
            <Typography variant="h6" gutterBottom>
              {typeItem.name}{" "}
              {typeItem.description && typeItem.description !== typeItem.name
                ? `(${typeItem.description})`
                : ``}
            </Typography>
          </TableCell>
        </TableRow>,
      );

      categoryProducts.sort((a, b) => {
        let aOrder =
          a.displayOrder || a.displayOrder === 0
            ? parseInt(a.displayOrder)
            : 1000;
        let bOrder =
          b.displayOrder || b.displayOrder === 0
            ? parseInt(b.displayOrder)
            : 1000;
        return aOrder > bOrder ? 1 : -1;
      });

      const createRow = (
        productItem,
        nextItem = false,
        previousItem = false,
      ) => {
        let priceSeasonsLink = false;
        if (productItem.typeCode === `TOURS`) {
          priceSeasonsLink = (
            <Link
              to={`/products/${productItem.productID}/seasons`}
              className="no-underline"
            >
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: `10px ` }}
              >
                Price seasons
              </Button>
            </Link>
          );
        }

        return (
          <TableRow key={`product_item_${productItem.productID}`}>
            <TableCell>
              {productItem.name}{" "}
              {productItem.archived
                ? `(archived ${moment(productItem.archived).format(
                    config.momentDateTimeFormat,
                  )})`
                : ``}
            </TableCell>
            <TableCell>${productItem.basePrice}</TableCell>
            <TableCell align="right">
              {sortedTypes.indexOf(productItem.typeCode) > -1 &&
              !productItem.archived ? (
                <IconButton
                  variant="contained"
                  disabled={nextItem === false}
                  onClick={() => {
                    this.onSortHandler(productItem, nextItem);
                  }}
                  size="small"
                >
                  <ArrowDropDownIcon title="Move product down" />
                </IconButton>
              ) : (
                false
              )}

              {sortedTypes.indexOf(productItem.typeCode) > -1 &&
              !productItem.archived ? (
                <IconButton
                  variant="contained"
                  disabled={previousItem === false}
                  onClick={() => {
                    this.onSortHandler(productItem, previousItem);
                  }}
                  size="small"
                >
                  <ArrowDropUpIcon title="Move product up" />
                </IconButton>
              ) : (
                false
              )}

              <Link
                to={`/products/edit/${productItem.productID}`}
                className="no-underline"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginLeft: `10px ` }}
                >
                  Edit
                </Button>
              </Link>
              {priceSeasonsLink}
              {productItem.typeCode === `TOURS` ||
              productItem.typeCode === `PACKAGES` ||
              productItem.typeCode === `HIRES` ? (
                <Link
                  to={`/products/${productItem.productID}/allotments`}
                  className="no-underline"
                >
                  <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: `10px ` }}
                  >
                    Allotments
                  </Button>
                </Link>
              ) : (
                false
              )}
              {productItem.archived ? (
                <Button
                  variant="contained"
                  className="button-green"
                  color="secondary"
                  onClick={() => {
                    this.onRestoreHandler(
                      productItem.productID,
                      productItem.name,
                    );
                  }}
                  size="small"
                  style={{ marginLeft: `10px ` }}
                >
                  Restore
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    this.onArchiveHandler(
                      productItem.productID,
                      productItem.name,
                    );
                  }}
                  size="small"
                  style={{ marginLeft: `10px ` }}
                >
                  Archive
                </Button>
              )}
            </TableCell>
          </TableRow>
        );
      };

      let archivedProducts = [];
      let notArchivedProducts = [];
      categoryProducts.map((productItem) => {
        if (productItem.archived) {
          archivedProducts.push(productItem);
        } else {
          notArchivedProducts.push(productItem);
        }
      });

      notArchivedProducts.map((product, index) => {
        rows.push(
          createRow(
            product,
            index === notArchivedProducts.length - 1
              ? false
              : notArchivedProducts[index + 1],
            index === 0 ? false : notArchivedProducts[index - 1],
          ),
        );
      });

      if (this.state.showArchived) {
        archivedProducts.map((product, index) => {
          rows.push(createRow(product));
        });
      }
    });

    return (
      <div>
        {loadingOverlay}
        <div style={{ textAlign: `right` }}>
          <div style={{ float: `right` }}>
            <Link to={`/products/add`} className="no-underline">
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: `10px ` }}
              >
                Add product
              </Button>
            </Link>

            <Button
              variant="contained"
              disabled={this.state.orderWasChanged === false}
              style={{ marginLeft: `10px ` }}
              onClick={this.saveOrder}
            >
              Save order
            </Button>
          </div>
          <div style={{ float: `right` }}>
            <BonzaBooleanField
              title="Show archived products"
              value={this.state.showArchived}
              name="showArchived"
              onChange={(name, showArchived) => {
                this.setState({ showArchived });
              }}
            />
          </div>
        </div>
        <Table>
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
    );
  }
}

ProductsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ProductsPage);
