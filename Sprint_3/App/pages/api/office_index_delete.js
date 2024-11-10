// pages/api/office-hours-delete.js

import { db } from '../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const officeHourDoc = doc(db, 'officeHours', id);
      await deleteDoc(officeHourDoc);

      res.status(200).json({ message: 'Office hour deleted successfully' });
    } catch (error) {
      console.error('Error deleting office hour:', error);
      res.status(500).json({ error: 'Error deleting office hour' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
