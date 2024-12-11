import { ForwardedRef, InputHTMLAttributes, forwardRef, useState } from "react";
import Image from "./Image";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | undefined;
    noMessage?: boolean;
    parentClass?: string
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
        label,
        className,
        error,
        id,
        onChange,
        noMessage,
        value,
        parentClass,
        ...rest
    } = props;

    const [watchValue, setWatchValue] = useState(value)
    const [type, setType] = useState(rest.type || "text")
    const isTextarea = rest.type === "textarea"

    const style = `${className || ""} bg-transparent w-full border-b-2 ${!error ? "border-white" : "border-red-300"}
    ${rest.type === "password" ? "pr-10" : ""}  border-opacity-80 focus:border-opacity-100
    outline-none font-semibold py-1 disabled:animate-pulse`

    const handleOnChange = (e: any) => {
        if (onChange) onChange(e)
        setTimeout(() => { setWatchValue(e.target.value) }, 1)
    }
    return (
        <div className={`relative font-semibold w-full ${error && "text-red-400" || ""} ${parentClass || ""} `}>
            {isTextarea ? <textarea {...rest as any} id={rest.name} value={value} onChange={handleOnChange} className={`${style} bg-gray-600 bg-opacity-20 p-2 rounded-t-md`}
                ref={ref as ForwardedRef<HTMLInputElement & HTMLTextAreaElement>} /> :
                <input {...rest} value={value} onChange={handleOnChange} ref={ref} id={rest.name} className={style} type={type} autoComplete="off" />}

            {label && <label htmlFor={rest.name} className={`absolute duration-150 ${watchValue ? "!bottom-full text-xs opacity-75" : ""} ${rest.disabled && "animate-pulse" || ""} 
          ${isTextarea ? "left-2 bottom-2/4" : "left-0 bottom-1"}`}>
                {label}
            </label>}
            {rest.type === "password" && <Image src="/cooking.svg" alt="cooking"
                className={`${type === "password" ? "grayscale opacity-70" : ""} absolute duration-150 right-0 -top-2.5 size-9 cursor-pointer`} onClick={() => setType(type === "password" ? "text" : "password")} />}
            {error && <span className="absolute right-0 bottom-full text-sm">
                {error}
            </span>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
