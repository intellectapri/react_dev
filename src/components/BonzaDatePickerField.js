import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import DatePicker from "./BonzaDatePicker/entry";

class BonzaDatePickerField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
            <DatePicker
              locale="en-AU"
              disabled={this.props.disabled ? true : false}
              onChange={(value) => {
                this.props.onChange(this.props.name, value);
              }}
              value={this.props.value}
              minDate={this.props.minDate ? this.props.minDate : null}
              maxDate={this.props.maxDate ? this.props.maxDate : null}
              allotments={this.props.allotments}
            />
          </div>
        </div>
      </FormControl>
    );
  }
}

BonzaDatePickerField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  allotments: PropTypes.any,
};

export default BonzaDatePickerField;
