import React from "react";
import { createField, fieldPresets } from "react-advanced-form";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

class AdvancedInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;

    const { fieldProps, fieldState } = props;
    const { touched, errors } = fieldState;

    let fullWidth = props.fullWidth ? true : null;
    return (
      <FormControl fullWidth={fullWidth}>
        <InputLabel>{fieldState.label}</InputLabel>
        <Input {...fieldProps} />
        {touched &&
          errors &&
          errors.map((error, index) => (
            <FormHelperText error={true} key={`error_` + index}>
              {error}
            </FormHelperText>
          ))}
      </FormControl>
    );
  }
}

export default createField(fieldPresets.input)(AdvancedInput);
