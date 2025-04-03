'use client'

import Link from "next/link";
export default function NavLink({href, children}){
    return (
        <div className="flex">
            <Link
                href={href}
                    className="flex radial-gradient h-20 w-20 rounded-full items-center justify-center"
                >
                    {children}
            </Link>
        </div>
        
    );
}