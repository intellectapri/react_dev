import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import Menu from "material-ui/svg-icons/navigation/menu";
import { white } from "material-ui/styles/colors";

class Header extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { activePageTitle, styles, handleChangeRequestNavDrawer } =
      this.props;

    const style = {
      appBar: {
        position: "fixed",
        top: 0,
        overflow: "hidden",
        maxHeight: 57,
      },
      menuButton: {
        marginLeft: 10,
      },
      iconsLeftContainer: {
        marginLeft: 20,
        marginRight: 10,
      },
    };

    return (
      <div>
        <AppBar
          style={{ ...styles, ...style.appBar }}
          title={activePageTitle}
          iconElementLeft={
            <div style={style.iconsLeftContainer}>
              <IconButton
                style={style.menuButton}
                onClick={handleChangeRequestNavDrawer}
              >
                <Menu color={white} />
              </IconButton>
            </div>
          }
          iconElementRight={<div></div>}
        />
      </div>
    );
  }
}

Header.propTypes = {
  activePageTitle: PropTypes.string.isRequired,
  styles: PropTypes.object,
  handleChangeRequestNavDrawer: PropTypes.func,
};

function mapStateToProps(state) {
  const { settingsReducer } = state;
  const { activePageTitle } = settingsReducer;
  return { activePageTitle };
}

export default connect(mapStateToProps)(Header);
