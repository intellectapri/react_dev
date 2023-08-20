import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

import EditIcon from "@material-ui/icons/Edit";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DeleteIcon from "@material-ui/icons/Delete";

import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";

const columns = [
  {
    id: `customerID`,
    title: `#`,
    notSortable: true,
  },
  {
    id: `name`,
    title: `Name`,
  },
  {
    id: false,
    title: `Contact`,
    notSortable: true,
  },
  {
    id: `reservationConfirmEmail`,
    title: `Reservation confirmation email`,
  },
  {
    id: `commissionLevel`,
    title: `Commission level`,
  },
  {
    id: `paymentMethod`,
    title: `Payment method`,
  },
];

class BookingPartnersSearchResultTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    let items = this.props.data.data;
    let columnComponents = [];
    columns.map((column) => {
      let columnHeader = (
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

      if (column.notSortable) {
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
    let pagination = (
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

    const cellStyle = {
      padding: 0,
      paddingLeft: `2px`,
      paddingRight: `2px`,
      textAlign: `center`,
    };

    console.log();
    return (
      <div>
        <div>
          <Table padding="dense">
            {head}
            <TableBody>
              {items.map((item) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.customerID}>
                    <TableCell component="th" scope="row" style={cellStyle}>
                      {item.customerID}
                    </TableCell>
                    <TableCell style={cellStyle}>{item.name}</TableCell>
                    <TableCell style={cellStyle}>
                      {item.contactFirstname} {item.contactLastname}{" "}
                      {item.contactEmail ? (
                        <a
                          title={`Send email to ${item.contactEmail}`}
                          href={`mailto:${item.contactEmail}`}
                        >
                          {item.contactEmail}
                        </a>
                      ) : (
                        false
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      {item.reservationConfirmEmail ? (
                        <a
                          title={`Send email to ${item.reservationConfirmEmail}`}
                          href={`mailto:${item.reservationConfirmEmail}`}
                        >
                          {item.reservationConfirmEmail}
                        </a>
                      ) : (
                        false
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      {item.commissionLevel
                        ? item.commissionLevel
                        : `Not filled`}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      {item.paymentMethod}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Tooltip
                        title="Edit booking partner"
                        placement="top"
                        enterDelay={300}
                      >
                        <Link
                          to={`/booking-partners/edit/${item.customerID}`}
                          className="no-underline"
                        >
                          <IconButton
                            variant="contained"
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title="View booking partner purchase history"
                        placement="top"
                        enterDelay={300}
                      >
                        <Link
                          to={`/booking-partners/${item.customerID}/purchases`}
                          className="no-underline"
                        >
                          <IconButton
                            variant="contained"
                            size="small"
                            color="primary"
                          >
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        title="Delete booking partner"
                        placement="top"
                        enterDelay={300}
                      >
                        <IconButton
                          variant="contained"
                          size="small"
                          color="secondary"
                          onClick={() => {
                            this.props.onDelete(item.customerID, item.name);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {pagination}
      </div>
    );
  }
}

BookingPartnersSearchResultTable.propTypes = {
  data: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookingPartnersSearchResultTable;
