import React from "react";
import PropTypes from "prop-types";
import BonzaTextField from "../components/BonzaTextField";

class OrderConfirmationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { orderConfirmationMessage } = this.props;

    return (
      <div>
        <h2 className="section-head">Other settings</h2>
        <ul className="other-settings-lists">
          <li>
            <BonzaTextField
              title="Order Confirmation Message"
              value={orderConfirmationMessage.settingValue}
              fullWidth={true}
              name="ORDER_CONFIRMATION_MESSAGE"
              required={false}
              rows={6}
              multiline={true}
              onChange={this.props.setConfirmationMessage}
            />
          </li>
        </ul>
      </div>
    );
  }
}
OrderConfirmationForm.propTypes = {
  orderConfirmationMessage: PropTypes.object,
  setConfirmationMessage: PropTypes.func,
};
export default OrderConfirmationForm;
