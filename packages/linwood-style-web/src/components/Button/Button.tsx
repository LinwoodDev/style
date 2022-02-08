import React, { ReactElement, useState } from 'react'
import Touchable from '../Touchable/Touchable';
import './Button.sass'
import { TouchableVariant } from '../Touchable/Touchable';

export interface ButtonProps {
    label: string,
    variant?: TouchableVariant
}

export default function Button({ label, variant }: ButtonProps): ReactElement {
    return (
        <Touchable variant={variant}>
            <div className={`button`}>
                {label}
            </div>
        </Touchable >
    )
}
