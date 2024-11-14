// pages/api/polls/check.js

import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const { instructor } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const pollsCollection = collection(db, 'polls');
    const q = query(pollsCollection, where('instructor', '==', instructor));
    const querySnapshot = await getDocs(q);

    // Check if any active poll exists for this instructor
    const activePoll = querySnapshot.docs.length > 0;
    res.status(200).json({ activePoll });
  } catch (error) {
    console.error('Error checking active poll:', error);
    res.status(500).json({ error: 'Failed to check active poll' });
  }
}
