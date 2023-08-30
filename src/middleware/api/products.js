import axios from "axios";
import config from "../../config";

/**
 * Updates sorting order for all products
 *
 * @param {Array} order Order description
 *
 * @returns {Promise}
 */
export const updateProductsOrder = (order) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}products/order`, order, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Fetches product types
 *
 * @returns {Promise}
 */
export const getProductTypes = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}products/types`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Fetches product price seasons
 *
 * @returns {Promise}
 */
export const getPriceSeasons = (productId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}products/${productId}/seasons`, {
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
 * Updates product price seasons
 *
 * @returns {Promise}
 */
export const updatePriceSeasons = (productId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}products/${productId}/seasons`, data, {
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
 * Fetches products
 *
 * @param {Object} filters Request fitler
 *
 * @returns {Promise}
 */
export const getProducts = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersList = [];
    if (filters && `typeCodes` in filters && filters.typeCodes.length > 0) {
      filtersList.push(`typeCodes=${filters.typeCodes.join(`,`)}`);
    }

    let filtersRaw = filtersList.length > 0 ? `${filtersList.join(`&`)}` : ``;
    axios
      .get(`${config.apiURL}products?${filtersRaw}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Fetches product
 *
 * @param {Object} productId Product identifier
 *
 * @returns {Promise}
 */
export const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}products/${productId}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Creates product
 *
 * @param {Object} data Product description
 *
 * @returns {Promise}
 */
export const createProduct = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}products`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Updates product
 *
 * @param {Object} productId Product identifier
 * @param {Object} data      Product description
 *
 * @returns {Promise}
 */
export const updateProduct = (productId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}products/${productId}`, data, {
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
 * Fetches product tour pricing for specific booking partner
 *
 * @param {Object} bookingPartnerId Booking partner identifier
 * @param {Number} productId        Product identifier
 * @param {String} date             Requested date
 *
 * @returns {Promise}
 */
export const getProductTourPricing = (bookingPartnerId, productId, date) => {
  return new Promise((resolve, reject) => {
    if (!(parseInt(bookingPartnerId) > 0)) bookingPartnerId = 0;
    if (!(parseInt(productId) > 0)) productId = 0;

    axios
      .get(
        `${config.apiURL}products/${productId}/tourPricing?bookingPartnerId=${bookingPartnerId}&date=${date}`,
        { withCredentials: true },
      )
      .then((response) => {
        if (response.data.status === `success`) {
          resolve(response.data);
        } else if (response.data.status === `empty`) {
          resolve(false);
        } else {
          reject(`Unexpected tour pricing response`);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Deletes product
 *
 * @param {Object} productId Product identifier
 *
 * @returns {Promise}
 */
export const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}products/${productId}`, {
        withCredentials: true,
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Restores product
 *
 * @param {Object} productId Product identifier
 *
 * @returns {Promise}
 */
export const restoreProduct = (productId) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${config.apiURL}products/${productId}/restore`,
        { archive: false },
        { withCredentials: true },
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};


/**
 * Fetches count tour by product id
 *
 * @param {Object} productId Product identifier
 *
 * @returns {Promise}
 */
export const getCountTourProduct = (productId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}products/${productId}/countTour`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
