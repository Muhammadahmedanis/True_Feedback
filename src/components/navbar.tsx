'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';


export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:px-20 shadow-lg bg-gray-100 text-white">
        <div className='container flex flex-row justify-between items-center'>
            <a href="#" className="text-xl font-bold mb-4 md:mb-0 text-black">True Feedback</a>
            {
                session ? 
                ( <> <span className="mr-4 text-black font-semibold">Welcome, {user?.userName?.toLocaleUpperCase() || user?.email}</span> <Button className="w-full md:w-auto text-white cursor-pointer bg-black" variant='outline' onClick={() => signOut()}>Logout</Button> </> ) : 
                ( <Link href='/sign-in'> <Button className="w-full md:w-auto text-white cursor-pointer bg-black" variant={'outline'}>Login</Button> </Link> )
            }
        </div>
    </nav>
  )
}
