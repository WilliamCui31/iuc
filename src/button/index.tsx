import React, { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode
}

/**
 * 
 * @param props  any
 * @returns void
 */
const Button: FC<Props> = ({
  children
}) => {
  return <button className="iuc-btn" type="button">{children}</button>
}

export default Button;