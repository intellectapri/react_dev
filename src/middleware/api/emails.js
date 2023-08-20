import axios from "axios";
import moment from "moment";
import config from "../../config";

/**
 * Search emails history
 *
 * @param {Object} filters Search settings
 *
 * @returns {Promise}
 */
export const searchEmailHistory = (filters) => {
  return new Promise((resolve, reject) => {
    let searchParameters = [];
    if (filters.emailTo) searchParameters.push(`emailTo=${filters.emailTo}`);
    if (filters.from)
      searchParameters.push(
        `from=${moment(filters.from).format(`YYYY-MM-DD`)}`,
      );
    if (filters.to)
      searchParameters.push(`to=${moment(filters.to).format(`YYYY-MM-DD`)}`);
    if (filters.limit) searchParameters.push(`limit=${filters.limit}`);
    if (filters.page) searchParameters.push(`page=${filters.page}`);
    if (filters.subject)
      searchParameters.push(`subject=${encodeURIComponent(filters.subject)}`);
    if (filters.userId) searchParameters.push(`userId=${filters.userId}`);
    axios
      .get(`${config.apiURL}broadcasts?${searchParameters.join(`&`)}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
