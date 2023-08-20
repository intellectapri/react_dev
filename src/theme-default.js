import getMuiTheme from "material-ui/styles/getMuiTheme";
import { blue600, white900, green600 } from "material-ui/styles/colors";

const themeDefault = getMuiTheme({
  palette: {
    secondary: `#e0e0e0`,
    error: green600,
  },
  appBar: {
    height: 57,
    color: blue600,
  },
  drawer: {
    width: 300,
    color: white900,
  },
  raisedButton: {
    primaryColor: blue600,
  },
});

export default themeDefault;
