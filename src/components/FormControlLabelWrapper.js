import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

class FormControlLabelWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;

    const { radioButton, ...labelProps } = props;
    return (
      <FormControlLabel
        control={<Radio />}
        label={props.label}
        {...labelProps}
      />
    );
  }
}

export default FormControlLabelWrapper;
