/* eslint-disable import/default */

require("dotenv").config();

import React from "react";
import { render } from "react-dom";
import axios from "axios";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { Router, browserHistory } from "react-router";
import routes from "./routes";
import injectTapEventPlugin from "react-tap-event-plugin";
require("./favicon.ico");
import "./styles.scss";
import "font-awesome/css/font-awesome.css";
import "flexboxgrid/css/flexboxgrid.css";

import thunkMiddleware from "redux-thunk";
import api from "./middleware/api";

import reducers from "./reducers";

import { logoutUser } from "./actions/auth";
import { showNotification } from "./actions/application";

injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  api,
)(createStore);

const store = createStoreWithMiddleware(reducers);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      error.response.data === "Unauthorized"
    ) {
      store.dispatch(logoutUser());
      store.dispatch(showNotification(`Session expired, please sign in again`));
    }

    return Promise.reject(error);
  },
);

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById("root"),
);
