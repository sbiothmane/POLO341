// pages/api/office-hours.js

import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { instructor } = req.query;

    if (!instructor) {
      return res.status(400).json({ error: 'Instructor name is required' });
    }

    try {
      const officeHoursCollection = collection(db, 'officeHours');
      const q = query(officeHoursCollection, where('username', '==', instructor));
      const querySnapshot = await getDocs(q);
      
      const hours = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          start: data.start.toDate().toISOString(),
          end: data.end.toDate().toISOString(),
        };
      });

      hours.sort((a, b) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateA - dateB;
      });

      res.status(200).json(hours);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      res.status(500).json({ error: 'Error fetching office hours' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
