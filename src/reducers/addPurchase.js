import {
  ADD_PURCHASE_REQUEST,
  ADD_PURCHASE_SUCCESS,
  ADD_PURCHASE_FAILURE,
  ADD_PURCHASE_RESET,
} from "../constants";

const intialState = {
  loading: false,
  error: false,
  purchase: false,
};

export function addPurchaseReducer(state = intialState, action) {
  switch (action.type) {
    case ADD_PURCHASE_RESET:
      return Object.assign({}, state, intialState);
    case ADD_PURCHASE_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        error: false,
        purchase: false,
      });
    case ADD_PURCHASE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: false,
        purchase: action.data,
      });
    case ADD_PURCHASE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: action.data,
        purchase: false,
      });
    default:
      return state;
  }
}
