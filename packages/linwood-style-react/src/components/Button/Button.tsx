import React, { MouseEventHandler, ReactElement, useState } from 'react'
import './Button.sass'

export interface ButtonProps {
    label: string,
    size: 'small' | 'medium' | 'large',
}

export default function Button({ label, size }: ButtonProps): ReactElement {
    const buttonLightRef = React.createRef<HTMLSpanElement>()
    const [full, setFull] = useState(false);

    const moveLight = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const button = event.currentTarget;

        const circle = buttonLightRef.current!;
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("button-light");
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
        <button className={`button button--${size}`} onMouseMove={moveLight} onClick={click} onMouseOut={leave}>
            <span className={"button-light" + (full ? " button-light-full" : "")} ref={buttonLightRef} />
            <span className="button-content">
                {label}
            </span>
        </button>
    )
}
