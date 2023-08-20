import axios from "axios";
import config from "../../config";

/**
 * Fetches users
 *
 * @returns {Promise}
 */
export const getUsers = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}users`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Fetches user groups
 *
 * @returns {Promise}
 */
export const getUserGroups = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}users/groups`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Get user
 *
 * @param {Number} userId User identifier
 *
 * @returns {Promise}
 */
export const getUser = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}users/${userId}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Create user
 *
 * @param {Object} data User data
 *
 * @returns {Promise}
 */
export const createUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}users`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Updates user
 *
 * @param {Number} userId User identifier
 * @param {Object} data   User data
 *
 * @returns {Promise}
 */
export const updateUser = (userId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}users/${userId}`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Deletes user
 *
 * @param {Number} userId User identifier
 *
 * @returns {Promise}
 */
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}users/${userId}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};
