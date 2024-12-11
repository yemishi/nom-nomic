"use client"
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function Provider({ children, session }: { children: React.ReactNode, session: Session | null }) {
    return <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>

            {children}
        </QueryClientProvider>
    </SessionProvider>
}