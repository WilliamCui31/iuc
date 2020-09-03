import { ReactNode } from 'react';

export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
export type ButtonSize = 'default' | 'large' | 'small';

export interface ButtonProps {
  children: ReactNode
  type?: ButtonType,
  size?: ButtonSize,
  className?: string
}