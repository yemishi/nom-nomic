import { useState } from "react";
import { signIn } from "next-auth/react";
import Form from "../ui/Form";

export default function SignInForm({
    animate,
    motionKey,
    goBack,
}: {
    animate?: "left" | "right";
    motionKey?: string;
    goBack?: () => void;
}) {
    const [isError, setIsError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const initialFields = {
        email: {
            value: "",
            emailMsg: "This isn't a valid email.",
            min: { value: 1, msg: "This field has to be filled." },
        },
        password: {
            value: "",
            min: { value: 1, msg: "This field has to be filled." },
        },
    };

    const onSubmit = async (formValues: { email: string, password: string }) => {
        setIsError("");
        setIsLoading(true)

        const response = await signIn("credentials", {
            email: formValues.email,
            password: formValues.password,
            redirect: false,
        });

        setIsLoading(false);

        if (response && !response.ok) {
            return setIsError("Invalid credentials. Please try again.");
        }

        if (goBack) goBack();
    };

    return (
        <Form
            motionKey={motionKey}
            animate={animate}
            initialValues={initialFields}
            onSubmit={onSubmit}
            isError={isError}
            isLoading={isLoading}
            inputs={[
                { name: "email", label: "Your Email", type: "email" },
                { name: "password", label: "Password", type: "password" },
            ]}
        >
            <button type="button" className="self-start text-gold-700 font-bold">
                Forgot password?
            </button>
        </Form>
    );
}
