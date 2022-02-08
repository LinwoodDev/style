import React, { MouseEventHandler, PropsWithChildren, ReactElement } from 'react'
import './Touchable.sass'
export type TouchableSize = 'small' | 'medium' | 'large';
export type TouchableVariant = 'filled' | 'normal' | 'outlined';

export interface TouchableProps {
    onClick?: MouseEventHandler,
    variant?: TouchableVariant
}

export default function Touchable({ children, variant, onClick }: PropsWithChildren<TouchableProps>): ReactElement {
    return (
        <div onClick={onClick} className={`touchable touchable--${variant ?? 'normal'}`}>
            {children}
        </div >
    )
}
