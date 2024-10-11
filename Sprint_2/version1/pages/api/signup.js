import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { db } from '../../lib/firebase';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, role, id, name } = req.body;

    try {
      // Check if the username or ID already exists
      const usersRef = collection(db, 'users');

      // Query for existing username
      const usernameQuery = query(usersRef, where('username', '==', username));
      const usernameSnapshot = await getDocs(usernameQuery);

      // Query for existing ID
      const idQuery = query(usersRef, where('id', '==', id));
      const idSnapshot = await getDocs(idQuery);

      if (!usernameSnapshot.empty) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      if (!idSnapshot.empty) {
        return res.status(400).json({ message: 'ID already exists' });
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed

      // Create a new user document with the username as the document ID
      await setDoc(doc(db, 'users', username), {
        username,
        password: hashedPassword,
        role,
        id,
        name,
      });

      // Respond with a success message
      res.status(200).json({ message: 'User signed up successfully!' });
    } catch (error) {
      console.error('Error writing to Firestore:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
