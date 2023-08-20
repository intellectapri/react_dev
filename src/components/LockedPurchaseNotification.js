import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

class LockedPurchaseNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Paper
          elevation={1}
          style={{ padding: `16px 20px 16px 20px`, backgroundColor: `#fff3cd` }}
        >
          <Typography variant="subtitle1" style={{ color: `#856404` }}>
            Purchase is locked, some properties are not editable (at least one
            payment for this purchase was added to the accoutning software)
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default LockedPurchaseNotification;
