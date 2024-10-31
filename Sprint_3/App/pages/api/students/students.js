import { db } from '../../../lib/firebase'; // Firestore config
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // Reference to the users collection in Firestore
    const usersCollection = collection(db, 'users');

    // Query to get only users with the role 'student'
    const q = query(usersCollection, where('role', '==', 'student'));

    // Fetch the documents
    const querySnapshot = await getDocs(q);

    // Extract the name and id for each student
    const students = querySnapshot.docs.map(doc => ({
      id: doc.data().id, // Assuming 'id' field exists in each user document
      name: doc.data().name, // Assuming 'name' field exists in each user document
      username: doc.data().username, // Assuming 'username' field exists in each user document
    }));

    // Respond with the list of students
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
}
