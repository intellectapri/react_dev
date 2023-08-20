import {
  CLEAR_ALL_NOTIFICATIONS_AND_ERRORS,
  CLEAR_NOTIFICATIONS,
  CLEAR_ERRORS,
  SHOW_NOTIFICATION,
  SHOW_ERROR,
} from "../constants";

export function clearAllNotificationsAndErrors() {
  return (dispatch) => {
    dispatch({ type: CLEAR_ALL_NOTIFICATIONS_AND_ERRORS });
  };
}

export function clearNotifications() {
  return (dispatch) => {
    dispatch({ type: CLEAR_NOTIFICATIONS });
  };
}

export function clearErrors() {
  return (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };
}

export function showNotification(payload) {
  return (dispatch) => {
    dispatch({ type: SHOW_NOTIFICATION, payload });
  };
}

export function showError(payload) {
  return (dispatch) => {
    dispatch({ type: SHOW_ERROR, payload });
  };
}
