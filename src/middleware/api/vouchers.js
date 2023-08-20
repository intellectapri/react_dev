import axios from "axios";
import config from "../../config";

export const getVouchers = (options = {}) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(options);

    axios
      .get(`${config.apiURL}vouchers?${params.toString()}`, {
        withCredentials: true,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteVoucher = (voucherId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}vouchers${voucherId}`, { withCredentials: true })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateVoucher = (voucherId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}vouchers/${voucherId}`, data, {
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
export const createVoucher = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}vouchers`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getVoucher = (voucherId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}vouchers/${voucherId}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
