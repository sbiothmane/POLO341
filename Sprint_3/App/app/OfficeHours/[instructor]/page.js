'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ViewOfficeHours = ({ params }) => {
  const [instructorName, setInstructorName] = useState(params.instructor);
  const [officeHours, setOfficeHours] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (instructorName) {
      fetchOfficeHours();
    }
  }, [instructorName]);

  const fetchOfficeHours = async () => {
    setLoading(true);
    try {
      const officeHoursCollection = collection(db, 'officeHours');
      const q = query(officeHoursCollection, where('username', '==', instructorName));
      const querySnapshot = await getDocs(q);
      const hours = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      hours.sort((a, b) => {
        const dateA = a.start.toDate();
        const dateB = b.start.toDate();
        if (dateA.toDateString() === dateB.toDateString()) {
            return dateA - dateB; // Sort by time if dates are the same
        } else {
            return dateA - dateB; // Sort by date
        }
    });
      setOfficeHours(hours);
    } catch (error) {
      console.error("Error fetching office hours: ", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (hours) => {
    return hours.reduce((groups, slot) => {
      const date = slot.start.toDate().toLocaleDateString('en-US', {
        weekday: 'long', // Day of the week
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {});
  };

  const reserveOfficeHour = async (slotId, isReserved) => {
    if (!session || !session.user) {
      alert('You need to be logged in to reserve or unreserve office hours.');
      return;
    }

    try {
      const officeHourRef = doc(db, 'officeHours', slotId);
      await updateDoc(officeHourRef, {
        reserved: !isReserved,
        reservedBy: !isReserved ? session.user.username : null,
      });
      fetchOfficeHours();
    } catch (error) {
      console.error("Error updating office hour: ", error);
      alert('Failed to update the office hour. Please try again.');
    }
  };

  const groupedOfficeHours = groupByDate(officeHours);

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="p-4 bg-white w-full h-full mx-auto rounded-lg shadow-lg flex flex-col justify-between">
        <h1 className="text-3xl text-white font-bold mb-4 bg-customBlue p-2 border rounded-md shadow-sm border-black-400 flex items-center justify-center">Office Hours for {instructorName}</h1>

        {loading && <p className="mt-4 text-gray-700">Loading...</p>}

        {Object.keys(groupedOfficeHours).length > 0 ? (
          <div className="mt-4 space-y-4 overflow-y-auto">
            {Object.entries(groupedOfficeHours).map(([date, slots]) => (
              <div key={date} className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{date}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {slots.map((slot) => {
                    const startTime = slot.start.toDate();
                    const endTime = slot.end.toDate();
                    const startFormatted = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endFormatted = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div
                        key={slot.id}
                        onClick={() => reserveOfficeHour(slot.id, slot.reserved)}
                        className={`p-2 border rounded-md shadow-sm cursor-pointer ${
                          slot.reserved ? 'bg-customGreen text-white border-green-700' : 'bg-customRed text-white border-red-400'
                        } flex items-center justify-center`}
                      >
                        <p className="text-sm font-medium">
                          {`${startFormatted} - ${endFormatted} : `}
                        </p>
                        <p className="text-sm font-medium">
                          {slot.reserved ? ` Reserved` : ' Available'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-700">No office hours available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewOfficeHours;
