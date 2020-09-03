import React, { FC } from 'react';
import classnames from 'classnames';
import { ButtonProps } from './types';

const prefixCls = 'iuc-btn';

/**
 * 
 * @param props  any
 * @returns void
 */
const Button: FC<ButtonProps> = ({
  type,
  size,
  children,
  className,
  ...rest
}) => {
  const classes = classnames(prefixCls, className, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${size}`]: size,
  })
  return <button className={classes} type="button" {...rest}>{children}</button>
}

export default Button;