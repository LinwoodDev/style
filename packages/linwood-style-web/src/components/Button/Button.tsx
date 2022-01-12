import React, { MouseEventHandler, ReactElement, useState } from 'react'
import Touchable from '../Touchable/Touchable';
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
        const rect = button.getBoundingClientRect();

        const circle = buttonLightRef.current!;
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        var zoom = (document.body.style as any).zoom as number || 1;
        var x = (event.clientX - rect.left - radius) / zoom;
        var y = (event.clientY - rect.top - radius) / zoom;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        circle.style.width = circle.style.height = `${diameter / zoom}px`;
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
        <Touchable onClick={click}>
            <div className={`button button--${size}`}>
                {label}
            </div>
        </Touchable>
    )
}
