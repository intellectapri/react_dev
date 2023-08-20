import {
  ADD_PAYMENT_REQUEST,
  ADD_PAYMENT_SUCCESS,
  ADD_PAYMENT_FAILURE,
  ADD_PAYMENT_RESET,
  ADD_REFUND_REQUEST,
  ADD_REFUND_SUCCESS,
  ADD_REFUND_FAILURE,
  ADD_REFUND_RESET,
  DELETE_CHARGE_REQUEST,
  DELETE_CHARGE_SUCCESS,
  DELETE_CHARGE_FAILURE,
  DELETE_CHARGE_RESET,
} from "../constants";

export function chargeReducer(
  state = {
    deleteChargeLoading: false,
    addPaymentSuccess: false,
    addPaymentLoading: false,
    addRefundSuccess: false,
    addRefundLoading: false,
  },
  action,
) {
  switch (action.type) {
    case ADD_REFUND_REQUEST:
      return Object.assign({}, state, {
        addRefundSuccess: false,
        addRefundLoading: true,
      });
    case ADD_REFUND_SUCCESS:
      return Object.assign({}, state, {
        addRefundSuccess: true,
        addRefundLoading: false,
      });
    case ADD_REFUND_FAILURE:
      return Object.assign({}, state, {
        addRefundSuccess: false,
        addRefundLoading: false,
      });
    case ADD_REFUND_RESET:
      return Object.assign({}, state, {
        addRefundSuccess: false,
        addRefundLoading: false,
      });
    case ADD_PAYMENT_REQUEST:
      return Object.assign({}, state, {
        addPaymentSuccess: false,
        addPaymentLoading: true,
      });
    case ADD_PAYMENT_SUCCESS:
      return Object.assign({}, state, {
        addPaymentSuccess: true,
        addPaymentLoading: false,
      });
    case ADD_PAYMENT_FAILURE:
      return Object.assign({}, state, {
        addPaymentSuccess: false,
        addPaymentLoading: false,
      });
    case ADD_PAYMENT_RESET:
      return Object.assign({}, state, {
        addPaymentSuccess: false,
        addPaymentLoading: false,
      });
    case DELETE_CHARGE_REQUEST:
      return Object.assign({}, state, {
        deleteChargeLoading: true,
      });
    case DELETE_CHARGE_SUCCESS:
    case DELETE_CHARGE_FAILURE:
    case DELETE_CHARGE_RESET:
      return Object.assign({}, state, {
        deleteChargeLoading: false,
      });
    default:
      return state;
  }
}
