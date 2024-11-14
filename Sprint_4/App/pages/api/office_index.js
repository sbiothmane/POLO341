// pages/api/office-hours.js

import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const officeHoursCollection = collection(db, 'officeHours');
      const snapshot = await getDocs(officeHoursCollection);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate().toISOString(),
        end: doc.data().end.toDate().toISOString(),
      }));

      data.sort((a, b) => new Date(a.start) - new Date(b.start));
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      res.status(500).json({ error: 'Error fetching office hours' });
    }
  } else if (req.method === 'POST') {
    const { slots, username } = req.body;

    if (!slots || !username) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      const officeHoursCollection = collection(db, 'officeHours');
      for (const slot of slots) {
        await addDoc(officeHoursCollection, {
          username,
          start: Timestamp.fromDate(new Date(slot.start)),
          end: Timestamp.fromDate(new Date(slot.end)),
          reserved: false,
          reservedBy: null,
        });
      }
      res.status(201).json({ message: 'Office hours created successfully' });
    } catch (error) {
      console.error('Error creating office hours:', error);
      res.status(500).json({ error: 'Error creating office hours' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
