"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _YearInput = _interopRequireDefault(require("../YearInput"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

/* eslint-disable comma-dangle */
describe("YearInput", function () {
  var defaultProps = {
    className: "className",
    onChange: function onChange() {},
  };
  it("renders an input", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input).toHaveLength(1);
  });
  it("has proper name defined", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input.prop("name")).toBe("year");
  });
  it("displays given value properly", function () {
    var value = 2018;
    var component = (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          value: value,
        }),
      ),
    );
    var input = component.find("input");
    expect(input.prop("value")).toBe(value);
  });
  it("does not disable input by default", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input.prop("disabled")).toBeFalsy();
  });
  it("disables input given disabled flag", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          disabled: true,
        }),
      ),
    );
    var input = component.find("input");
    expect(input.prop("disabled")).toBeTruthy();
  });
  it("is not required input by default", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input.prop("required")).toBeFalsy();
  });
  it("required input given required flag", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          required: true,
        }),
      ),
    );
    var input = component.find("input");
    expect(input.prop("required")).toBeTruthy();
  });
  it("calls itemRef properly", function () {
    var itemRef = jest.fn();
    (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          itemRef: itemRef,
        }),
      ),
    );
    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), "year");
  });
  it("has min = 1000 by default", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input.prop("min")).toBe(1000);
  });
  it("has min = (year in minDate) given minDate", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          minDate: new Date(2018, 6, 1),
        }),
      ),
    );
    var input = component.find("input");
    expect(input.prop("min")).toBe(2018);
  });
  it("has max = 275760 by default", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(_YearInput.default, defaultProps),
    );
    var input = component.find("input");
    expect(input.prop("max")).toBe(275760);
  });
  it("has max = (year in maxDate) given maxDate", function () {
    var component = (0, _enzyme.mount)(
      _react.default.createElement(
        _YearInput.default,
        _extends({}, defaultProps, {
          maxDate: new Date(2018, 6, 1),
        }),
      ),
    );
    var input = component.find("input");
    expect(input.prop("max")).toBe(2018);
  });
});
