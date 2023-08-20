import {
  CLEAR_ALL_NOTIFICATIONS_AND_ERRORS,
  CLEAR_NOTIFICATIONS,
  CLEAR_ERRORS,
  SHOW_NOTIFICATION,
  SHOW_ERROR,
} from "../constants";

export function applicationReducer(
  state = {
    notifications: [],
    errors: [],
  },
  action,
) {
  let items = [];
  switch (action.type) {
    case CLEAR_ALL_NOTIFICATIONS_AND_ERRORS:
      return Object.assign({}, state, {
        notifications: [],
        errors: [],
      });
    case CLEAR_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: [],
      });
    case CLEAR_ERRORS:
      return Object.assign({}, state, {
        errors: [],
      });
    case SHOW_NOTIFICATION:
      items = state.notifications.splice(0);
      if (Array.isArray(action.payload)) {
        items = items.concat(action.payload);
      } else {
        items.push(action.payload);
      }

      return Object.assign({}, state, { notifications: items });
    case SHOW_ERROR:
      items = state.errors.splice(0);
      if (Array.isArray(action.payload)) {
        items = items.concat(action.payload);
      } else {
        items.push(action.payload);
      }

      return Object.assign({}, state, { errors: items });
    default:
      return state;
  }
}
