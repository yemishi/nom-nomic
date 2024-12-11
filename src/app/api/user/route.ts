import { NextRequest, NextResponse } from "next/server";
import { hashSync, compareSync } from "bcrypt"
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email") as string
    const password = req.nextUrl.searchParams.get("password") as string

    if (!email || !password) return NextResponse.json({ message: "All fields are required", status: 400 })
    try {
        const user = await db.user.findFirst({ where: { email } })
        if (!user) return NextResponse.json({ message: "User not found", status: 404 })

        const isCorrectPass = compareSync(password, user.password)
        if (!isCorrectPass) return NextResponse.json({ message: "Email or password incorrect", status: 400 })

        return NextResponse.json({ email: user.email, name: user.name, id: user.id, message: "User info found successfully", status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "An error occurred. Please try again later.", status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()
        if (!name || !email || !password) return NextResponse.json({ message: "All fields are required ", status: 400 })

        const existingUser = await db.user.findFirst({ where: { email } })
        if (existingUser) return NextResponse.json({ message: "User already exists", status: 400 })

        const hashedPass = hashSync(password, 10)
        await db.user.create({
            data: {
                email, name, password: hashedPass
            }
        })
        return NextResponse.json({ password, email, message: "User created successfully", status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "An error occurred. Please try again later.", status: 500 })
    }
}
