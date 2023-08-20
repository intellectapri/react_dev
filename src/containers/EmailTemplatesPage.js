import React from "react";
import moment from "moment";
import { Link } from "react-router";

import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";

import PreviewModal from "../components/PreviewModal";
import LoadingOverlay from "../components/LoadingOverlay";

import config from "./../config";
import { setActivePageTitle } from "../actions/settings";
import {
  getEmailTemplates,
  deleteEmailTemplate,
} from "../middleware/api/emailTemplates";

class EmailTemplatesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      emailTemplates: [],
      previewed: false,
    };

    this.updateList = this.updateList.bind(this);
    props.dispatch(setActivePageTitle(`Email templates`));
  }

  componentWillMount() {
    this.updateList();
  }

  onDeleteHandler(id, name) {
    if (confirm(`Delete ${name}?`)) {
      this.setState({ loading: true });
      deleteEmailTemplate(id)
        .then(() => {
          this.updateList();
        })
        .catch(() => {
          this.updateList();
        });
    }
  }

  updateList() {
    this.setState({ loading: true });
    getEmailTemplates()
      .then((emailTemplates) => {
        this.setState({
          emailTemplates,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  }

  render() {
    let loadingIndication = false;
    if (this.state.loading) {
      loadingIndication = <LoadingOverlay />;
    }

    let tableRows = [];
    this.state.emailTemplates.map((item) => {
      tableRows.push(
        <TableRow key={`code_${item.templateID}`}>
          <TableCell>{item.templateCode}</TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.subject}</TableCell>
          <TableCell>
            {moment(item.lastUpdated).format(config.momentDateFormat)}
          </TableCell>
          <TableCell style={{ textAlign: `right`, minWidth: `220px` }}>
            <Link
              to={`/emails/templates/edit/${item.templateID}`}
              className="no-underline"
              style={{ marginRight: `10px` }}
            >
              <Button size="small" variant="contained" color="primary">
                Edit
              </Button>
            </Link>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                this.setState({ previewed: item });
              }}
              style={{ marginRight: `10px` }}
            >
              Preview
            </Button>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => {
                this.onDeleteHandler(item.templateID, item.title);
              }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>,
      );
    });

    return (
      <div style={{ position: `relative` }}>
        {loadingIndication}
        <div>
          <div style={{ textAlign: `right` }}>
            <Link
              to={`/emails/templates/add`}
              className="no-underline"
              style={{ marginRight: `10px` }}
            >
              <Button size="small" variant="contained" color="primary">
                Add email template
              </Button>
            </Link>
          </div>
          <div>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Last change</TableCell>
                  <TableCell style={{ minWidth: `160px` }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </div>
        </div>
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

export default EmailTemplatesPage;
