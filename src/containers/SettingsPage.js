import React from "react";
import { setActivePageTitle } from "../actions/settings";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import BonzaTextField from "../components/BonzaTextField";
import LoadingOverlay from "../components/LoadingOverlay";
import BonzaNotification from "../components/BonzaNotification";
import OrderConfirmationForm from "../components/OrderConfirmationForm";
import { getSettings, updateSettings } from "../middleware/api/settings";
import { htmlEntities, htmlEntities_decode } from "../utils";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      settings: [],
      errors: [],
      orderConfirmationMessage: {
        settingID: "ORDER_CONFIRMATION_MESSAGE",
        settingValue: "",
      },
    };

    this.setValue = this.setValue.bind(this);
    this.save = this.save.bind(this);
    this.setConfirmationMessage = this.setConfirmationMessage.bind(this);
    props.dispatch(setActivePageTitle(`Application settings`));
  }

  componentWillMount() {
    getSettings()
      .then((settings) => {
        let newState = { settings, loading: false };
        settings.map((item) => {
          newState[item.settingID] = item.settingValue;
        });
        this.setState(newState);

        this.setState((state) => {
          const setting = this.getOrderConfirmation(settings);

          return {
            ...state,
            orderConfirmationMessage: {
              settingID: setting.settingID,
              settingValue: htmlEntities_decode(setting.settingValue),
            },
          };
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to fetch settings`],
        });
      });
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  save() {
    let dataToSend = [];
    const { settings, orderConfirmationMessage } = this.state;

    settings.map((item) => {
      dataToSend.push({
        key: item.settingID,
        value:
          item.settingID === "ORDER_CONFIRMATION_MESSAGE"
            ? htmlEntities(orderConfirmationMessage.settingValue)
            : this.state[item.settingID],
      });
    });

    this.setState({ loading: true });
    updateSettings({ settings: dataToSend })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({
          loading: false,
          errors: [`Unable to update settings`],
        });
      });
  }
  setConfirmationMessage = (name, value) => {
    this.setState((state) => {
      return {
        ...state,
        orderConfirmationMessage: {
          ...state.orderConfirmationMessage,
          settingValue: value,
        },
      };
    });
  };
  getOrderConfirmation(settings = null) {
    const currSettings = settings ? settings : this.state.settings;
    return currSettings.find((item) => {
      return item.settingID === "ORDER_CONFIRMATION_MESSAGE";
    });
  }
  render() {
    let loadingOverlay = false;
    if (this.state.loading) {
      loadingOverlay = <LoadingOverlay />;
    }

    let settingsForm = false;

    if (Array.isArray(this.state.settings) && this.state.settings.length > 0) {
      let settingsRows = [];
      this.state.settings.map((item, itemIndex) => {
        if (item.settingID === "ORDER_CONFIRMATION_MESSAGE") {
          return "";
        }
        settingsRows.push(
          <TableRow key={`item_${itemIndex}`}>
            <TableCell>
              <Typography variant="body1" gutterBottom>
                {item.settingID}
              </Typography>
              {item.description ? (
                <Typography variant="body2" gutterBottom>
                  {item.description}
                </Typography>
              ) : (
                false
              )}
            </TableCell>
            <TableCell>
              <BonzaTextField
                name={item.settingID}
                fullWidth={true}
                value={this.state[item.settingID]}
                onChange={this.setValue}
              />
            </TableCell>
          </TableRow>,
        );
      });

      settingsForm = (
        <div>
          <div>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Configuration</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{settingsRows}</TableBody>
            </Table>
          </div>
          <div className="order-confirmation-message">
            <OrderConfirmationForm
              orderConfirmationMessage={this.state.orderConfirmationMessage}
              setConfirmationMessage={this.setConfirmationMessage}
            />
          </div>
          <div style={{ paddingTop: `10px`, textAlign: `right` }}>
            <Button variant="contained" color="primary" onClick={this.save}>
              Save
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: `relative` }}>
        {loadingOverlay}
        <div>{settingsForm}</div>
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

export default SettingsPage;
