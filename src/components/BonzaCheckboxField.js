import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class BonzaCheckboxField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let checkboxes = [];
    this.props.options.map((item, index) => {
      let checked = false,
        value = false,
        label = false;
      if (typeof item === `string`) {
        value = item;
        label = item;
        if (Array.isArray(this.props.value)) {
          checked = this.props.value.indexOf(value) > -1;
        } else {
          checked = this.props.value === value;
        }
      } else {
        value = item[this.props.optionsIdField];
        label = item[this.props.optionsTitleField];
        if (Array.isArray(this.props.value)) {
          checked = this.props.value.indexOf(value) > -1;
        } else {
          checked = this.props.value === value;
        }
      }

      checkboxes.push(
        <FormControlLabel
          key={`checkbox_label_${index}`}
          control={
            <Checkbox
              disabled={this.props.disabled ? true : false}
              checked={checked}
              value={value}
              onChange={(event) => {
                if (Array.isArray(this.props.value)) {
                  let values = this.props.value.slice(0);
                  if (event.target.checked) {
                    if (values.indexOf(event.target.value) === -1)
                      values.push(event.target.value);
                  } else {
                    console.log(`0`, values);
                    values.splice(values.indexOf(event.target.value), 1);
                    console.log(`1`, values);
                  }

                  this.props.onChange(this.props.name, values);
                } else {
                  if (event.target.checked) {
                    this.props.onChange(this.props.name, event.target.value);
                  } else {
                    this.props.onChange(this.props.name, false);
                  }
                }
              }}
            />
          }
          label={label}
        />,
      );
    });

    return (
      <FormControl component="fieldset" margin="dense">
        <div style={{ display: `flex` }}>
          <div style={{ paddingRight: `10px`, paddingTop: `14px` }}>
            <FormLabel required={this.props.required ? true : false}>
              {this.props.title}
            </FormLabel>
          </div>
          <div style={{ paddingRight: `10px` }}>{checkboxes}</div>
        </div>
      </FormControl>
    );
  }
}

BonzaCheckboxField.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  optionsIdField: PropTypes.string,
  optionsTitleField: PropTypes.string,
};

export default BonzaCheckboxField;
