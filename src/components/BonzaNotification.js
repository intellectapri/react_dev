import React from "react";
import PropTypes from "prop-types";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function BonzaNotification(props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={props.errors.length > 0}
      autoHideDuration={6000}
      onClose={(event, reason) => {
        if (reason === "clickaway") return;
        props.onClose();
      }}
      ContentProps={{ "aria-describedby": "message-id" }}
      message={
        <div>
          {props.errors.map((item, index) => (
            <p key={`error_message_${index}`}>{item}</p>
          ))}
        </div>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={(event, reason) => {
            if (reason === "clickaway") return;
            props.onClose();
          }}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}

BonzaNotification.propTypes = {
  onClose: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
};

export default BonzaNotification;
