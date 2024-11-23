import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; // Use bcryptjs
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { createFakeStudents } from '../makeFakeStudents'; 
import Credentials from 'next-auth/providers/credentials';
console.log(CredentialsProvider);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        
        console.log('Credentials, username:', username);
        console.log('Credentials, password:', password);  
        try {
          // Reference to the user document
          const userDocRef = doc(db, 'users', username);
          const userDocSnap = await getDoc(userDocRef);
          
          if (!userDocSnap.exists()) {
            console.log('User not found');
            return null;
          }

          const userData = userDocSnap.data();

          // Compare the entered password with the hashed password in Firestore
          const isPasswordValid = await bcrypt.compare(password, userData.password);
          console.log('hashed password', await bcrypt.hash(password, 10))
          console.log ('userData.password', userData.password)  
          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          // Return user object (you can include other user data as needed)
          return {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            role: userData.role,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // Session expiration time (1 hour)
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
    maxAge: 60 * 60, // JWT expiration time (1 hour)
  },
  pages: {
    signIn: '/login', // Your custom login page path
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  debug: true, // Enable debug logs
});