import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";

import { getProductTypes } from "../middleware/api/products";

const excludedProductTypes = [`DRINKS`, `MERCH`];

class BonzaTourTypeSelect extends React.Component {
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
    let options = [];
    this.state.productTypes.map((productType) => {
      if (excludedProductTypes.indexOf(productType.typeCode) === -1) {
        options.push(
          <option disabled key={`optgroup_${productType.typeCode}`}>
            {productType.name}
          </option>,
        );
        this.props.products.map((item, index) => {
          if (item.typeCode === productType.typeCode && !item.archived) {
            options.push(
              <option
                key={`${this.props.name}_key_1${index}`}
                value={item.productID}
              >
                {item.name}
              </option>,
            );
          }
        });
      }
    });

    if (this.props.value === false) {
      options.unshift(
        <option
          value={this.props.value}
          disabled
          key={`${this.props.name}_empty_option`}
        >
          Select tour type
        </option>,
      );
    }

    return (
      <FormControl component="fieldset" margin="dense">
        <div style={{ display: `flex` }}>
          <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
            <FormLabel>
              {this.props.title}{" "}
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

BonzaTourTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { productReducer } = state;
  const { products } = productReducer;
  return { products };
}

export default connect(mapStateToProps)(BonzaTourTypeSelect);
