// pages/api/check-availability.js

import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, id } = req.body;

    try {
      // Reference to the 'users' collection
      const usersRef = collection(db, 'users');

      // Create queries to check for existing username and ID
      const usernameQuery = query(usersRef, where('username', '==', username));
      const idQuery = query(usersRef, where('id', '==', id));

      // Execute the queries
      const [usernameSnapshot, idSnapshot] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(idQuery),
      ]);

      // Check if username or ID already exists
      const isUsernameTaken = !usernameSnapshot.empty;
      const isIdTaken = !idSnapshot.empty;

      if (isUsernameTaken || isIdTaken) {
        return res.status(200).json({
          available: false,
          usernameAvailable: !isUsernameTaken,
          idAvailable: !isIdTaken,
        });
      } else {
        return res.status(200).json({
          available: true,
          usernameAvailable: true,
          idAvailable: true,
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
