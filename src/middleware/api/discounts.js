import axios from "axios";
import config from "../../config";
import CodeGenerator from "node-code-generator";

export const getDiscounts = (options = {}) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(options);

    axios
      .get(`${config.apiURL}discounts?${params.toString()}`, {
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

export const deleteDiscount = (discountId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiURL}discounts/${discountId}`, {
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

export const updateDiscount = (discountId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiURL}discounts/${discountId}`, data, {
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
export const createDiscount = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiURL}discounts`, data, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDiscount = (discountId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}discounts/${discountId}`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const generateCode = () => {
  const generator = new CodeGenerator();
  const pattern = "BONZAMS*+";
  var options = {
    existingCodesLoader: (pattern) => [],
    sparsity: 100,
  };
  return generator.generateCodes(pattern, 1, options);
};
