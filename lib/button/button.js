"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var prefixCls = 'iuc-btn';
/**
 * 
 * @param props  any
 * @returns void
 */

var Button = function Button(_ref) {
  var _classnames;

  var type = _ref.type,
      size = _ref.size,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2["default"])(_ref, ["type", "size", "children", "className"]);
  var classes = (0, _classnames2["default"])(prefixCls, className, (_classnames = {}, (0, _defineProperty2["default"])(_classnames, "".concat(prefixCls, "-").concat(type), type), (0, _defineProperty2["default"])(_classnames, "".concat(prefixCls, "-").concat(size), size), _classnames));
  return /*#__PURE__*/_react["default"].createElement("button", (0, _extends2["default"])({
    className: classes,
    type: "button"
  }, rest), children);
};

var _default = Button;
exports["default"] = _default;