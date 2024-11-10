// pages/api/polls/end.js

import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { instructor } = req.body;

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const pollsCollection = collection(db, 'polls');
    const q = query(pollsCollection, where('instructor', '==', instructor));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    res.status(200).json({ message: 'Poll ended successfully' });
  } catch (error) {
    console.error('Error ending poll:', error);
    res.status(500).json({ error: 'Failed to end poll' });
  }
}
