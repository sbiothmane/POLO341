// pages/api/polls/create.js

import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { question, choices, instructor } = req.body;

  try {
    const pollsCollection = collection(db, 'polls');
    await addDoc(pollsCollection, {
      question,
      choices: choices.map(choice => ({ text: choice, votes: 0 })),
      instructor,
    });

    res.status(201).json({ message: 'Poll created successfully' });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
}
