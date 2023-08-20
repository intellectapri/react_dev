import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import { white, pink600, pink500 } from "material-ui/styles/colors";
import GlobalStyles from "../../styles";

const MonthlySales = (props) => {
  const styles = {
    paper: {
      backgroundColor: pink600,
      height: 150,
    },
    div: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "95%",
      height: 85,
    },
    header: {
      color: white,
      backgroundColor: pink500,
      padding: 10,
    },
  };

  return (
    <Paper style={styles.paper}>
      <div style={{ ...GlobalStyles.title, ...styles.header }}>
        Monthly Sales
      </div>
      <div style={styles.div}></div>
    </Paper>
  );
};

MonthlySales.propTypes = {
  data: PropTypes.array,
};

export default MonthlySales;
