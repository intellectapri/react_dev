import {
  ADD_PURCHASE_REQUEST,
  ADD_PURCHASE_SUCCESS,
  ADD_PURCHASE_FAILURE,
  ADD_PURCHASE_RESET,
} from "../constants";

import { addTourPurchase } from "../middleware/api/purchases";

export function requestPurchases(purchase) {
  return (dispatch) => {
    dispatch({ type: ADD_PURCHASE_REQUEST });
    return addTourPurchase(purchase)
      .then((data) => {
        dispatch({
          type: ADD_PURCHASE_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: ADD_PURCHASE_FAILURE });
      });
  };
}
