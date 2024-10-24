'use client';
import React from 'react';  // Import React

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
