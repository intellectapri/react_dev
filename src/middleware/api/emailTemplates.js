import axios from "axios";
import config from "../../config";

/**
 * Fetches email templates
 *
 * @returns {Promise}
 */
export const getEmailTemplates = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}emailTemplates`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Fecthes specific email template
 *
 * @param {Number} id Email template identifier
 *
 * @returns {Promise}
 */
export const getEmailTemplate = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}emailTemplates/${id}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Creates specific email template
 *
 * @param {Number} id   Email template identifier
 * @param {Object} data Updated template data
 *
 * @returns {Promise}
 */
export const createEmailTemplate = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}emailTemplates`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Updates specific email template
 *
 * @param {Number} id   Email template identifier
 * @param {Object} data Updated template data
 *
 * @returns {Promise}
 */
export const updateEmailTemplate = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}emailTemplates/${id}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Deletes specific email template
 *
 * @param {Number} id Email template identifier
 *
 * @returns {Promise}
 */
export const deleteEmailTemplate = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}emailTemplates/${id}`, { withCredentials: true })
      .then(resolve)
      .catch(reject);
  });
};
