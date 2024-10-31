'use client'

import { signOut, useSession } from "next-auth/react";

export default function SignOutButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out"
      >
        Sign Out
      </button>
    );
  }

  return null;  // No sign-out button if not authenticated
}