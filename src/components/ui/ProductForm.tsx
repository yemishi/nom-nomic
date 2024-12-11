"use client"

import { motion } from "framer-motion"
import { useState } from "react";
import Input from "./Input";
import { FormFields, useForm } from "@/custom-hooks/useForm";
import Button from "./Button";
import Image from "./Image";
import { parseToCurrency } from "@/utils/formatting";





export type FormProductValues = { name: string, tags: string[], ingredients: string[], pics: FileList[], price: number, stock: number, desc?: string, sale?: number, picsToDel?: string[] }
interface FormProps {
    isLoading: boolean;
    submitMsg?: string;
    prevValues?: {
        name: string,
        stock: number,
        price: number,
        tags: string[],
        ingredients: string[]
        pics: string[],
        sale?: number,
        desc?: string,
    }
    onSubmit: (values: FormProductValues) => void
    children?: React.ReactNode
}
export default function ProductForm({ isLoading, submitMsg, onSubmit, children, prevValues }: FormProps) {
    const getPrevValue = (field: "name" | "stock" | "price" | "tags" | "ingredients" | "pics" | "sale" | "desc", value: "string" | "array") => {
        if (!prevValues || prevValues[field] === undefined) return value === "array" ? [] : ""
        return prevValues[field]
    }
    const [pics, setPics] = useState([] as { files: FileList; demo: string }[]);
    const [picsToDel, setPicsToDel] = useState<string[]>()
    const inputs = [
        { name: "name", label: "Product Name" },
        { name: "stock", label: "Stock", type: "number" },
        { name: "desc", label: "Description", type: "textarea" },
        { name: "price", label: "Price" },
        { name: "sale", label: "Sale" }
    ];
    const initialValues: FormFields = {
        name: { value: getPrevValue("name", "string"), min: { value: 1, msg: "This field is required" } },
        stock: { value: getPrevValue("stock", "string"), min: { value: 1, msg: "Minimum stock 1" } },
        desc: { value: getPrevValue("desc", "string") },
        price: { value: getPrevValue("price", "string"), min: { value: 1, msg: "This field is required" } },
        ingredients: { value: getPrevValue("ingredients", "array"), min: { value: 1, msg: "requires at least 1 ingredient" } },
        tags: { value: getPrevValue("tags", "array"), min: { value: 1, msg: "requires at least 1 tag" } },
        sale: { value: getPrevValue("sale", "string") },
    }


    const { errors, onChange, resetForm, validateAll, values, setValue, } = useForm(initialValues)


    const addPic = (value: { files: FileList; demo: string }) => setPics((prev) => ([...prev, value]))
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return

        const reader = new FileReader();
        reader.onloadend = () => {
            if (e.target.files && e.target.files.item !== null) {
                addPic({ demo: reader.result as string, files: e.target.files })
            }
        };
        reader.readAsDataURL(file)
    }
    const setValues = () => {
        const p = parseFloat(String(values.price).replace(/[^0-9.-]/g, ''));
        const s = values.sale && parseFloat(String(values.sale).replace(/[^0-9.-]/g, ''))
        if (values.price) setValue("price", p)
        if (s) setValue("sale", s)

    }

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault()
        const additionalValues = {
            pics: pics.map((i) => i.files),
        };
        if (validateAll()) {
            const finalValues = { ...values, ...additionalValues } as FormProductValues;
            onSubmit(finalValues);
            resetForm()
        }
    };


    return <motion.form className="flex flex-col gap-2 h-full w-full" onSubmit={submitForm}>
        {inputs.map(({ name, label, type = "text" }, index) => {
            return <Input key={`${name}-${index}`} value={values[name]} onChange={(e) => onChange(e, name === "price" || name === "sale" ? parseToCurrency(e.target.value) : undefined)} error={errors[name] as string} name={name}
                label={label} disabled={isLoading} type={type} parentClass={index > 0 ? "mt-3" : ""} />
        })}


        <span className="font-bold mt-3">Pics</span>
        <div className="flex flex-wrap gap-3 items-center">
            <label htmlFor="file" className="bg-gray-700 bg-opacity-20 p-2 border size-16 rounded-md hover:opacity-85 active:bg-opacity-40 cursor-pointer">
                <Image src="/cam.svg" className="size-full object-cover" />
            </label>
            <input type="file" id="file" className="hidden" onChange={fileChange} />
            {prevValues && prevValues?.pics.map((pic, index) => (
                <div className={`relative size-16 ${picsToDel?.find((e) => e === pic) ? "grayscale" : ""}`} key={`${pic}-${index}`}>
                    <Image src={pic} className="object-cover size-full rounded" />
                    <button type="button" onClick={() => setPicsToDel((prev) => prev?.find((i) => i === pic) ? prev.filter((i) => i !== pic) : [...prev as string[], pic])}
                        className="p-5 font-nunito font-bold text-2xl absolute h-full w-full opacity-0 duration-100 hover:opacity-100 top-0 left-0 text-red-600 bg-black bg-opacity-80 backdrop-blur-sm rounded">
                        <Image src="/trash.svg" />
                    </button>
                </div>
            ))}

            {pics.map(({ demo, files }, index) => (
                <div className="relative size-16 " key={`${files.item(0)?.name}-${index}`}>
                    <Image src={demo} className="object-cover size-full rounded" />
                    <button type="button" onClick={() => setPics((prev) => prev.filter((_, i) => i !== index))} className="p-5 font-nunito font-bold text-2xl absolute h-full w-full opacity-0 
                    duration-100 hover:opacity-100 top-0 left-0 text-red-600 bg-black bg-opacity-80 backdrop-blur-sm rounded">
                        <Image src="/trash.svg" />
                    </button>
                </div>
            ))}
        </div>

        <span className="font-bold mt-3">Tags</span>
        <div className="flex gap-3 flex-wrap bg-gray-600 bg-opacity-20 p-2 rounded">
            {Array.from(values.tags as string[]).map((tag, index) => (
                <div key={index} className="p-2 rounded-md bg-primary-700 relative pr-4">
                    {tag}
                    <button type="button" onClick={() => setValue("tags", Array.from(values.tags as string[]).filter((_, i) => i !== index))}
                        className="absolute right-0 top-0 size-4 pl-[2px] border-l border-b rounded-bl-md">
                        <Image src="/trash.svg" />
                    </button>
                </div>
            ))}
            <Input parentClass={errors.tags ? "" : "w-max"} error={errors.tags as string} type="text" placeholder="Sweet" name="tags" onBlur={(e) => {
                if (e.target.value) onChange(e, [...values.tags as string[], e.target.value])
            }} className="border border-dotted rounded-md px-2 py-1 !w-32" />
        </div>

        <span className="font-bold mt-3">Ingredients</span>
        <div className="flex gap-3 flex-wrap bg-gray-600 bg-opacity-20 p-2 rounded">
            {Array.from(values.ingredients as string[]).map((ingredient, index) => (
                <div key={index} className="p-2 rounded-md bg-primary-700 relative pr-4">
                    {ingredient}
                    <button type="button" onClick={() => setValue("ingredients", Array.from(values.ingredients as string[]).filter((_, i) => i !== index))}
                        className="absolute right-0 top-0 size-4 pl-[2px] border-l border-b rounded-bl-md"  >
                        <Image src="/trash.svg" />
                    </button>
                </div>
            ))}
            <Input parentClass={errors.ingredients ? "" : "w-max"} error={errors.ingredients as string} type="text" placeholder="Tomato" name="ingredients" onBlur={(e) => {
                if (e.target.value) onChange(e, [...values.ingredients as string[], e.target.value])
            }} className="border border-dotted rounded-md px-2 py-1 !w-32" />
        </div>

        {children}
        <Button disabled={isLoading} onClick={setValues} type="submit" className="mt-auto self-center py-4 w-3/4 font-bold">
            {submitMsg || "Submit"}
        </Button>
    </motion.form >
}