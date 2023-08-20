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

import { requestPurchaseHistory } from "./purchase";
import {
  updateCharge,
  deleteCharge,
  addPayment,
  addRefund,
} from "../middleware/api/charges";

export function resetAddPaymentAction() {
  return (dispatch) => {
    dispatch({ type: ADD_PAYMENT_RESET });
  };
}

export function resetAddRefundAction() {
  return (dispatch) => {
    dispatch({ type: ADD_REFUND_RESET });
  };
}

export function addPaymentAction(id, data) {
  return (dispatch) => {
    dispatch({ type: ADD_PAYMENT_REQUEST });
    return addPayment(id, data)
      .then((data) => {
        dispatch({
          type: ADD_PAYMENT_SUCCESS,
          data,
        });

        dispatch(requestPurchaseHistory(id));
      })
      .catch(() => {
        dispatch({ type: ADD_PAYMENT_FAILURE });
      });
  };
}

export function addRefundAction(id, data) {
  return (dispatch) => {
    dispatch({ type: ADD_REFUND_REQUEST });
    return addRefund(id, data)
      .then((data) => {
        dispatch({
          type: ADD_REFUND_SUCCESS,
          data,
        });

        dispatch(requestPurchaseHistory(id));
      })
      .catch(() => {
        dispatch({ type: ADD_REFUND_FAILURE });
      });
  };
}

export function updateChargeAction(id, data, purchaseId, cb) {
  return (dispatch) => {
    dispatch({ type: DELETE_CHARGE_REQUEST });
    return updateCharge(id, data)
      .then(() => {
        dispatch({ type: DELETE_CHARGE_SUCCESS });

        if (purchaseId) dispatch(requestPurchaseHistory(purchaseId));
        if (cb) cb();
      })
      .catch(() => {
        dispatch({ type: DELETE_CHARGE_FAILURE });
      });
  };
}

export function deleteChargeAction(id, purchaseId) {
  return (dispatch) => {
    dispatch({ type: DELETE_CHARGE_REQUEST });
    return deleteCharge(id)
      .then(() => {
        dispatch({ type: DELETE_CHARGE_SUCCESS });

        dispatch(requestPurchaseHistory(purchaseId));
      })
      .catch(() => {
        dispatch({ type: DELETE_CHARGE_FAILURE });
      });
  };
}
