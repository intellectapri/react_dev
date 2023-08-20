import {
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOAD_USERS_FAILURE,
} from "../constants";

import { getUsers } from "../middleware/api/users";

export function requestUsers() {
  return (dispatch) => {
    dispatch({ type: LOAD_USERS_REQUEST });
    return getUsers()
      .then((data) => {
        dispatch({
          type: LOAD_USERS_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: LOAD_USERS_FAILURE });
      });
  };
}
