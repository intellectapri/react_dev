import axios from "axios";
import moment from "moment";
import config from "../../config";

/**
 * Creates tour purchase
 *
 * @param {Object} data Tour purchase description
 *
 * @returns {Promise}
 */
export const createTourPurchase = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}purchases/tours`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Creates misc purchase
 *
 * @param {Object} data Misc purchase description
 *
 * @returns {Promise}
 */
export const createMiscPurchase = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}purchases/misc`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Fetches purchase
 *
 * @param {Number} id Purchase identifier
 *
 * @returns {Promise}
 */
export const getPurchase = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}purchases/${id}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Fetches tour purchase
 *
 * @param {Number} id Ppurchase identifier
 *
 * @returns {Promise}
 */
export const getTourPurchase = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}purchases/tours/${id}`, { withCredentials: true })
      .then((response) => {
        if (!response.data.purchaseId || !response.data.detailId) {
          reject();
        } else {
          resolve(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Fetches misc purchase
 *
 * @param {Number} id Ppurchase identifier
 *
 * @returns {Promise}
 */
export const getMiscPurchase = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}purchases/misc/${id}`, { withCredentials: true })
      .then((response) => {
        if (!response.data.purchaseId) {
          reject();
        } else {
          resolve(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

/**
 * Updates tour purchase
 *
 * @param {Object} data Tour purchase description
 *
 * @returns {Promise}
 */
export const updateTourPurchase = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}purchases/tours/${id}`, data, {
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

/**
 * Updates misc purchase
 *
 * @param {Object} data Misc purchase description
 *
 * @returns {Promise}
 */
export const updateMiscPurchase = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}purchases/misc/${id}`, data, {
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

/**
 * Fetches purchases
 *
 * @param {Object} filters Applied filters
 *
 * @returns {Promise}
 */
export const getPurchases = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersToApply = [];
    if (filters.orderBy) filtersToApply.push(`sortBy=${filters.orderBy}`);
    if (filters.travelerName)
      filtersToApply.push(
        `travelerName=${encodeURIComponent(filters.travelerName)}`,
      );
    if (filters.bookingReferenceId)
      filtersToApply.push(
        `bookingRefId=${encodeURIComponent(filters.bookingReferenceId)}`,
      );
    if (filters.travelAgency)
      filtersToApply.push(
        `travelagency=${encodeURIComponent(filters.travelAgency)}`,
      );
    if (filters.family) filtersToApply.push(`family=1`);
    if (filters.famil) filtersToApply.push(`famils=1`);
    if (filters.status && filters.status !== `all` && filters.status !== `Any`)
      filtersToApply.push(`status=${filters.status}`);
    if (filters.product && filters.product !== `null`)
      filtersToApply.push(`productId=${filters.product}`);
    if (filters.customer && filters.customer !== `null`)
      filtersToApply.push(`bookingPartnerId=${filters.customer}`);
    if (filters.enteredBy && filters.enteredBy !== `null`)
      filtersToApply.push(`userId=${filters.enteredBy}`);
    if (filters.travelerEmail)
      filtersToApply.push(`travelerEmail=${filters.travelerEmail}`);
    if (filters.order) filtersToApply.push(`order=${filters.order}`);

    if (filters.purchaseType === `misc`) filtersToApply.push(`purchaseMisc=1`);
    if (filters.purchaseType === `tour`) filtersToApply.push(`purchaseTour=1`);

    if (filters.searchVoucher)
      filtersToApply.push(`voucherIDs=${filters.searchVoucher}`);

    // Numeric parameters
    [`page`, `limit`, `bookingId`].map((item) => {
      if (filters[item] && parseInt(filters[item]) > 0)
        filtersToApply.push(`${item}=${filters[item]}`);
    });

    // Date parameters
    [`tourDateFrom`, `tourDateTo`, `purchaseDateFrom`, `purchaseDateTo`].map(
      (item) => {
        if (filters[item])
          filtersToApply.push(
            `${item}=${moment(filters[item]).format(`YYYY-MM-DD`)}`,
          );
      },
    );

    axios
      .get(`${config.apiURL}purchases?${filtersToApply.join(`&`)}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject();
      });
  });
};

/**
 * Deletes misc purchase
 *
 * @param {Number} purchaseId Purchase identifier
 *
 * @returns {Promise}
 */
export const deleteMiscPurchase = (purchaseId, confirmationEmail) => {
  return new Promise((resolve, reject) => {
    if (parseInt(purchaseId) > 0) {
      let confirmationEmailQuery = confirmationEmail
        ? `?confirmationEmail=${confirmationEmail}`
        : ``;
      axios
        .delete(
          `${config.apiURL}purchases/${purchaseId}${confirmationEmailQuery}`,
          { withCredentials: true },
        )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid purchase identifiers`);
    }
  });
};

/**
 *
 * Fetches the purchase payment history
 *
 * @param {Number} purchaseId Purchase identifier
 *
 * @returns {Promise}
 */
export const getPurchaseHistory = (purchaseId) => {
  return new Promise((resolve, reject) => {
    if (parseInt(purchaseId) > 0) {
      axios
        .get(`${config.apiURL}purchases/${purchaseId}/history`, {
          withCredentials: true,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid purchase identifiers`);
    }
  });
};

/**
 * Fetches booking partner comission
 *
 * @param {Object} bookingPartnerId Booking partner identifier
 *
 * @returns {Promise}
 */
export const getCustomerComission = (bookingPartnerId) => {
  return new Promise((resolve, reject) => {
    if (parseInt(bookingPartnerId) > 0) {
      axios
        .get(`${config.apiURL}bookingPartners/${bookingPartnerId}/comission`, {
          withCredentials: true,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject(`Invalid booking partner or product identifiers`);
    }
  });
};
