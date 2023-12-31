import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import { white, purple600, purple500 } from "material-ui/styles/colors";
import { typography } from "material-ui/styles";

const NewOrders = (props) => {
  const styles = {
    paper: {
      backgroundColor: purple500,
      height: 150,
    },
    div: {
      height: 95,
      padding: "5px 15px 0 15px",
    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: white,
      backgroundColor: purple600,
      padding: 10,
    },
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...styles.header }}>New Orders</div>
      <div style={styles.div}></div>
    </Paper>
  );
};

NewOrders.propTypes = {
  data: PropTypes.array,
};

export default NewOrders;
