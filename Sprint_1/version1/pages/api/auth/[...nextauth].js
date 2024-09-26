// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import {users, updateUsersArray} from '../users/users';

export default NextAuth({
  
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Ensure users array is up to date
        if (users.length === 0) {
          await updateUsersArray();
        }
        const user = users.find(
          (user) =>
            user.username === credentials.username &&
            user.password === credentials.password
        );

        if (user) {
          // Return user object (you can include other user properties if needed)
          return { id: user.username, name: user.username };
        } else {
          // Return null if user not found
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Path to your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
});
