import React, { PropsWithChildren, ReactElement } from 'react'
import { MainAxisAlignment, CrossAxisAlignment } from './Layout';

export interface ColumnProps {
    mainAlign?: MainAxisAlignment
    crossAlign?: CrossAxisAlignment
    wrap?: boolean
}

export default function Column({ mainAlign = 'start', crossAlign = 'stretch', children, wrap }: PropsWithChildren<ColumnProps>): ReactElement {
    return (
        <div className={`column layout--main-${mainAlign} layout--cross-${crossAlign} ${wrap ? 'layout--wrap' : ''}`}>
            {children}
        </div>
    )
}
