import React, { PropsWithChildren, ReactElement, useEffect } from 'react'
import './LinwoodStyleProvider.sass'

export interface LinwoodStyleProviderProps {

}

export default function LinwoodStyleProvider({ children }: PropsWithChildren<LinwoodStyleProviderProps>): ReactElement {
    return (
        <div className="style-provider">
            {children}
        </div>
    )
}
