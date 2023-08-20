import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";

import { getProductTypes } from "../middleware/api/products";
import config from "../config";

class BonzaPaymentMethodSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productTypes: [],
    };
  }

  componentWillMount() {
    getProductTypes().then((productTypes) => {
      this.setState({ productTypes });
    });
  }

  render() {
    let valueWasSelected = false;
    const checkIfWasSelected = (method) => {
      if (
        this.props.value &&
        (method === this.props.value ||
          method.toLowerCase() === this.props.value ||
          method.toLowerCase() === this.props.value.toLowerCase())
      )
        valueWasSelected = true;
    };

    let usedPaymentTypes = [];
    let options = [];
    config.paymentMethods.map((method, index) => {
      if (method.indexOf(`In store`) === 0) {
        checkIfWasSelected(method);
        options.push(
          <option
            key={`${this.props.name}_payment_method_${usedPaymentTypes.length}`}
            value={method}
          >
            {method}
          </option>,
        );
        usedPaymentTypes.push(index);
      }
    });

    config.paymentMethods.map((method, index) => {
      if (method.toLowerCase() === `invoice`) {
        checkIfWasSelected(method);
        options.push(
          <option
            key={`${this.props.name}_payment_method_${usedPaymentTypes.length}`}
            value={method}
          >
            Invoice
          </option>,
        );
        usedPaymentTypes.push(index);
      }
    });

    config.paymentMethods.map((method, index) => {
      if (method.indexOf(`Website`) === 0) {
        checkIfWasSelected(method);
        options.push(
          <option
            key={`${this.props.name}_payment_method_${usedPaymentTypes.length}`}
            value={method}
          >
            {method}
          </option>,
        );
        usedPaymentTypes.push(index);
      }
    });

    options.push(
      <option
        disabled
        key={`optgroup_legacy_${usedPaymentTypes.length}`}
        style={{ fontWeight: `bold` }}
      >
        Deprecated payment types
      </option>,
    );
    config.paymentMethods.map((method, index) => {
      if (usedPaymentTypes.indexOf(index) === -1) {
        checkIfWasSelected(method);
        options.push(
          <option
            key={`${this.props.name}_payment_method_${index}`}
            value={method}
          >
            - {method.charAt(0).toUpperCase() + method.slice(1)}
          </option>,
        );
      }
    });

    if (valueWasSelected === false) {
      options.unshift(
        <option
          value={this.props.value}
          disabled
          key={`${this.props.name}_empty_option`}
        >
          Select payment type
        </option>,
      );
    }

    return (
      <FormControl component="fieldset" margin="dense">
        <div style={{ display: `flex` }}>
          <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
            <FormLabel>
              {this.props.title ? this.props.title : `Payment method`}{" "}
              {this.props.required ? (
                <span style={{ color: `red` }}>*</span>
              ) : (
                false
              )}
            </FormLabel>
          </div>
          <div style={{ paddingRight: `10px` }}>
            <Select
              native
              disabled={this.props.disabled ? true : false}
              value={this.props.value}
              onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              onChange={(event) => {
                this.props.onChange(this.props.name, event.target.value);
              }}
            >
              {options}
            </Select>
          </div>
        </div>
      </FormControl>
    );
  }
}

BonzaPaymentMethodSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
};

function mapStateToProps(state) {
  const { productReducer } = state;
  const { products } = productReducer;
  return { products };
}

export default connect(mapStateToProps)(BonzaPaymentMethodSelect);
