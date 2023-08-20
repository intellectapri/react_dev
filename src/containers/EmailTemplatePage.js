import React from "react";
import ReactQuill from "react-quill";
import { Link } from "react-router";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";

import LoadingOverlay from "../components/LoadingOverlay";
import BonzaTextField from "../components/BonzaTextField";

import { setActivePageTitle } from "../actions/settings";
import {
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
} from "../middleware/api/emailTemplates";

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={`toolbar${this.props.index}`}>
        <select className="ql-header">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option selected></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-link"></button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <select className="ql-insertCustomTags">
          <option value="{TOUR_DATE}"></option>
          <option value="{TOUR_TIME}"></option>
          <option value="{TOUR_TYPE}"></option>
          <option value="{TOUR_LANGUAGE}"></option>
          <option value="{LEAD_TRAVELLER_LAST_NAME}"></option>
          <option value="{NUMBER_OF_ADULTS}"></option>
          <option value="{NUMBER_OF_CHILDREN}"></option>
          <option value="{NUMBER_OF_FAMILIES}"></option>
          <option value="{ADDITIONAL_RIDERS}"></option>
          <option value="{TOTAL_GUESTS}"></option>
          <option value="{BOOKING_ID}"></option>
          <option value="{AMOUNT_PAID}"></option>
          <option value="{AMOUNT_OUTSTANDING}"></option>
          <option value="{GUEST_NOTES}"></option>
          <option value="{BOOKING_REF_ID}"></option>
          <option value="{BOOKING_STATUS}"></option>
          <option value="{VOUCHER_PURCHASER_LAST_NAME}"></option>
          <option value="{NUMBER_OF_INFANTS}"></option>
          <option value="{LIST_MISCELLANEOUS_PURCHASES}"></option>
          <option value="{LIST_EQUIPMENT}"></option>
          <option value="{NETT_SALE_AMOUNT}"></option>
        </select>
      </div>
    );
  }
}

class EmailTemplatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      emailTemplateWasUpdated: false,
      emailTemplateWasCreated: false,
      templateID: 0,
      templateCode: ``,
      title: ``,
      subject: ``,
      sendFrom: ``,
      standardText: ``,
      customerText: ``,
      tourOperatorText: ``,
      voucherText: ``,
    };

    function insertCustomTags(value) {
      const cursorPosition = this.quill.getSelection().index;
      this.quill.insertText(cursorPosition, value);
      this.quill.setSelection(cursorPosition + value.length);
    }

    this.modulesConfig0 = {
      toolbar: {
        container: "#toolbar0",
        handlers: { insertCustomTags },
      },
    };

    this.modulesConfig1 = {
      toolbar: {
        container: "#toolbar1",
        handlers: { insertCustomTags },
      },
    };

    this.modulesConfig2 = {
      toolbar: {
        container: "#toolbar2",
        handlers: { insertCustomTags },
      },
    };

    this.modulesConfig3 = {
      toolbar: {
        container: "#toolbar3",
        handlers: { insertCustomTags },
      },
    };

    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    this.setState({ loading: true });
    if (this.props.params.id) {
      getEmailTemplate(this.props.params.id)
        .then((emailTemplate) => {
          this.props.dispatch(
            setActivePageTitle(`Edit email template ${emailTemplate.title}`),
          );
          emailTemplate.loading = false;
          this.setState(emailTemplate);
        })
        .catch((error) => {
          console.error(error);
          this.setState({ loading: false });
        });
    } else {
      this.props.dispatch(setActivePageTitle(`Add email template`));
      this.setState({ loading: false });
    }
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  saveHandler() {
    this.setState({ loading: true });

    let data = {
      sendFrom: this.state.sendFrom,
      title: this.state.title,
      subject: this.state.subject,
      templateCode: this.state.templateCode,
      standardText: this.state.standardText ? this.state.standardText : ``,
      tourOperatorText: this.state.tourOperatorText
        ? this.state.tourOperatorText
        : ``,
      customerText: this.state.customerText ? this.state.customerText : ``,
      voucherText: this.state.voucherText ? this.state.voucherText : ``,
    };

    if (this.props.params.id) {
      updateEmailTemplate(this.state.templateID, data)
        .then(() => {
          this.setState({ emailTemplateWasUpdated: true });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ loading: false });
        });
    } else {
      createEmailTemplate(data)
        .then(() => {
          this.setState({ emailTemplateWasCreated: true });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ loading: false });
        });
    }
  }

  render() {
    let loadingIndication = false;
    if (this.state.loading) {
      if (this.state.emailTemplateWasCreated) {
        loadingIndication = (
          <LoadingOverlay
            component={
              <div>
                <CheckIcon color="primary" style={{ fontSize: 80 }} />
                <p>Email template was created</p>
                <p>
                  <Link
                    to={`/emails/templates`}
                    className="no-underline"
                    style={{ marginTop: `10px` }}
                  >
                    <Button variant="contained">View templates</Button>
                  </Link>
                </p>
              </div>
            }
          />
        );
      } else if (this.state.emailTemplateWasUpdated) {
        loadingIndication = (
          <LoadingOverlay
            component={
              <div>
                <CheckIcon color="primary" style={{ fontSize: 80 }} />
                <p>Email template was updated</p>
                <p>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.setState({
                        loading: false,
                        emailTemplateWasUpdated: false,
                      });
                    }}
                  >
                    Back to editing
                  </Button>
                </p>
                <p>
                  <Link
                    to={`/emails/templates`}
                    className="no-underline"
                    style={{ marginTop: `10px` }}
                  >
                    <Button variant="contained">View templates</Button>
                  </Link>
                </p>
              </div>
            }
          />
        );
      } else {
        loadingIndication = <LoadingOverlay />;
      }
    }

    let containerStyle = {
      height: `auto`,
      height: `500px`,
    };

    let editorStyle = {
      height: `auto`,
      height: `400px`,
      maxHeight: `400px`,
    };

    return (
      <div style={{ position: `relative` }}>
        {loadingIndication}
        <div>
          <div style={{ maxWidth: `600px` }}>
            <BonzaTextField
              title="Template code"
              fullWidth
              value={this.state.templateCode}
              name="templateCode"
              onChange={this.setValue}
            />
          </div>
          <div style={{ maxWidth: `800px` }}>
            <BonzaTextField
              title="Title"
              fullWidth
              value={this.state.title}
              name="title"
              onChange={this.setValue}
            />
          </div>
          <div style={{ maxWidth: `800px` }}>
            <BonzaTextField
              title="Subject"
              fullWidth
              value={this.state.subject}
              name="subject"
              onChange={this.setValue}
            />
          </div>
          <div style={{ maxWidth: `600px` }}>
            <BonzaTextField
              title="From email field"
              fullWidth
              value={this.state.sendFrom}
              name="sendFrom"
              onChange={this.setValue}
            />
          </div>

          {!this.props.params.id || this.state.templateID ? (
            <div style={{ paddingTop: `20px` }}>
              <div style={containerStyle}>
                <Typography variant="h6" gutterBottom>
                  Traveler Email Confirmation Text
                </Typography>
                <CustomToolbar index={0} />
                <ReactQuill
                  modules={this.modulesConfig0}
                  defaultValue={this.state.standardText}
                  onChange={(value) => {
                    this.setState({ standardText: value });
                  }}
                  style={editorStyle}
                />
              </div>

              <div style={containerStyle}>
                <Typography variant="h6" gutterBottom>
                  Booking Partner Confirmation Email Text
                </Typography>
                <CustomToolbar index={1} />
                <ReactQuill
                  modules={this.modulesConfig1}
                  defaultValue={this.state.customerText}
                  onChange={(value) => {
                    this.setState({ customerText: value });
                  }}
                  style={editorStyle}
                />
              </div>

              <div style={containerStyle}>
                <Typography variant="h6" gutterBottom>
                  Tour operator text
                </Typography>
                <CustomToolbar index={2} />
                <ReactQuill
                  modules={this.modulesConfig2}
                  defaultValue={this.state.tourOperatorText}
                  onChange={(value) => {
                    this.setState({ tourOperatorText: value });
                  }}
                  style={editorStyle}
                />
              </div>

              <div style={containerStyle}>
                <Typography variant="h6" gutterBottom>
                  Voucher text
                </Typography>
                <CustomToolbar index={3} />
                <ReactQuill
                  modules={this.modulesConfig3}
                  defaultValue={this.state.voucherText}
                  onChange={(value) => {
                    this.setState({ voucherText: value });
                  }}
                  style={editorStyle}
                />
              </div>

              <div>
                <Button
                  disabled={
                    this.state.sendFrom.length === 0 ||
                    this.state.title.length === 0 ||
                    this.state.templateCode.length === 0 ||
                    this.state.subject.length === 0
                  }
                  color="primary"
                  variant="contained"
                  onClick={this.saveHandler.bind(this)}
                >
                  Save template
                </Button>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    );
  }
}

export default EmailTemplatePage;
