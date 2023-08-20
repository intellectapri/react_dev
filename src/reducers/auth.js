import {
  AUTHORIZATION_CHECK_REQUEST,
  AUTHORIZATION_CHECK_SUCCESS,
  AUTHORIZATION_CHECK_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from "../constants";

export function auth(
  state = {
    initialAuthorizationCheck: true,
    isAuthenticated: localStorage.getItem("token") ? true : false,
    isAuthenticating: false,
    requestedLocation: false,
    authMessage: ``,
    user: {},
  },
  action,
) {
  switch (action.type) {
    case AUTHORIZATION_CHECK_REQUEST:
      return Object.assign({}, state, {
        isAuthenticated: false,
        isAuthenticating: true,
      });
    case AUTHORIZATION_CHECK_SUCCESS:
      return Object.assign({}, state, {
        initialAuthorizationCheck: false,
        isAuthenticated: true,
        isAuthenticating: false,
        user: action.user,
      });
    case AUTHORIZATION_CHECK_FAILURE:
      return Object.assign({}, state, {
        initialAuthorizationCheck: false,
        isAuthenticated: false,
        isAuthenticating: false,
        requestedLocation: action.payload ? action.payload : false,
      });
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isAuthenticated: false,
        isAuthenticating: true,
        authMessage: ``,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        isAuthenticating: false,
        authMessage: ``,
        user: action.user,
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticated: false,
        isAuthenticating: false,
        authMessage: action.authMessage,
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
        isAuthenticating: false,
        authMessage: ``,
        requestedLocation: false,
      });
    default:
      return state;
  }
}
