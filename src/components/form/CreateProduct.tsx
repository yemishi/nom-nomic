import useFetch from "@/custom-hooks/useFetch";
import ProductForm, { FormProductValues } from "../ui/ProductForm";

export default function CreateProduct() {
    const { mutateAsync: createProduct } = useFetch("createProduct")
    const onSubmit = async (values: FormProductValues) => {

        console.log(values)
    };
    return <div className="w-full h-full p-7 items-center justify-center ">
        <ProductForm onSubmit={onSubmit} isLoading={false}>

        </ProductForm>
    </div>
}