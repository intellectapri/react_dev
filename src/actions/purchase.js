import {
  LOAD_PURCHASES_REQUEST,
  LOAD_PURCHASES_SUCCESS,
  LOAD_PURCHASES_FAILURE,
  GET_PAYMENT_HISTORY_REQUEST,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_FAILURE,
  GET_PAYMENT_HISTORY_RESET,
} from "../constants";

import { getPurchaseHistory, getPurchases } from "../middleware/api/purchases";

export function requestPurchaseHistory(id) {
  return (dispatch) => {
    dispatch({ type: GET_PAYMENT_HISTORY_REQUEST });
    return getPurchaseHistory(id)
      .then((data) => {
        dispatch({
          type: GET_PAYMENT_HISTORY_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: GET_PAYMENT_HISTORY_FAILURE });
      });
  };
}

export function requestPurchases(filters) {
  return (dispatch) => {
    dispatch({ type: LOAD_PURCHASES_REQUEST });
    return getPurchases(filters)
      .then((data) => {
        dispatch({
          type: LOAD_PURCHASES_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: LOAD_PURCHASES_FAILURE });
      });
  };
}
