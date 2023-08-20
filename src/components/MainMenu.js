import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";

import Drawer from "@material-ui/core/Drawer";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import EmailIcon from "@material-ui/icons/Email";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import SettingsIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import config from "../config";

class LeftDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;

    let { navDrawerOpen } = props;

    function handleClick(event) {
      event.preventDefault();
      props.onLogoutClick();
    }

    let links = [
      {
        subheader: `Purchases`,
        groupAccess: [`ADMIN`, `MANAGER`],
        icon: <ShoppingCartIcon />,
        items: [
          {
            text: `Search`,
            to: `/purchases/search`,
          },
          {
            text: `Add tour purchase`,
            to: `/purchases/add-tour`,
          },
          {
            text: `Add misc purchase`,
            to: `/purchases/add-misc`,
          },
        ],
      },
      {
        subheader: `Reports`,
        groupAccess: [`ADMIN`, `MANAGER`],
        icon: <AccountBalanceWalletIcon />,
        items: [
          {
            text: `Payments Received`,
            to: `/reports/payments-received`,
          },
          {
            text: `Upcoming Tour Calendar`,
            to: `/reports/upcoming/tours`,
          },
          {
            text: `Misc Purchases Calendar`,
            to: `/reports/upcoming/misc`,
          },
          {
            text: `Tours Financial Analysis`,
            to: `/reports/financial-analysis/tours`,
          },
          {
            text: `Misc Financial Analysis`,
            to: `/reports/financial-analysis/misc`,
          },
        ],
      },
      {
        subheader: `Booking partners`,
        groupAccess: [`ADMIN`, `MANAGER`],
        icon: <SupervisorAccountIcon />,
        items: [
          {
            text: `Search`,
            to: `/booking-partners`,
          },
          {
            text: `Add `,
            to: `/booking-partners/add`,
          },
        ],
      },
      {
        subheader: `Products`,
        groupAccess: [`ADMIN`],
        icon: <ExploreIcon />,
        items: [
          {
            text: `Search`,
            to: `/products`,
          },
          {
            text: `Add`,
            to: `/products/add`,
          },
        ],
      },
      {
        subheader: `Emails`,
        groupAccess: [`ADMIN`],
        icon: <EmailIcon />,
        items: [
          {
            text: `Add template`,
            to: `/emails/templates/add`,
          },
          {
            text: `Templates`,
            to: `/emails/templates`,
          },
          {
            text: `History`,
            to: `/emails/history`,
          },
        ],
      },
      {
        subheader: `Users and settings`,
        groupAccess: [`ADMIN`],
        icon: <SettingsIcon />,
        items: [
          {
            text: `Users`,
            to: `/users`,
          },
          {
            text: `Settings`,
            to: `/settings`,
          },
        ],
      },
      {
        subheader: `Discounts`,
        groupAccess: [`ADMIN`],
        icon: <SettingsIcon />,
        items: [
          {
            text: `Discounts`,
            to: `/discounts`,
          },
        ],
      },
    ];

    let sectionComponents = [];
    links.map((section, sectionIndex) => {
      let subLinks = [];
      section.items.map((item, itemIndex) => {
        subLinks.push(
          <Link
            to={item.to}
            key={`menu_link_${sectionIndex}_${itemIndex}`}
            className="no-underline"
          >
            <ListItem button disableGutters={true}>
              <ListItemText inset primary={item.text} />
            </ListItem>
          </Link>,
        );
      });

      if (section.groupAccess.indexOf(this.props.user.groupCode) > -1) {
        sectionComponents.push(
          <div key={`menu_section_${sectionIndex}`}>
            <ListSubheader component="div">{section.subheader}</ListSubheader>
            {subLinks}
          </div>,
        );
      }
    });

    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={navDrawerOpen}
        onClose={this.props.onMenuClose}
      >
        <List component="nav" dense={true}>
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary={props.user.firstname + ` ` + props.user.lastname}
              secondary={props.user.email}
            />
          </ListItem>
          <ListItem button onClick={(event) => handleClick(event)}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={`Log out`} />
          </ListItem>
          <Link to="/" className="no-underline">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={`Check-in`} />
            </ListItem>
          </Link>
          {sectionComponents}
        </List>
      </Drawer>
    );
  }
}

LeftDrawer.propTypes = {
  navDrawerOpen: PropTypes.bool,
  user: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
};

/* eslint-disable */
function mapStateToProps(state) {
  const { auth } = state;
  const { user } = auth;
  return { user };
}

export default connect(mapStateToProps)(LeftDrawer);
