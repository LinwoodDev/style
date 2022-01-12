import React, { ReactElement, ReactNode } from 'react'
import "./ColumnItem.sass"

export interface ColumnItemProps {
    title?: string
    subtitle?: string
    leading?: ReactNode
    trailing?: ReactNode

}

export default function ColumnItem({ title, subtitle, leading, trailing }: ColumnItemProps): ReactElement {
    return (
        <div className={"column-item"}>
            {leading}
            <div className={"column-item--content"}>
                <p className="column-item--title">{title}</p>
                <p className="column-item--subtitle">{subtitle}</p>
            </div>
            {trailing}
        </div>
    )
}
