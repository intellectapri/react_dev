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

export function checkinReducer(
  state = {
    checkins: [],
    booked: {},
    loading: false,
    pendingCheckIn: [],
    pendingNoShow: [],
    errorMessage: ``,
  },
  action,
) {
  let newPendingCheckIn = false,
    newCheckins = false;
  let newPendingNoShow = false,
    newNoShow = false;
  switch (action.type) {
    case LOAD_CHECKINS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
        pendingCheckIn: [],
        pendingNoShow: [],
        checkins: [],
      });
    case LOAD_CHECKINS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        checkins: action.data.purchases,
        booked: action.data.booked,
      });
    case LOAD_CHECKINS_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        checkins: [],
        booked: {},
      });
    case SET_CHECKIN_REQUEST:
      newPendingCheckIn = state.pendingCheckIn.slice();
      if (newPendingCheckIn.indexOf(action.id) === -1)
        newPendingCheckIn.push(action.id);

      newCheckins = state.checkins.slice();
      newCheckins.map((purchase, index) => {
        if (purchase.detailID === action.id) {
          newCheckins[index].checkIn = action.newValue ? 1 : 0;
        }
      });

      return Object.assign({}, state, {
        checkins: newCheckins,
        pendingCheckIn: newPendingCheckIn,
      });
    case SET_CHECKIN_SUCCESS:
      newPendingCheckIn = state.pendingCheckIn.slice();
      if (newPendingCheckIn.indexOf(action.id) > -1) {
        newPendingCheckIn.splice(newPendingCheckIn.indexOf(action.id), 1);
      }

      return Object.assign({}, state, {
        pendingCheckIn: newPendingCheckIn,
      });
    case SET_CHECKIN_FAILURE:
      newPendingCheckIn = state.pendingCheckIn.slice();
      if (newPendingCheckIn.indexOf(action.id) > -1) {
        newPendingCheckIn.splice(newPendingCheckIn.indexOf(action.id), 1);
      }

      newCheckins = state.checkins.slice();
      newCheckins.map((purchase, index) => {
        if (purchase.detailID === action.id) {
          newCheckins[index].checkIn = action.newValue ? 0 : 1;
        }
      });

      return Object.assign({}, state, {
        checkins: newCheckins,
        pendingCheckIn: newPendingNoShow,
      });

    case SET_NOSHOW_REQUEST:
      newPendingNoShow = state.pendingCheckIn.slice();
      if (newPendingNoShow.indexOf(action.id) === -1)
        newPendingNoShow.push(action.id);

      newNoShow = state.checkins.slice();
      newNoShow.map((purchase, index) => {
        if (purchase.detailID === action.id) {
          newNoShow[index].noShow = action.newValue ? 1 : 0;
        }
      });

      return Object.assign({}, state, {
        checkins: newNoShow,
        pendingNoShow: newPendingNoShow,
      });
    case SET_NOSHOW_SUCCESS:
      newPendingNoShow = state.pendingCheckIn.slice();
      if (newPendingNoShow.indexOf(action.id) > -1) {
        newPendingNoShow.splice(newPendingNoShow.indexOf(action.id), 1);
      }

      return Object.assign({}, state, {
        pendingNoShow: newPendingNoShow,
      });
    case SET_NOSHOW_FAILURE:
      newPendingNoShow = state.pendingCheckIn.slice();
      if (newPendingNoShow.indexOf(action.id) > -1) {
        newPendingNoShow.splice(newPendingNoShow.indexOf(action.id), 1);
      }

      newNoShow = state.checkins.slice();
      newNoShow.map((purchase, index) => {
        if (purchase.detailID === action.id) {
          newNoShow[index].noShow = action.newValue ? 0 : 1;
        }
      });

      return Object.assign({}, state, {
        checkins: newNoShow,
        pendingNoShow: newPendingNoShow,
      });
    default:
      return state;
  }
}
