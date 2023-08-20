import axios from "axios";
import config from "../../config";

/**
 * Fetches booking partners
 */
export const getBookingPartners = (filters = {}) => {
  return new Promise((resolve, reject) => {
    let filterParameters = [];
    if (`page` in filters && filters.page) {
      filterParameters.push(`page=${filters.page}`);
    } else {
      filterParameters.push(`page=0`);
    }

    if (`limit` in filters && filters.limit) {
      filterParameters.push(`limit=${filters.limit}`);
    } else {
      filterParameters.push(`limit=20`);
    }

    if (`order` in filters && filters.order)
      filterParameters.push(`order=${filters.order}`);
    if (`orderBy` in filters && filters.orderBy)
      filterParameters.push(`orderBy=${filters.orderBy}`);
    if (`name` in filters && filters.name)
      filterParameters.push(`name=${encodeURIComponent(filters.name)}`);
    if (`reservationConfirmEmail` in filters && filters.reservationConfirmEmail)
      filterParameters.push(
        `reservationConfirmEmail=${filters.reservationConfirmEmail}`,
      );
    if (
      `commissionLevel` in filters &&
      (filters.commissionLevel || filters.commissionLevel === 0)
    )
      filterParameters.push(`commissionLevel=${filters.commissionLevel}`);
    if (`paymentMethod` in filters && filters.paymentMethod)
      filterParameters.push(
        `paymentMethod=${filters.paymentMethod.toLowerCase()}`,
      );

    axios
      .get(`${config.apiURL}bookingPartners?${filterParameters.join(`&`)}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Fetches purchases for specific booking partner
 *
 * @param {Number} bookingPartnerId Booking partner identifier
 *
 * @returns {Promise}
 */
export const getBookingPartnerPurchases = (bookingPartnerId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}bookingPartners/${bookingPartnerId}/purchases`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Fecthes specific booking partner
 *
 * @param {Number} bookingPartnerId Booking partner identifier
 *
 * @returns {Promise}
 */
export const getBookingPartner = (bookingPartnerId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}bookingPartners/${bookingPartnerId}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Creates booking partner
 *
 * @param {Object} data Booking partner description
 *
 * @returns {Promise}
 */
export const createBookingPartner = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}bookingPartners`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Updates booking partner
 *
 * @param {Number} bookingPartnerId Booking partner identifier
 * @param {Object} data             Booking partner description
 *
 * @returns {Promise}
 */
export const updateBookingPartner = (bookingPartnerId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}bookingPartners/${bookingPartnerId}`, data, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Deletes booking partner
 *
 * @param {Number} bookingPartnerId Booking partner identifier
 */
export const deleteBookingPartner = (bookingPartnerId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}bookingPartners/${bookingPartnerId}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};
