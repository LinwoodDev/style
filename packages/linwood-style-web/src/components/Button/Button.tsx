import React, { ReactElement, useState } from 'react'
import Touchable from '../Touchable/Touchable';
import './Button.sass'
import { TouchableSize, TouchableVariant } from '../Touchable/Touchable';

export interface ButtonProps {
    label: string,
    size?: TouchableSize,
    variant?: TouchableVariant
}

export default function Button({ label, size, variant }: ButtonProps): ReactElement {
    return (
        <Touchable variant={variant}>
            <div className={`button button--${size}`}>
                {label}
            </div>
        </Touchable >
    )
}
