import axios from "axios";
import config from "../../config";

/**
 * Create or update existing allotments
 */
export const createOrUpdate = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}allotments`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

/**
 * Getting available allotments
 */
export const getAllotmentsForRange = (productId, range, date) => {
  return new Promise((resolve, reject) => {
    let dateParameter = ``;
    if (date) dateParameter = `&date=${date}`;

    axios
      .get(
        `${config.apiURL}allotments/events?range=${encodeURIComponent(
          range,
        )}&productId=${productId}${dateParameter}`,
        { withCredentials: true },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject();
      });
  });
};

/**
 * Checking if allotment is available
 */
export const getAllotmentAvailability = (productId, date, purchaseId = 0) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.apiURL}allotments/available?date=${date}&productId=${productId}&purchaseId=${purchaseId}`,
        { withCredentials: true },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject();
      });
  });
};

/**
 * Checking if specific date is booked
 */
export const checkIfDateIsBooked = (productId, date) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${config.apiURL}purchases/isbookeddate?date=${date}&productId=${productId}`,
        { withCredentials: true },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject();
      });
  });
};
