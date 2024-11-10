// pages/api/office-hours-update.js

import { db } from '../../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id, reserved, reservedBy } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const officeHourDoc = doc(db, 'officeHours', id);
      await updateDoc(officeHourDoc, {
        reserved,
        reservedBy: reserved ? reservedBy : null,
      });

      res.status(200).json({ message: 'Office hour updated successfully' });
    } catch (error) {
      console.error('Error updating office hour:', error);
      res.status(500).json({ error: 'Error updating office hour' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
