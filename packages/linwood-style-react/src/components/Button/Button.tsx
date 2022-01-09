import React, { ReactElement } from 'react'
import './Button.sass'

export interface ButtonProps {
    label: string,
    size: 'small' | 'medium' | 'large',
}

export default function Button({ label, size }: ButtonProps): ReactElement {
    return (
        <button className={`button button--${size}`}>
            {label}
        </button>
    )
}
