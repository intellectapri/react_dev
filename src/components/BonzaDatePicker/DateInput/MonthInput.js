"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MonthInput;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dateUtils = require("@wojtekmaj/date-utils");

var _Input = _interopRequireDefault(require("./Input"));

var _propTypes2 = require("../shared/propTypes");

var _utils = require("../shared/utils");

var _excluded = ["maxDate", "minDate", "year"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function MonthInput(_ref) {
  var maxDate = _ref.maxDate,
      minDate = _ref.minDate,
      year = _ref.year,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  function isSameYear(date) {
    return date && year === (0, _dateUtils.getYear)(date).toString();
  }

  var maxMonth = (0, _utils.safeMin)(12, isSameYear(maxDate) && (0, _dateUtils.getMonthHuman)(maxDate));
  var minMonth = (0, _utils.safeMax)(1, isSameYear(minDate) && (0, _dateUtils.getMonthHuman)(minDate));
  return /*#__PURE__*/_react["default"].createElement(_Input["default"], _extends({
    max: maxMonth,
    min: minMonth,
    name: "month"
  }, otherProps));
}

MonthInput.propTypes = {
  ariaLabel: _propTypes["default"].string,
  className: _propTypes["default"].string.isRequired,
  disabled: _propTypes["default"].bool,
  inputRef: _propTypes2.isRef,
  maxDate: _propTypes2.isMaxDate,
  minDate: _propTypes2.isMinDate,
  onChange: _propTypes["default"].func,
  onKeyDown: _propTypes["default"].func,
  onKeyUp: _propTypes["default"].func,
  placeholder: _propTypes["default"].string,
  required: _propTypes["default"].bool,
  showLeadingZeros: _propTypes["default"].bool,
  value: _propTypes["default"].string,
  year: _propTypes["default"].string
};