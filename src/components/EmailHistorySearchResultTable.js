import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";

import PreviewModal from "../components/PreviewModal";

import config from "../config";

class EmailHistorySearchResultTable extends React.Component {
  constructor() {
    super();

    this.state = {
      previewed: false,
    };
  }

  render() {
    let head = (
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Subject</TableCell>
          <TableCell>Sent on</TableCell>
          <TableCell>Sent to</TableCell>
          <TableCell>Created by</TableCell>
          <TableCell>Last edited</TableCell>
          <TableCell style={{ minWidth: `200px` }}></TableCell>
        </TableRow>
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

    return (
      <div>
        <div>
          <Table padding="dense">
            {head}
            <TableBody>
              {this.props.data.data.map((item) => {
                return (
                  <TableRow key={item.emailID}>
                    <TableCell style={cellStyle}>{item.emailID}</TableCell>
                    <TableCell style={cellStyle}>{item.subject}</TableCell>
                    <TableCell style={cellStyle}>
                      {moment(item.sentDate).format(
                        config.momentDateTimeFormat,
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>{item.sendTo}</TableCell>
                    <TableCell style={cellStyle}>{item.setupName}</TableCell>
                    <TableCell style={cellStyle}>{item.updateName}</TableCell>
                    <TableCell
                      style={Object.assign(cellStyle, { textAlign: `right` })}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        style={{ marginRight: `10px` }}
                        onClick={() => {
                          this.setState({ previewed: item });
                        }}
                      >
                        Preview
                      </Button>
                      <Link
                        to={`/purchases/edit-tour/${item.purchaseID}`}
                        className="no-underline"
                      >
                        <Button
                          variant="contained"
                          size="small"
                          style={{ marginRight: `10px` }}
                        >
                          Purchase
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {pagination}
        <PreviewModal
          previewedTemplate={
            this.state.previewed ? this.state.previewed : false
          }
          onClose={() => {
            this.setState({ previewed: false });
          }}
        />
      </div>
    );
  }
}

EmailHistorySearchResultTable.propTypes = {
  data: PropTypes.object.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default EmailHistorySearchResultTable;
