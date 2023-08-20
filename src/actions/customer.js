import {
  LOAD_CUSTOMERS_REQUEST,
  LOAD_CUSTOMERS_SUCCESS,
  LOAD_CUSTOMERS_FAILURE,
  LOAD_CUSTOMER_COMISSION_SUCCESS,
  LOAD_CUSTOMER_COMISSION_FAILURE,
} from "../constants";

import {
  getCustomers,
  getCustomerCommission,
} from "../middleware/api/customers";

export function requestCustomers() {
  return (dispatch) => {
    dispatch({ type: LOAD_CUSTOMERS_REQUEST });
    return getCustomers()
      .then((data) => {
        dispatch({
          type: LOAD_CUSTOMERS_SUCCESS,
          data: data.data,
        });
      })
      .catch(() => {
        dispatch({ type: LOAD_CUSTOMERS_FAILURE });
      });
  };
}

export function requestCustomerCommission(customerId) {
  return (dispatch) => {
    return getCustomerCommission(customerId)
      .then((data) => {
        dispatch({
          type: LOAD_CUSTOMER_COMISSION_SUCCESS,
          data,
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: LOAD_CUSTOMER_COMISSION_FAILURE });
      });
  };
}
