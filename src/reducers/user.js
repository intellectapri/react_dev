import {
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
} from "../constants";

export function userReducer(
  state = {
    users: [],
  },
  action,
) {
  switch (action.type) {
    case LOAD_USERS_REQUEST:
      return Object.assign({}, state, {});
    case LOAD_USERS_SUCCESS:
      return Object.assign({}, state, {
        users: action.data,
      });
    case LOAD_USERS_FAILURE:
      return Object.assign({}, state, {});
    default:
      return state;
  }
}
