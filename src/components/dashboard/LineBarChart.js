import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import GlobalStyles from "../../styles";

// const {PropTypes} = React;
// const {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;
// const data = [{name: "Page A", uv: 590, pv: 800, amt: 1400},
//               {name: "Page B", uv: 868, pv: 967, amt: 1506},
//               {name: "Page C", uv: 1397, pv: 1098, amt: 989},
//               {name: "Page D", uv: 1480, pv: 1200, amt: 1228},
//               {name: "Page E", uv: 1520, pv: 1108, amt: 1100},
//               {name: "Page F", uv: 1400, pv: 680, amt: 1700}];

// const LineBarAreaComposedChart = React.createClass({
// render () {
const LineBarChart = (props) => {
  const styles = {
    paper: {
      minHeight: 344,
      padding: 10,
    },
    legend: {
      paddingTop: 20,
    },
    pieChartDiv: {
      height: 290,
      textAlign: "center",
    },
  };

  return (
    <Paper style={styles.paper}>
      <span style={GlobalStyles.title}>Website Analysis</span>

      <div style={GlobalStyles.clear} />

      <div className="row">
        <div className="col-xs-12">
          <div style={styles.pieChartDiv}></div>
        </div>
      </div>
    </Paper>
  );
};

LineBarChart.propTypes = {
  data: PropTypes.array,
};

export default LineBarChart;
