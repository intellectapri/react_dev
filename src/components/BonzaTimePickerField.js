import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TimeInput from "material-ui-time-picker";

class BonzaTimePickerField extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.clearValue = this.clearValue.bind(this);
  }

  onChange(value) {
    this.props.onChange(this.props.name, value);
  }

  clearValue() {
    this.props.onChange(this.props.name, null);
  }

  render() {
    let fieldContainerStyle = { paddingRight: `10px` };
    if (this.props.fullWidth) {
      fieldContainerStyle.width = `100%`;
    }

    return (
      <FormControl
        component="fieldset"
        margin="dense"
        fullWidth={this.props.fullWidth ? true : false}
      >
        <div style={{ display: `flex` }}>
          <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
            <FormLabel style={{ whiteSpace: `nowrap` }}>
              {this.props.title}
            </FormLabel>
          </div>
          <div style={fieldContainerStyle}>
            <TimeInput
              mode="12h"
              value={this.props.value}
              onChange={this.onChange}
            />
            <Button
              size="small"
              color="primary"
              style={{ marginLeft: `10px` }}
              onClick={this.clearValue}
            >
              Clear
            </Button>
          </div>
        </div>
      </FormControl>
    );
  }
}

BonzaTimePickerField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BonzaTimePickerField;
