// app/components/ViewOfficeHours.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const ViewOfficeHours = ({ params }) => {
  const [instructorName, setInstructorName] = useState(params.instructor);
  const [officeHours, setOfficeHours] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (instructorName) {
      fetchOfficeHours();
    }
  }, [instructorName]);

  const fetchOfficeHours = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/office-hours/office-hours?instructor=${instructorName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch office hours');
      }
      const hours = await response.json();

      // Parse the start and end times into Date objects
      const parsedHours = hours.map((hour) => ({
        ...hour,
        start: new Date(hour.start),
        end: new Date(hour.end),
      }));

      parsedHours.sort((a, b) => {
        if (a.start.toDateString() === b.start.toDateString()) {
          return a.start - b.start; // Sort by time if dates are the same
        } else {
          return a.start - b.start; // Sort by date
        }
      });

      setOfficeHours(parsedHours);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      toast.error('Error fetching office hours');
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (hours) => {
    return hours.reduce((groups, slot) => {
      const date = slot.start.toLocaleDateString('en-US', {
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
      toast.error('You need to be logged in to reserve or unreserve office hours.');
      return;
    }

    try {
      const response = await fetch('/api/office-hours/office-hours-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: slotId,
          reserved: !isReserved,
          reservedBy: !isReserved ? session.user.username : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the office hour');
      }

      toast.success(`Office hour ${isReserved ? 'unreserved' : 'reserved'} successfully.`);
      fetchOfficeHours();
    } catch (error) {
      console.error('Error updating office hour:', error);
      toast.error('Failed to update the office hour. Please try again.');
    }
  };

  const groupedOfficeHours = groupByDate(officeHours);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Office Hours for {instructorName}
        </h1>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          </div>
        )}

        {Object.keys(groupedOfficeHours).length > 0 ? (
          <div className="mt-4 space-y-8">
            {Object.entries(groupedOfficeHours).map(([date, slots]) => (
              <div key={date}>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{date}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {slots.map((slot) => {
                    const startTime = slot.start;
                    const endTime = slot.end;
                    const startFormatted = startTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const endFormatted = endTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const isReservedByCurrentUser =
                      session && session.user && slot.reservedBy === session.user.username;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => reserveOfficeHour(slot.id, slot.reserved)}
                        className={`p-6 border rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                          slot.reserved
                            ? 'bg-red-500 text-white border-red-600'
                            : 'bg-green-500 text-white border-green-600'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {slot.reserved ? (
                            <FaTimesCircle className="text-white mr-2" />
                          ) : (
                            <FaCheckCircle className="text-white mr-2" />
                          )}
                          <p className="text-xl font-medium">
                            {slot.reserved ? 'Reserved' : 'Available'}
                          </p>
                        </div>
                        <p className="text-lg">
                          {startFormatted} - {endFormatted}
                        </p>
                        {slot.reserved && slot.reservedBy && (
                          <p className="text-sm mt-2">
                            Reserved by: {slot.reservedBy}
                          </p>
                        )}
                        {slot.reserved && isReservedByCurrentUser && (
                          <p className="text-sm mt-2 font-bold">
                            (You reserved this slot)
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="mt-4 text-gray-700 text-center text-lg">
              No office hours available.
            </p>
          )
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ViewOfficeHours;
