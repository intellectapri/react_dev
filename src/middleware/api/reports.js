import axios from "axios";
import moment from "moment";
import config from "../../config";

/**
 * Fetches upcoming tour purchases report
 *
 * @returns {Promise}
 */
export const getUpcomingReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}reports/future`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Exports upcoming tour purchases report
 *
 * @returns {Promise}
 */
export const exportUpcomingReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}reports/future/export`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();

        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Fetches upcoming misc purchases report
 *
 * @returns {Promise}
 */
export const getUpcomingMiscReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}reports/future-misc`, { withCredentials: true })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Exports upcoming tomiscur purchases report
 *
 * @returns {Promise}
 */
export const exportUpcomingMiscReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiURL}reports/future-misc/export`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();

        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

const getParametersForPaymentReport = (filters) => {
  let filtersRaw = `from=${filters.from}&to=${filters.to}`;
  if (filters.paymentMethod)
    filtersRaw = filtersRaw + `&paymentMethod=${filters.paymentMethod}`;
  if (filters.productId)
    filtersRaw = filtersRaw + `&productId=${filters.productId}`;
  if (filters.bookingPartnerId)
    filtersRaw = filtersRaw + `&bookingPartnerId=${filters.bookingPartnerId}`;
  return filtersRaw;
};

/**
 * Fetches payments report
 *
 * @returns {Promise}
 */
export const getPaymentsReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForPaymentReport(filters);
    axios
      .get(`${config.apiURL}reports/payments?${filtersRaw}`, {
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
 * Exports payments report
 *
 * @returns {Promise}
 */
export const exportPaymentsReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForPaymentReport(filters);
    axios
      .get(`${config.apiURL}reports/payments/export?${filtersRaw}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();

        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getParametersForFinanceReport = (filters) => {
  let filtersRaw = `from=${filters.from}&to=${filters.to}`;
  if (filters.paymentMethod)
    filtersRaw = filtersRaw + `&paymentMethod=${filters.paymentMethod}`;
  if (filters.productId)
    filtersRaw = filtersRaw + `&productId=${filters.productId}`;
  if (filters.famils) filtersRaw = filtersRaw + `&famils=${filters.famils}`;
  if (filters.status) filtersRaw = filtersRaw + `&status=${filters.status}`;
  if (filters.travelAgency)
    filtersRaw =
      filtersRaw + `&travelagency=${encodeURIComponent(filters.travelAgency)}`;
  if (filters.bookingPartnerId)
    filtersRaw = filtersRaw + `&bookingPartnerId=${filters.bookingPartnerId}`;
  return filtersRaw;
};

/**
 * Fetches finance report for tours purchases
 *
 * @returns {Promise}
 */
export const getFinanceToursReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForFinanceReport(filters);
    axios
      .get(`${config.apiURL}reports/finance-tours?${filtersRaw}`, {
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
 * Exports finance report for tours purchases
 *
 * @returns {Promise}
 */
export const exportFinanceToursReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForFinanceReport(filters);
    axios
      .get(`${config.apiURL}reports/finance-tours/export?${filtersRaw}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();

        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

const getParametersForFinanceMiscReport = (filters) => {
  let filtersRaw = `deliveryFrom=${moment(filters.deliveryFrom).format(
    `YYYY-MM-DD`,
  )}&deliveryTo=${moment(filters.deliveryTo).format(`YYYY-MM-DD`)}`;
  if (filters.purchaseFrom)
    filtersRaw =
      filtersRaw +
      `&purchaseFrom=${moment(filters.purchaseFrom).format(`YYYY-MM-DD`)}`;
  if (filters.purchaseTo)
    filtersRaw =
      filtersRaw +
      `&purchaseTo=${moment(filters.purchaseTo).format(`YYYY-MM-DD`)}`;
  if (filters.productId)
    filtersRaw = filtersRaw + `&productId=${filters.productId}`;

  return filtersRaw;
};

/**
 * Fetches finance report for misc purchases
 *
 * @returns {Promise}
 */
export const getFinanceMiscReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForFinanceMiscReport(filters);
    axios
      .get(`${config.apiURL}reports/finance-misc?${filtersRaw}`, {
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
 * Exports finance report for misc purchases
 *
 * @returns {Promise}
 */
export const exportFinanceMiscReport = (filters) => {
  return new Promise((resolve, reject) => {
    let filtersRaw = getParametersForFinanceMiscReport(filters);
    axios
      .get(`${config.apiURL}reports/finance-misc/export?${filtersRaw}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();

        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};
