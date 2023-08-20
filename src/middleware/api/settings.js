import axios from "axios";
import config from "../../config";

/**
 * Fetches application settings
 *
 * @param {Object} data Stored settings
 *
 * @returns {Promise}
 */
export const getSettings = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}settings`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Updates application settings
 *
 * @param {Object} data Stored settings
 *
 * @returns {Promise}
 */
export const updateSettings = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}settings`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};
