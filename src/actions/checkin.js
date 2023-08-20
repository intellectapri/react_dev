import {
  LOAD_CHECKINS_REQUEST,
  LOAD_CHECKINS_SUCCESS,
  LOAD_CHECKINS_FAILURE,
  SET_CHECKIN_REQUEST,
  SET_CHECKIN_SUCCESS,
  SET_CHECKIN_FAILURE,
  SET_NOSHOW_REQUEST,
  SET_NOSHOW_SUCCESS,
  SET_NOSHOW_FAILURE,
} from "../constants";

import {
  getCheckins,
  updateNoShow,
  updateCheckIn,
} from "../middleware/api/checkin";

export function requestCheckins(date) {
  return (dispatch) => {
    dispatch({ type: LOAD_CHECKINS_REQUEST });
    return getCheckins(date)
      .then((data) => {
        dispatch({
          type: LOAD_CHECKINS_SUCCESS,
          data,
        });
      })
      .catch(() => {
        dispatch({ type: LOAD_CHECKINS_FAILURE });
      });
  };
}

export function setCheckin(id, newValue) {
  return (dispatch) => {
    dispatch({ type: SET_CHECKIN_REQUEST, id, newValue });
    return updateCheckIn(id, newValue)
      .then(() => {
        dispatch({
          type: SET_CHECKIN_SUCCESS,
          id,
          newValue,
        });
      })
      .catch(() => {
        dispatch({
          type: SET_CHECKIN_FAILURE,
          id,
          newValue,
        });
      });
  };
}

export function setNoShow(id, newValue) {
  return (dispatch) => {
    dispatch({ type: SET_NOSHOW_REQUEST, id, newValue });
    return updateNoShow(id, newValue)
      .then(() => {
        dispatch({
          type: SET_NOSHOW_SUCCESS,
          id,
          newValue,
        });
      })
      .catch(() => {
        dispatch({
          type: SET_NOSHOW_FAILURE,
          id,
          newValue,
        });
      });
  };
}
