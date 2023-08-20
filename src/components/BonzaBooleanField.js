import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";

class BonzaBooleanField extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.checked) {
      this.props.onChange(this.props.name, 1);
    } else {
      this.props.onChange(this.props.name, 0);
    }
  }

  render() {
    return (
      <FormControl component="fieldset" margin="dense">
        <div style={{ display: `flex` }}>
          <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
            <FormLabel>{this.props.title}</FormLabel>
          </div>
          <div style={{ paddingRight: `10px` }}>
            <Checkbox
              disabled={this.props.disabled ? true : false}
              checked={parseInt(this.props.value) === 1}
              onChange={this.handleChange}
              value="1"
              color="primary"
              style={{ paddingTop: `4px` }}
            />
          </div>
        </div>
      </FormControl>
    );
  }
}

BonzaBooleanField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BonzaBooleanField;
