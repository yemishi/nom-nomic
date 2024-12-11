import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { name, tags, ingredients, desc, pics, price, sale, stock } = await req.json()

        await db.product.create({
            data: {
                tags, name, price, stock, desc, ingredients, pics, sale
            }
        })

        return NextResponse.json({ message: "Product created successfully", status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "An error occurred. Please try again later.", status: 500 })

    }

}