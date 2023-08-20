import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import EditIcon from "@material-ui/icons/Edit";
import HistoryIcon from "@material-ui/icons/History";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import config from "../config";

const columns = [
  {
    id: `status`,
    title: `Status`,
    notSortable: true,
  },
  {
    id: `purchaseID`,
    title: `Bonza Booking ID`,
  },
  {
    id: `tourDate`,
    title: `Tour date`,
  },
  {
    id: `travelerLastname`,
    title: `Traveller name`,
  },
  {
    id: `product`,
    title: `Product`,
  },
  {
    id: `totalGuest`,
    title: `Total Guests`,
    notSortable: true,
  },
  {
    id: `oustanding`,
    title: `Oustanding`,
    notSortable: true,
  },
  {
    id: `customerName`,
    title: `Customer`,
  },
  {
    id: `noOfAdult`,
    title: `Adults`,
    icon: <PersonIcon />,
  },
  {
    id: `noOfChildren`,
    title: `Children`,
    icon: <ChildCareIcon />,
  },
  {
    id: `noOfFamilyGroups`,
    title: `Families`,
    icon: <GroupIcon />,
  },
  {
    id: `noOfAdditionals`,
    title: `Additionals`,
    icon: <GroupAddIcon />,
  },
  {
    id: `totalNet`,
    title: `Total sale`,
  },
  {
    id: `enteredByName`,
    title: `History`,
    notSortable: true,
  },
  {
    id: `purchaseDate`,
    title: `Purchase date`,
  },
];

