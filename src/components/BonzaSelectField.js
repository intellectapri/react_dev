import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";

class BonzaSelectField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let options = [];
    let valueWasSelected = false;
    this.props.options.map((item, index) => {
      if (typeof item === `string`) {
        if (this.props.value && item.toString() === this.props.value.toString())
          valueWasSelected = true;

        let titleRaw = item;
        if (this.props.capitalize)
          titleRaw = item.charAt(0).toUpperCase() + item.slice(1);

        options.push(
          <option
            key={`${this.props.name}_key_${index}`}
            value={item.toString()}
          >
            {titleRaw}
          </option>,
        );
      } else {
        if (
          this.props.value &&
          item[this.props.optionsIdField].toString() ===
            this.props.value.toString()
        )
          valueWasSelected = true;
        let title =
          typeof this.props.optionsTitleField === `function`
            ? this.props.optionsTitleField(item)
            : item[this.props.optionsTitleField];
        if (title.length > 30) title = title.substring(0, 30) + `...`;

        let titleRaw = title;
        if (this.props.capitalize)
          titleRaw = title.charAt(0).toUpperCase() + title.slice(1);

        options.push(
          <option
            key={`${this.props.name}_key_${index}`}
            value={item[this.props.optionsIdField].toString()}
          >
            {titleRaw}
          </option>,
        );
      }
    });

    if (valueWasSelected === false) {
      options.unshift(
        <option value="false" disabled key={`${this.props.name}_empty_option`}>
          Select..
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
              displayEmpty={true}
              value={this.props.value ? this.props.value.toString() : false}
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

BonzaSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BonzaSelectField;
