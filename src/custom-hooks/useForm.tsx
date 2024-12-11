import { useState } from "react";

interface ValidationRule {
    value?: number;
    msg: string;
}

interface Field {
    value: string | number | string[];
    validate?: (value: string | number) => string | null;
    compareField?: { msg: string, field: string }
    min?: ValidationRule;
    max?: ValidationRule;
    emailMsg?: string;
}

export type FormFields = Record<string, Field>;
export type FormFieldValues<T extends FormFields> = {
    [K in keyof T]: T[K]["value"];
};

export const useForm = <T extends FormFields>(initialValues: FormFields) => {

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const filteredValues = Object.fromEntries(
        Object.entries(values).map(([key, field]) => [key, field.value])
    ) as FormFieldValues<T>;

    const handleError = (field: string, msg: string | null) => setErrors((e) => ({ ...e, [field]: msg }));

    const validateField = (name: string, value: string | number | string[]): string | null => {
        const field = values[name];
        if (!field) return null;

        const { compareField, emailMsg, max, min, validate } = field;
        const filteredValue = typeof (value) === "number" ? value : value.length
        if (max && filteredValue > max.value!) return max.msg;
        if (min && filteredValue < min.value!) return min.msg;
        if (emailMsg && !regex.test(String(value))) return emailMsg;
        if (validate && !Array.isArray(value)) return validate(value);
        if (compareField) {
            const fieldToCompare = values[compareField.field]
            if (!fieldToCompare) return "field didn't find"
            if (fieldToCompare.value !== value) return compareField.msg
        }

        return null;
    };

    const validateAll = () => {
        const newErrors: Record<string, string | null> = {};

        for (const name in values) {
            const fieldValue = values[name].value

            const error = validateField(name, fieldValue);
            newErrors[name] = error;
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => !err);
    };

    const onChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>, customValue?: string | number | string[]) => setValue(name, customValue ? customValue : value);
    const setValue = (fieldName: string, value: string | number | string[]) => {
        const field = values[fieldName];
        if (field) {
            setValues((e) => ({ ...e, [fieldName]: { ...field, value } }));
            const error = validateField(fieldName, value);
            handleError(fieldName, error);
        }
    }

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };
    const fieldKeys = Object.keys(values)
    return { fieldKeys, rawValues: values, values: filteredValues, errors, onChange, validateAll, resetForm, setValue };
};
