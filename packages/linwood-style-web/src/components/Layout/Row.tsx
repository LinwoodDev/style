import React, { PropsWithChildren, ReactElement } from 'react'
import { MainAxisAlignment, CrossAxisAlignment } from './Layout';
import './Layout.sass';
import './Row.sass';

export interface RowProps {
    mainAlign?: MainAxisAlignment
    crossAlign?: CrossAxisAlignment
    wrap?: boolean
}

export default function Row({ mainAlign = 'start', crossAlign = 'stretch', children, wrap }: PropsWithChildren<RowProps>): ReactElement {
    return (
        <div className={`row layout--main-${mainAlign} layout--cross-${crossAlign} ${wrap ? 'layout--wrap' : ''}`}>
            {children}
        </div>
    )
}
