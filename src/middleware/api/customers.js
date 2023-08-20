import axios from "axios";
import config from "../../config";

/**
 * Fetches customers
 *
 * @return {Promise}
 */
export const getCustomers = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}bookingPartners?limit=1000`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Fetches customers commissions
 *
 * @return {Promise}
 */
export const getCustomerCommission = (bookingPartnerId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}bookingPartners/${bookingPartnerId}/commission`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
