import {
  LOAD_CUSTOMERS_REQUEST,
  LOAD_CUSTOMERS_SUCCESS,
  LOAD_CUSTOMERS_FAILURE,
  LOAD_CUSTOMER_COMISSION_SUCCESS,
  LOAD_CUSTOMER_COMISSION_FAILURE,
} from "../constants";

export function customerReducer(
  state = {
    customers: [],
    customerComission: false,
  },
  action,
) {
  switch (action.type) {
    case LOAD_CUSTOMERS_REQUEST:
      return Object.assign({}, state, {});
    case LOAD_CUSTOMERS_SUCCESS:
      return Object.assign({}, state, {
        customers: action.data,
      });
    case LOAD_CUSTOMERS_FAILURE:
      return Object.assign({}, state, {});
    case LOAD_CUSTOMER_COMISSION_SUCCESS:
      return Object.assign({}, state, {
        customerComission: action.data,
      });
    case LOAD_CUSTOMER_COMISSION_FAILURE:
      return Object.assign({}, state, {
        customerComission: false,
      });
    default:
      return state;
  }
}
