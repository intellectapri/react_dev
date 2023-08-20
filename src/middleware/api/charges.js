import axios from "axios";
import config from "../../config";

/**
 * Adds payment
 *
 * @param {Number} id   Purchase identifier
 * @param {Object} data Payment description
 *
 * @returns {Promise}
 */
export const addPayment = (id, payment) => {
  return new Promise((resolve, reject) => {
    if (parseInt(id) > 0) {
      axios
        .post(`${config.apiURL}purchases/${id}/payment`, payment, {
          withCredentials: true,
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid purchase identifier`);
    }
  });
};

/**
 * Adds refund
 *
 * @param {Number} id   Purchase identifier
 * @param {Object} data Refund description
 *
 * @returns {Promise}
 */
export const addRefund = (id, refund) => {
  return new Promise((resolve, reject) => {
    if (parseInt(id) > 0) {
      axios
        .post(`${config.apiURL}purchases/${id}/refund`, refund, {
          withCredentials: true,
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid purchase identifier`);
    }
  });
};

/**
 * Updates charge
 *
 * @param {Number} id   Charge identifier
 * @param {Object} data Charge data
 *
 * @returns {Promise}
 */
export const updateCharge = (id, data) => {
  return new Promise((resolve, reject) => {
    if (parseInt(id) > 0) {
      axios
        .put(`${config.apiURL}purchases/charges/${id}`, data, {
          withCredentials: true,
        })
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid charge identifier`);
    }
  });
};

/**
 * Updates charges for purchase
 *
 * @param {Number} purchaseId Purchase identifier
 * @param {Object} data       Charge data
 *
 * @returns {Promise}
 */
export const updateChargesBulk = (purchaseId, data) => {
  return new Promise((resolve, reject) => {
    if (parseInt(purchaseId) > 0) {
      axios
        .put(
          `${config.apiURL}purchases/charges/updateAll/${purchaseId}`,
          data,
          { withCredentials: true },
        )
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid purchase identifier`);
    }
  });
};

/**
 * Deletes charge
 *
 * @param {Number} id Charge identifier
 *
 * @returns {Promise}
 */
export const deleteCharge = (id) => {
  return new Promise((resolve, reject) => {
    if (parseInt(id) > 0) {
      axios
        .delete(`${config.apiURL}purchases/charges/${id}`, {
          withCredentials: true,
        })
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid charge identifier`);
    }
  });
};
