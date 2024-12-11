import Input from "../ui/Input";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import { FormFields, FormFieldValues, useForm } from "@/custom-hooks/useForm";




interface FormProps<T extends FormFields> {
    initialValues: T;
    onSubmit: (values: FormFieldValues<T>) => void
    inputs: Array<{ name: string; label: string; type?: string }>;
    isError?: string;
    submitMsg?: string;
    isLoading?: boolean;
    motionKey?: string;
    animate?: "left" | "right" | { initial: object; animate: object; exit: object };
    children?: React.ReactNode;
}

export default function Form<T extends FormFields>({
    initialValues,
    onSubmit,
    inputs,
    isError,
    submitMsg,
    isLoading,
    motionKey,
    animate,
    children,
}: FormProps<T>) {
    const { values, errors, onChange, validateAll, resetForm } = useForm<typeof initialValues>(initialValues);
    const variant = {
        initial: { x: animate === "left" ? "-100%" : "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: animate === "left" ? "100%" : "-100%", opacity: 0 },
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateAll()) {
            onSubmit(values);
            resetForm()
        }
    };

    return (
        <motion.form
            key={motionKey}
            onSubmit={handleSubmit}
            variants={animate ? variant : {}}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-3/4 flex flex-col items-center py-2 gap-3 mt-10 h-full pb-7"
        >
            {inputs.map(({ name, label, type = "text" }, index) => (
                <Input
                    key={index}
                    name={name}
                    label={label}
                    type={type}
                    value={values[name] || ""}
                    onChange={onChange}
                    disabled={isLoading}
                    error={errors[name] || undefined}
                    parentClass={index > 0 ? "mt-4" : ""}
                />
            ))}

            {isError && <span className="self-end text-red-400 text-sm">{isError}</span>}
            {children}
            <Button disabled={isLoading} type="submit" className="mt-auto py-4 w-3/4 font-bold">
                {submitMsg || "Submit"}
            </Button>
        </motion.form>
    );
}
