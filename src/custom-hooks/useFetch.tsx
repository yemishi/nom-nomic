import { useMutation } from '@tanstack/react-query';

type QueryNames = 'getUser' | 'createUser' | "createProduct";

type QueryArgs = {
    getUser: { email: string; password: string };
    createUser: { name: string; email: string; password: string };
    createProduct: { name: string, tags: string[], ingredients: string[], pics: string[], stock: number, sale?: number, desc?: string, }
};
type DefaultResponse = {
    message: string,
    status: number,
    isError?: false
}

type ErrorType = {
    message: string,
    status: number,
    isError: true
}
type QueryResponse = {
    getUser: DefaultResponse & {
        name: string,
        email: string,
        id: string
    } | ErrorType;
    createUser: DefaultResponse & { password: string, email: string } | ErrorType,
    createProduct: DefaultResponse

}

const isError = (status: number): boolean => {
    return status < 200 || status >= 300;
};

const userFetch = {
    getUser: async ({ email, password }: { email: string; password: string }) => {
        const response = await fetch(`/api/user?email=${email}&password=${password}`).then((res) => res.json())
        return { ...response, isError: isError(response.status) }
    },
    createUser: async ({ name, email, password }: { name: string, email: string, password: string }) => {
        const response = await fetch(`/api/user`, { body: JSON.stringify({ name, password, email }), method: "POST" }).then((res) => res.json())
        return { ...response, isError: isError(response.status) }
    }
}

const productFetch = {
    createProduct: async (values: { name: string, tags: string[], ingredients: string[], pics: string[], stock: number, sale?: number, desc?: string, }) => {
        const response = await fetch('/api/product', { body: JSON.stringify({ ...values }), method: "POST" }).then((res) => res.json())
        return { ...response, isError: isError(response.status) }
    }
}

const queryFunctions: {
    [T in QueryNames]: (args: QueryArgs[T]) => Promise<QueryResponse[T]>;
} = {
    getUser: userFetch.getUser,
    createUser: userFetch.createUser,
    createProduct: productFetch.createProduct
};

export default function useFetch<T extends QueryNames>(
    queryName: T,
) {
    if (queryName in queryFunctions) {
        return useMutation({
            mutationFn: (args: QueryArgs[T]) => queryFunctions[queryName](args),
        });
    }
    throw new Error(`Query function "${queryName}" does not exist.`);
}