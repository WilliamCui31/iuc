import { ReactNode } from 'react';
export declare type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';
export declare type ButtonSize = 'default' | 'large' | 'small';
export interface ButtonProps {
    children: ReactNode;
    type?: ButtonType;
    size?: ButtonSize;
    className?: string;
}
