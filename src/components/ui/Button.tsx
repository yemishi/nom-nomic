import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    isLoading?: boolean;
}

export default function Button({
    className,
    isLoading,
    asChild,
    ...props
}: ButtonProps) {

    const defaultBg = className?.includes("bg") ? "" : "bg-gold-900"
    const defaultPy = className?.includes("py") || className?.includes("p") ? "" : "py-2"
    const defaultPx = className?.includes("px") || className?.includes("p") ? "" : "px-4"
    const defaultRadio = className?.includes("rounded") ? "" : "rounded-full"
    return (
        <button
            {...props}
            className={`${className || ""} ${defaultRadio} ${defaultBg} ${defaultPy} ${defaultPx} hover:backdrop-brightness-150
      disabled:animate-pulse duration-200 bg-opacity-75 hover:bg-opacity-85 `}
        />
    );
}
