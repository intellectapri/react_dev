import React from "react";
import { setActivePageTitle } from "../actions/settings";
import { Link } from "react-router";

import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import LoadingOverlay from "../components/LoadingOverlay";
import BonzaBooleanField from "../components/BonzaBooleanField";
import BonzaNotification from "../components/BonzaNotification";

import config from "../config";
import { getUsers, deleteUser } from "../middleware/api/users";

class UsersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showDeleted: false,
      users: [],
      errors: [],
    };

    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.updateList = this.updateList.bind(this);

    props.dispatch(setActivePageTitle(`Users`));
  }

  componentWillMount() {
    this.updateList();
  }

  updateList() {
    this.setState({ loading: true });
    getUsers()
      .then((users) => {
        this.setState({
          loading: false,
          users,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to fetch users`],
        });
      });
  }

  handleDeleteUser(userId, userName) {
    if (confirm(`Deactivate user ${userName}?`)) {
      this.setState({ loading: true });
      deleteUser(userId)
        .then(() => {
          this.setState({ loading: false }, this.updateList);
        })
        .catch(() => {
          this.setState({
            loading: false,
            errors: [`Error occured while deleting user`],
          });
        });
    }
  }

  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let usersTable = false;
    if (this.state.users.length > 0) {
      let userssRows = [];
      this.state.users.map((item, itemIndex) => {
        if (this.state.showDeleted || item.accountEnabled) {
          let name = (
            <span>
              {item.firstname} {item.lastname}
            </span>
          );
          if ((item.firstname + item.lastname).length > 30) {
            name = (
              <span title={`${item.firstname + " " + item.lastname}`}>
                {(item.firstname + item.lastname).substr(0, 30)}...
              </span>
            );
          }

          let groupsInfo = <p>No group specified</p>;
          config.userGroups.map((group) => {
            if (group.groupId === item.groupID) {
              groupsInfo = <p>{group.groupName}</p>;
            }
          });

          userssRows.push(
            <TableRow key={`item_${itemIndex}`}>
              <TableCell>
                {item.accountEnabled ? (
                  <CheckIcon style={{ color: `green` }} />
                ) : (
                  <BlockIcon style={{ color: `red` }} />
                )}
              </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{groupsInfo}</TableCell>
              <TableCell style={{ textAlign: `right` }}>
                <Link
                  to={`/users/edit/${item.userId}`}
                  className="no-underline"
                  style={{ marginRight: `10px` }}
                >
                  <Button variant="contained" size="small" color="primary">
                    Edit
                  </Button>
                </Link>
                <Button
                  disabled={!item.accountEnabled}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    this.handleDeleteUser(
                      item.userId,
                      item.firstname + " " + item.lastname,
                    );
                  }}
                >
                  Deactivate
                </Button>
              </TableCell>
            </TableRow>,
          );
        }
      });

      usersTable = (
        <div>
          <div>
            <Grid container style={{ flexGrow: `1` }}>
              <Grid item style={{ flexGrow: `1`, flexBasis: `0` }}>
                <BonzaBooleanField
                  title="Show inactive accounts"
                  value={this.state.showDeleted}
                  name="showDeleted"
                  onChange={(name, value) => {
                    this.setState({ [name]: value });
                  }}
                />
              </Grid>
              <Grid
                item
                style={{ flexGrow: `1`, flexBasis: `0`, textAlign: `right` }}
              >
                <Link
                  to={`/users/add`}
                  className="no-underline"
                  style={{ marginRight: `10px` }}
                >
                  <Button variant="contained" size="small" color="primary">
                    Add user
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </div>
          <div>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Enabled</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Groups</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{userssRows}</TableBody>
            </Table>
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        <div>{usersTable}</div>
        <BonzaNotification
          errors={this.state.errors}
          onClose={() => {
            this.setState({ errors: [] });
          }}
        />
      </div>
    );
  }
}

export default UsersPage;
