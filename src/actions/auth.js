import {
  AUTHORIZATION_CHECK_SUCCESS,
  AUTHORIZATION_CHECK_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from "../constants";

import { login, logout, check } from "../middleware/api/auth";

import config from "./../config";
import { requestProducts } from "./product";
import { requestCustomers } from "./customer";
import { requestUsers } from "./user";
import { showNotification } from "./application";

function isAuthorized(user) {
  return { type: AUTHORIZATION_CHECK_SUCCESS, user };
}

function isNotAuhtorized(requestedLocation) {
  return { type: AUTHORIZATION_CHECK_FAILURE, payload: requestedLocation };
}

const validateGroup = (user) => {
  let correctGroup = false;
  config.userGroups.map((group) => {
    if (group.groupCode === user.groupCode) {
      correctGroup = true;
    }
  });

  if (correctGroup === false) {
    console.error(`User group is invalid`, user);
  }
};

export function checkAuthorization(callerProps) {
  return (dispatch) => {
    return check()
      .then((user) => {
        dispatch(isAuthorized(user));
        validateGroup(user);
        setTimeout(() => {
          dispatch(requestProducts());
          dispatch(requestCustomers());
          dispatch(requestUsers());
        }, 100);
      })
      .catch(() => {
        let requestedLocation =
          callerProps.location && callerProps.location.pathname
            ? callerProps.location.pathname
            : false;
        dispatch(isNotAuhtorized(requestedLocation));
        if (requestedLocation !== `/login`) {
          dispatch(showNotification(`Please sign in`));
        }

        callerProps.router.push(`/login`);
      });
  };
}

function requestLogin() {
  return { type: LOGIN_REQUEST };
}

function receiveLogin(user, callerProps) {
  return (dispatch, getState) => {
    let { auth } = getState();
    if (auth.requestedLocation && auth.requestedLocation !== `/login`) {
      callerProps.router.push(auth.requestedLocation);
    } else {
      callerProps.router.push(`/`);
    }

    dispatch({ type: LOGIN_SUCCESS, user });
  };
}

function loginError(errorMessage) {
  return { type: LOGIN_FAILURE, authMessage: errorMessage };
}

export function loginUser(credentials, callerProps) {
  return (dispatch) => {
    dispatch(requestLogin());
    return login(credentials)
      .then((user) => {
        dispatch(receiveLogin(user, callerProps));
        validateGroup(user);
        setTimeout(() => {
          dispatch(requestProducts());
          dispatch(requestCustomers());
          dispatch(requestUsers());
        }, 100);
      })
      .catch((errorMessage) => {
        dispatch(loginError(errorMessage));
      });
  };
}

function requestLogout() {
  return { type: LOGOUT_SUCCESS };
}

export function logoutUser(callerProps) {
  return (dispatch) => {
    dispatch(requestLogout());
    if (callerProps) callerProps.router.push(`/login`);
    return logout().then(() => {
      dispatch(requestLogout());
    });
  };
}
