"use client"
import SignInForm from '@/components/form/SignIn';
import Image from '@/components/ui/Image';
import { useState } from 'react';
import SignUpForm from '@/components/form/SignUp';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const [isSignIn, setIsSigIn] = useState(true)
    const { push } = useRouter()
    const goBack = () => {
        const url = new URLSearchParams(window.location.search).get("from");
        const finalUrl = url ? decodeURIComponent(url) : "";

        push(finalUrl.startsWith("/") ? finalUrl : `/${finalUrl}`);
    }
    return (
        <div className='flex flex-col items-center h-full w-full gap-5 text-lg '>
            <div className='w-full flex flex-col bg-gray-300 rounded-b-[40px] px-5 pt-10 gap-10 text-black'>
                <Image className='size-56 self-center mt-auto' src="/chefHat.svg" alt='chef hat' />
                <div className='font-extrabold px-14 gap-3 w-full mt-auto grid grid-cols-2 '>
                    <button onClick={() => setIsSigIn(true)} className={`${isSignIn && "text-gold-900" || ""} duration-150 p-2`}>Sign-in</button>
                    <button onClick={() => setIsSigIn(false)} className={`${!isSignIn && "text-gold-900" || ""} duration-150 pb-2`}>Sign-up</button>
                </div>
            </div>
            <AnimatePresence mode='wait' initial={false}>
                {isSignIn && <SignInForm animate='left' motionKey='signIn' goBack={goBack} />}
                {!isSignIn && <SignUpForm animate='right' motionKey='signUp' goBack={goBack} />}

            </AnimatePresence>
        </div>
    );
}