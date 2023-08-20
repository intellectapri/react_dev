import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import LoadingOverlay from "../components/LoadingOverlay";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaTextField from "../components/BonzaTextField";
import config from "../config";
import { getDiscounts, deleteDiscount } from "../middleware/api/discounts";
import { Snackbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

class DiscountsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      discounts: [],
      vouchers: [],
      activeTab: "all",
      searchText: "",
      discountDeleted: false,
    };
    props.dispatch(setActivePageTitle(`Discounts`));
  }
  componentDidMount() {
    this.setState({ loading: true });

    getDiscounts()
      .then((data) => {
        this.setState(
          (state) => ({
            ...state,
            discounts: data,
          }),
          () =>
            this.setState((newState) => {
              return {
                ...newState,
                loading: false,
              };
            }),
        );
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            loading: false,
          };
        });
      });
  }

  getAll = () => {
    this.setState({ loading: true });
    getDiscounts()
      .then((data) => {
        this.setState(
          (state) => ({
            ...state,
            discounts: data,
          }),
          () =>
            this.setState((newState) => {
              return {
                ...newState,
                loading: false,
              };
            }),
        );
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            validationErrors: [" Could not get discounts"],
          };
        });
      });
  };
  getActive = () => {
    this.setState({ loading: true });

    getDiscounts({ active: 1 })
      .then((resp) => {
        this.setState(
          (state) => ({
            ...state,
            discounts: resp,
            loading: false,
            activeTab: "active",
          }),
          () =>
            this.setState((newState) => {
              return {
                ...newState,
                loading: false,
                activeTab: "active",
              };
            }),
        );
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            validationErrors: [" Could not get discounts"],
            loading: true,
          };
        });
      });
  };
  getInactive = () => {
    this.setState({ loading: true });
    getDiscounts({ active: 0 })
      .then((data) => {
        this.setState(
          (state) => ({
            ...state,
            discounts: data,
          }),
          () =>
            this.setState((newState) => {
              return {
                ...newState,
                loading: false,
                activeTab: "inactive",
              };
            }),
        );
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            validationErrors: [" Could not get active discounts"],
            loading: false,
          };
        });
      });
  };
  setActiveTab(tab) {
    return this.state.activeTab == tab
      ? { border: "solid 1px cornflowerblue" }
      : {};
  }
  searchAll = (name, value) => {
    this.setState((state) => {
      return {
        ...state,
        [name]: value,
        loading: true,
      };
    });

    getDiscounts({ discountCode: value })
      .then((responses) => {
        this.setState((state) => {
          return {
            ...state,
            loading: false,
            discounts: responses,
          };
        });
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            loading: false,
            validationErrors: JSON.stringify(err),
          };
        });
      });
  };
  searchDiscounts(term) {
    return Promise.resolve(true);
  }
  onDeleteDiscount(discountId, e) {
    e.preventDefault();
    this.setState({ loading: true });
    const discounts = this.state.discounts.filter((discount) => {
      return discount.discountID !== discountId;
    });
    deleteDiscount(discountId)
      .then((response) => {
        this.setState((state) => {
          return {
            ...state,
            discountDeleted: true,
            loading: false,
            discounts,
          };
        });
      })
      .catch((err) => {
        this.setState((state) => {
          return {
            ...state,
            validationErrors: ` Couldn't delete discount: ${JSON.stringify(
              err,
            )}`,
          };
        });
      });
  }
  handleClose(msg, e) {
    this.setState((state) => {
      return { ...state, discountDeleted: false };
    });
  }
  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    const rows = !!this.state.discounts ? (
      this.state.discounts.map((discount) => {
        const symbol = discount.discountType === "ABSOLUTE" ? "$" : "%";
        return (
          <TableRow key={discount.discountID}>
            <TableCell>{discount.discountID} </TableCell>
            <TableCell>{discount.discountCode}</TableCell>
            <TableCell>
              {discount.discountAmount} {symbol}{" "}
            </TableCell>
            <TableCell>{discount.discountType}</TableCell>
            <TableCell>{moment(discount.expireDate).format("ll")}</TableCell>
            <TableCell>{discount.active ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <Link
                to={`/discounts/edit/${discount.discountID}`}
                className="no-underline"
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: `10px ` }}
                >
                  Edit
                </Button>
              </Link>
              <Link
                to={`/discounts/${discount.discountID}`}
                className="no-underline delete-discount"
                data-discountid={discount.discountID}
                onClick={this.onDeleteDiscount.bind(this, discount.discountID)}
              >
                <Button
                  variant="contained"
                  color="default"
                  style={{ marginLeft: `10px ` }}
                >
                  {" "}
                  Delete
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        );
      })
    ) : (
      <TableRow>
        {" "}
        <TableCell>No discounts have been created yet</TableCell>
      </TableRow>
    );
    const noMargin = { margin: "0px" };
    return (
      <div>
        {loadingOverlay}
        <div style={{ float: `right` }}>
          <Link to={`/discounts/add`} className="no-underline">
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: `10px ` }}
            >
              Create Discount
            </Button>
          </Link>
        </div>
        <div
          className="row"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <div className="col-md-6">
            <BonzaTextField
              name="searchText"
              value={this.state.searchText}
              title="Search"
              fullWidth={true}
              placeholder="Search discounts"
              onChange={this.searchAll}
            />
          </div>
        </div>
        <div
          className="row"
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
            style={noMargin}
          >
            <Button onClick={this.getAll} style={this.setActiveTab("all")}>
              All
            </Button>
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
            style={noMargin}
          >
            <Button
              onClick={this.getActive}
              style={this.setActiveTab("active")}
            >
              Active
            </Button>
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 m-b-15"
            style={noMargin}
          >
            <Button
              onClick={this.getInactive}
              style={this.setActiveTab("inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>
        <div
          className="row"
          style={{
            marginTop: "2rem",
            marginBottom: "2rem",
            paddingLeft: "2rem",
          }}
        >
          <h3> Discounts </h3>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Discount ID
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Code
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Amount{" "}
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Type{" "}
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Expire Date{" "}
              </TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#666" }}>
                {" "}
                Status{" "}
              </TableCell>
            </TableRow>
            {rows}
          </TableBody>
        </Table>

        {/* <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bold', color: '#666'}}> Code</TableCell>
                            <TableCell style={{fontWeight: 'bold', color: '#666'}}> Amount </TableCell>
                            <TableCell style={{fontWeight: 'bold', color: '#666'}}> Type </TableCell>
                            <TableCell style={{fontWeight: 'bold', color: '#666'}}> Expire Date </TableCell>
                            <TableCell style={{fontWeight: 'bold', color: '#666'}}> Status </TableCell>
                        </TableRow>
                        
                        
                    </TableBody>
                </Table> */}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.discountDeleted}
          autoHideDuration={6000}
          onClose={this.handleClose.bind(this, "success")}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<div> Discount Deleted!</div>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose.bind(this, "success")}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

//export default DiscountsPage;
export default connect()(DiscountsPage);
