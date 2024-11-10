// pages/api/polls.js

import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question, choices, instructor } = req.body;

    // Validate the data to ensure minimum structure
    if (!question || !choices || choices.length < 2) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      // Save the poll to Firebase
      const pollsCollection = collection(db, 'polls');
      const pollDoc = await addDoc(pollsCollection, {
        question,
        choices: choices.map((choice) => ({ text: choice, votes: 0 })),
        instructor,
        createdAt: new Date(),
      });

      res
        .status(201)
        .json({ message: 'Poll created successfully', id: pollDoc.id });
    } catch (error) {
      console.error('Error creating poll:', error);
      res.status(500).json({ error: 'Error creating poll' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
