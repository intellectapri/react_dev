import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

class BonzaTextField extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let value = event.target.value;
    if (this.props.type === `number`) {
      value = parseFloat(value);
    }

    this.props.onChange(this.props.name, value);
  }

  render() {
    let value = this.props.value;
    if (this.props.type === `number` && isNaN(value)) value = 0;

    let fieldContainerStyle = { paddingRight: `10px` };
    if (this.props.fullWidth) {
      fieldContainerStyle.width = `100%`;
    }

    let inputProps = {};
    if (this.props.prefix) {
      inputProps = {
        startAdornment: (
          <InputAdornment position="start">{this.props.prefix}</InputAdornment>
        ),
      };
    }

    if (this.props.step) {
      inputProps.step = this.props.step;
    }
    let {
      type,
      fullWidth,
      multiline,
      disabled,
      rows,
      onKeyPress,
      placeholder,
    } = this.props;

    return (
      <FormControl
        component="fieldset"
        margin="dense"
        fullWidth={this.props.fullWidth ? true : false}
      >
        <div style={{ display: `flex` }}>
          {this.props.title ? (
            <div style={{ paddingRight: `10px`, paddingTop: `4px` }}>
              <FormLabel style={{ whiteSpace: `nowrap` }}>
                {this.props.title}{" "}
                {this.props.required ? (
                  <span style={{ color: `red` }}>*</span>
                ) : (
                  false
                )}
              </FormLabel>
            </div>
          ) : (
            false
          )}
          <div style={fieldContainerStyle}>
            <TextField
              type={type ? type : `text`}
              fullWidth={fullWidth ? true : false}
              multiline={multiline ? true : false}
              disabled={disabled ? true : false}
              rows={rows ? rows : 1}
              onKeyPress={onKeyPress ? onKeyPress : () => {}}
              value={value.toString()}
              InputProps={inputProps}
              placeholder={placeholder}
              onChange={this.onChange}
            />
          </div>
        </div>
      </FormControl>
    );
  }
}

BonzaTextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
};

export default BonzaTextField;
