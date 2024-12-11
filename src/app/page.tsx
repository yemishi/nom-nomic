"use client"

import { useSession } from "next-auth/react";

export default function Home() {
  const user = useSession().data?.user
  return (
    <div className="flex flex-col  w-full justify-center items-center">
      <span>Home page</span>
      {user && <div className="flex flex-col">
        <span>{user.email}</span>
        <span>{user.name}</span>
      </div>}

    </div>
  );
}
