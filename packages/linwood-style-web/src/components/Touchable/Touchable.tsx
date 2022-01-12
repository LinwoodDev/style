import React, { MouseEventHandler, PropsWithChildren, ReactElement, useState } from 'react'
import './Touchable.sass'

export interface TouchableProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function Touchable({ children }: PropsWithChildren<TouchableProps>): ReactElement {
    const touchableLightRef = React.createRef<HTMLSpanElement>()
    const [full, setFull] = useState(false);

    const moveLight = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const touchable = event.currentTarget;
        const rect = touchable.getBoundingClientRect();

        const circle = touchableLightRef.current!;
        const diameter = Math.max(touchable.clientWidth, touchable.clientHeight);
        const radius = diameter / 2;
        var zoom = (document.body.style as any).zoom as number || 1;
        var x = (event.clientX - rect.left - radius) / zoom;
        var y = (event.clientY - rect.top - radius) / zoom;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        circle.style.width = circle.style.height = `${diameter / zoom}px`;
        circle.classList.add("Touchable-light");
    };
    const click = () => {
        setFull(false)
        setTimeout(() => {
            setFull(true)
        }, 100)
    }
    const leave = () => {
        setFull(false)
    }
    return (
        <div className={`touchable`} onMouseMove={moveLight} onClick={click} onMouseOut={leave}>
            <span className={"touchable-light" + (full ? " touchable-light-full" : "")} ref={touchableLightRef} />
            <div>{children}</div>
        </div>
    )
}
