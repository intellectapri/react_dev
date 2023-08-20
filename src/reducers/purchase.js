import {
  LOAD_PURCHASES_REQUEST,
  LOAD_PURCHASES_SUCCESS,
  LOAD_PURCHASES_FAILURE,
  GET_PAYMENT_HISTORY_REQUEST,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAILURE,
  GET_PAYMENT_HISTORY_RESET,
} from "../constants";

export function purchaseReducer(
  state = {
    purchases: {},
    purchasesLoading: false,
    purchaseHistory: false,
    purchaseHistoryLoading: false,
  },
  action,
) {
  switch (action.type) {
    case GET_PAYMENT_HISTORY_REQUEST:
      return Object.assign({}, state, {
        purchaseHistory: false,
        purchaseHistoryLoading: true,
      });
    case GET_PAYMENT_HISTORY_SUCCESS:
      return Object.assign({}, state, {
        purchaseHistory: action.data,
        purchaseHistoryLoading: false,
      });
    case GET_PAYMENT_HISTORY_FAILURE:
      return Object.assign({}, state, {
        purchaseHistory: false,
        purchaseHistoryLoading: false,
      });
    case LOAD_PURCHASES_REQUEST:
      return Object.assign({}, state, {
        purchasesLoading: true,
      });
    case LOAD_PURCHASES_SUCCESS:
      return Object.assign({}, state, {
        purchasesLoading: false,
        purchases: action.data,
      });
    case LOAD_PURCHASES_FAILURE:
      return Object.assign({}, state, {
        purchasesLoading: true,
      });
    default:
      return state;
  }
}
