import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "./db";
import { compareSync } from "bcrypt";

export type UserToken = {
    name: String;
    email: String;
    picture: String;
    password?: String;
};

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Name", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                try {
                    const user = await db.user.findFirst({ where: { email: credentials.email } })
                    if (!user) return null


                    const isCorrectPass = compareSync(credentials.password, user.password)
                    if (!isCorrectPass) return null

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };

                } catch (error) {
                    return null
                }

            },
        }),
    ],

    callbacks: {
        async jwt({ token, trigger, session }) {
            if (trigger === "update" && session) {
                token.name = session.name || token.name;
                token.picture = session.picture || token.picture;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                email: token.email as string,
                name: token.name as string,
            };
            return session;
        },
        redirect({ baseUrl, url }) {
            return `${baseUrl}/login`;
        },
    },
};
