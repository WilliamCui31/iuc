import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import React from 'react';
import classnames from 'classnames';
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
      rest = _objectWithoutProperties(_ref, ["type", "size", "children", "className"]);

  var classes = classnames(prefixCls, className, (_classnames = {}, _defineProperty(_classnames, "".concat(prefixCls, "-").concat(type), type), _defineProperty(_classnames, "".concat(prefixCls, "-").concat(size), size), _classnames));
  return /*#__PURE__*/React.createElement("button", _extends({
    className: classes,
    type: "button"
  }, rest), children);
};

export default Button;