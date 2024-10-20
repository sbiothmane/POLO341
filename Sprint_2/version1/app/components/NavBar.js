import Link from 'next/link';
import Signout from './Signout';  
import { useSession } from "next-auth/react";

export default function NavBar() {
    const { data: session } = useSession();
    const user = session?.user;
    return (
        // Navbar
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/">
                <div className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
                Peer Assessment System
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.name}</span>
                <Signout />
              </div>
            </div>
          </div>
        </header>
    );
}