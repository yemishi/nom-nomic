
import { useState } from "react";
import { FormFields } from "@/custom-hooks/useForm";
import { signIn } from "next-auth/react";
import Form from "../ui/Form";
import useFetch from "@/custom-hooks/useFetch";

export default function SignUpForm({ animate, motionKey, goBack }: { animate?: "left" | "right", motionKey?: string, goBack?: () => void }) {
    const [isError, setIsError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const initialValues: FormFields = {
        email: { value: "", min: { value: 1, msg: "This Field has to be filled" }, emailMsg: "This isn't a valid email." },
        name: { value: "", min: { value: 1, msg: "This Field has to be filled" } },
        password: { value: "", min: { value: 1, msg: "This field has to be filled." }, },
        confirmPass: { value: "", min: { value: 1, msg: "This field has to be filled." }, compareField: { msg: "This field must be the same as password", field: "password" } }
    }
    const { mutateAsync: createUser } = useFetch("createUser");


    const onSubmit = async (values: Record<string, string | number | string[]>) => {
        setIsError("");
        setIsLoading(true)
        const response = await createUser({
            email: values.email as string,
            name: values.name as string,
            password: values.password as string
        });
        setIsLoading(false)
        if (response.isError) {
            return setIsError(response.message);
        }

        const sigIn = await signIn("credentials", { email: response.email, password: response.password, redirect: false })
        if (!sigIn?.ok) return
        if (goBack) goBack()

    }
    return <Form
        key={motionKey}
        animate={animate}
        initialValues={initialValues}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isError={isError}
        inputs={[
            { name: "name", label: "Your name", type: "name" },
            { name: "email", label: "Your Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
            { name: "confirmPass", label: "Confirm password", type: "password" }
        ]}
    >

    </Form>
};

