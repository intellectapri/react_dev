import axios from "axios";
import cookies from "browser-cookies";
import config from "../../config";

/**
 * Authorizes with given credentials
 */
export const login = (credentials) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}auth`, credentials, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          reject(`Invalid credentials were provided`);
        } else {
          reject(`Error occured`);
        }
      });
  });
};

/**
 * Logs out current user
 */
export const logout = () => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}auth`, { withCredentials: true })
      .then(() => {
        cookies.erase(config.sessionCookieName);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Checks if the current user is authorized
 */
export const check = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}auth`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject();
      });
  });
};
