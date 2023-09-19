"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

Object.defineProperty(exports, "getYear", {
  enumerable: true,
  get: function get() {
    return _dates.getYear;
  }
});
Object.defineProperty(exports, "getMonth", {
  enumerable: true,
  get: function get() {
    return _dates.getMonth;
  }
});
Object.defineProperty(exports, "getMonthIndex", {
  enumerable: true,
  get: function get() {
    return _dates.getMonthIndex;
  }
});
Object.defineProperty(exports, "getDay", {
  enumerable: true,
  get: function get() {
    return _dates.getDay;
  }
});
Object.defineProperty(exports, "getDaysInMonth", {
  enumerable: true,
  get: function get() {
    return _dates.getDaysInMonth;
  }
});
Object.defineProperty(exports, "getISOLocalMonth", {
  enumerable: true,
  get: function get() {
    return _dates.getISOLocalMonth;
  }
});
Object.defineProperty(exports, "getISOLocalDate", {
  enumerable: true,
  get: function get() {
    return _dates.getISOLocalDate;
  }
});

var _dates = require("react-calendar/dist/shared/dates");

exports.getBegin = getBegin;
exports.getEnd = getEnd;

var _dateUtils = require("@wojtekmaj/date-utils");

/**
 * Returns the beginning of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */
function getBegin(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return (0, _dateUtils.getCenturyStart)(date);

    case 'decade':
      return (0, _dateUtils.getDecadeStart)(date);

    case 'year':
      return (0, _dateUtils.getYearStart)(date);

    case 'month':
      return (0, _dateUtils.getMonthStart)(date);

    case 'day':
      return (0, _dateUtils.getDayStart)(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}
/**
 * Returns the end of a given range.
 *
 * @param {string} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


function getEnd(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return (0, _dateUtils.getCenturyEnd)(date);

    case 'decade':
      return (0, _dateUtils.getDecadeEnd)(date);

    case 'year':
      return (0, _dateUtils.getYearEnd)(date);

    case 'month':
      return (0, _dateUtils.getMonthEnd)(date);

    case 'day':
      return (0, _dateUtils.getDayEnd)(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}
