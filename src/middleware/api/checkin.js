import axios from "axios";
import config from "../../config";

/**
 * Fetches available checkins for specific filter values
 */
export const getCheckins = (date) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}purchases/checkins?date=${date}`, {
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
 * Updates checkin setting for tour purchase
 */
export const updateCheckIn = (tourPurchaseId, value = false) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiURL}purchases/${tourPurchaseId}/checkin`,
        { value },
        { withCredentials: true },
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject();
      });
  });
};

/**
 * Updates no-show setting for tour purchase
 */
export const updateNoShow = (tourPurchaseId, value = false) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiURL}purchases/${tourPurchaseId}/noshow`,
        { value },
        { withCredentials: true },
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject();
      });
  });
};