class PurchasesSearchResultTable extends React.Component {
  constructor() {
    super();

    this.state = {
      openedMenuPurchaseId: null,
      anchorEl: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick = (event, purchaseId) => {
    this.setState({
      openedMenuPurchaseId: purchaseId,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      openedMenuPurchaseId: null,
      anchorEl: null,
    });
  };

  render() {
    const { anchorEl } = this.state;

    let purchases = this.props.data.data;
    let columnComponents = [];
    columns.map((column) => {
      let columnHeader = false;
      if (column.notSortable || !this.props.onSort) {
        columnHeader = (
          <Tooltip
            title={column.title}
            placement="bottom-start"
            enterDelay={300}
          >
            <TableSortLabel active={false}>
              {column.icon ? column.icon : column.title}
            </TableSortLabel>
          </Tooltip>
        );
      } else {
        columnHeader = (
          <Tooltip
            title={`Sort ` + column.title}
            placement="bottom-start"
            enterDelay={300}
          >
            <TableSortLabel
              active={this.props.data.orderBy === column.id}
              direction={this.props.data.order.toLowerCase()}
              onClick={() => {
                this.props.onSort(column.id);
              }}
            >
              {column.icon ? column.icon : column.title}
            </TableSortLabel>
          </Tooltip>
        );
      }

      columnComponents.push(
        <TableCell
          key={column.id}
          sortDirection={
            this.props.data.orderBy === column.id
              ? this.props.data.order.toLowerCase()
              : false
          }
          style={{
            paddingLeft: `2px`,
            paddingRight: `2px`,
            textAlign: `center`,
          }}
        >
          {columnHeader}
        </TableCell>,
      );
    });

    let head = (
      <TableHead>
        <TableRow>{columnComponents}</TableRow>
      </TableHead>
    );
    let pagination = false;
    if (this.props.onChangeRowsPerPage && this.props.onChangePage) {
      pagination = (
        <TablePagination
          rowsPerPageOptions={[20, 40, 80]}
          component="div"
          count={this.props.data.total}
          rowsPerPage={this.props.data.limit}
          page={parseInt(this.props.data.offset / this.props.data.limit)}
          onChangePage={this.props.onChangePage}
          onChangeRowsPerPage={this.props.onChangeRowsPerPage}
        />
      );
    }

    const cellStyle = {
      padding: 0,
      paddingLeft: `2px`,
      paddingRight: `2px`,
      textAlign: `center`,
    };

    let rows = [];
    purchases.map((item) => {
      let historyText = false;

      let enteredText = ``;
      let updatedText = ``;
      if (item.enteredBy) {
        this.props.users.map((userItem) => {
          if (userItem.userId === item.enteredBy) {
            enteredText = `Created by: ${userItem.firstname} ${userItem.lastname}`;
            if (item.enteredAt)
              enteredText += ` at ${moment(item.enteredAt).format(
                config.momentDateTimeFormat,
              )}`;
          }

          if (userItem.userId === item.updatedBy) {
            updatedText = `Updated by: ${userItem.firstname} ${userItem.lastname}`;
            if (item.updatedAt)
              updatedText += ` at ${moment(item.updatedAt).format(
                config.momentDateTimeFormat,
              )}`;
          }
        });

        if (enteredText || updatedText) {
          historyText = (
            <React.Fragment>
              {enteredText ? (
                <Typography color="inherit">{enteredText}</Typography>
              ) : (
                false
              )}
              {updatedText ? (
                <Typography color="inherit">{updatedText}</Typography>
              ) : (
                false
              )}
            </React.Fragment>
          );
        }
      }

      rows.push(
        <TableRow hover tabIndex={-1} key={item.purchaseID}>
          <TableCell component="th" scope="row" style={cellStyle}>
            {item.status}
          </TableCell>
          <TableCell style={cellStyle}>{item.purchaseID}</TableCell>
          <TableCell style={cellStyle}>
            {item.tourDate
              ? moment(item.tourDate, `YYYY-MM-DD`).format(
                  config.momentDateFormat,
                )
              : `No tour date`}
          </TableCell>
          <TableCell style={cellStyle}>{item.travelerLastname}</TableCell>
          <TableCell style={cellStyle}>{item.productName}</TableCell>
          <TableCell style={cellStyle}>{item.totalGuest}</TableCell>
          <TableCell style={cellStyle}>${item.outstanding}</TableCell>
          <TableCell style={cellStyle}>{item.customerName}</TableCell>
          <TableCell style={cellStyle}>{item.noOfAdult}</TableCell>
          <TableCell style={cellStyle}>{item.noOfChildren}</TableCell>
          <TableCell style={cellStyle}>{item.noOfFamilyGroups}</TableCell>
          <TableCell style={cellStyle}>{item.noOfAdditionals}</TableCell>
          <TableCell style={cellStyle}>${item.totalNet}</TableCell>
          <TableCell style={cellStyle}>
            <Tooltip title={historyText} placement="top">
              <Button color="primary">
                <HistoryIcon />
              </Button>
            </Tooltip>
          </TableCell>
          <TableCell style={cellStyle}>
            {item.purchaseDate
              ? moment(item.purchaseDate, `YYYY-MM-DD`).format(
                  config.momentDateFormat,
                )
              : `No date`}
          </TableCell>
          <TableCell style={cellStyle}>
            <IconButton
              color="primary"
              aria-haspopup="true"
              onClick={(event) => {
                this.handleClick(event, item.purchaseID);
              }}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              transitionDuration={0}
              open={
                Boolean(anchorEl) &&
                this.state.openedMenuPurchaseId === item.purchaseID
              }
              onClose={this.handleClose}
            >
              {item.purchaseType.indexOf(`tour`) > -1 ? (
                <MenuItem
                  onClick={() => {
                    this.props.router.push(
                      `/purchases/edit-tour/${item.purchaseID}`,
                    );
                  }}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Edit tour purchase</Typography>
                </MenuItem>
              ) : (
                false
              )}

              {item.purchaseType.indexOf(`misc`) > -1 ? (
                <MenuItem
                  onClick={() => {
                    this.props.router.push(
                      `/purchases/edit-misc/${item.purchaseID}`,
                    );
                  }}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Edit misc purchase</Typography>
                </MenuItem>
              ) : (
                false
              )}

              <MenuItem
                onClick={() => {
                  this.props.router.push(
                    `/purchases/${item.purchaseID}/payment`,
                  );
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <Typography variant="inherit">Payment</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  this.props.router.push(
                    `/purchases/${item.purchaseID}/refund`,
                  );
                }}
              >
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <Typography variant="inherit">Refund</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  this.props.router.push(
                    `/purchases/${item.purchaseID}/history`,
                  );
                }}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <Typography variant="inherit">Payment history</Typography>
              </MenuItem>
            </Menu>
          </TableCell>
        </TableRow>,
      );
    });

    return (
      <div>
        <div>
          <Table padding="dense">
            {head}
            <TableBody>{rows}</TableBody>
          </Table>
        </div>
        {pagination}
      </div>
    );
  }
}

PurchasesSearchResultTable.propTypes = {
  data: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onChangePage: PropTypes.func,
};

export default PurchasesSearchResultTable;
