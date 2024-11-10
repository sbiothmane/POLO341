'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrash, FaEdit, FaPlusCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const OfficeHoursPage = () => {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return (
      <p className="text-red-500 text-center mt-8">
        You are not signed in.
      </p>
    );
  }

  const username = session?.user?.username || '';

  const [officeHours, setOfficeHours] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [date, setDate] = useState('');
  const [interval, setInterval] = useState(30);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    fetchOfficeHours();
  }, []);

  const fetchOfficeHours = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/office_index');
      if (!response.ok) {
        throw new Error('Failed to fetch office hours');
      }
      const data = await response.json();

      const parsedData = data.map((item) => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }));

      setOfficeHours(parsedData);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      toast.error('Error fetching office hours');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficeHours = async (e) => {
    e.preventDefault();
    const slots = generateTimeSlots(date, startTime, endTime, interval);

    // Prevent duplicates
    const filteredSlots = slots.filter(
      (newSlot) =>
        !officeHours.some(
          (existingSlot) =>
            existingSlot.start.getTime() === new Date(newSlot.start).getTime() &&
            existingSlot.end.getTime() === new Date(newSlot.end).getTime()
        )
    );

    if (filteredSlots.length === 0) {
      toast.error('All the selected time slots conflict with existing ones.');
      return;
    }

    try {
      const response = await fetch('/api/office_index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: filteredSlots, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to create office hours');
      }

      toast.success('Office hours created successfully');
      fetchOfficeHours();
    } catch (error) {
      console.error('Error creating office hours:', error);
      toast.error('Error creating office hours');
    }
  };

  const generateTimeSlots = (date, start, end, interval) => {
    const timeSlots = [];
    let currentTime = new Date(`${date}T${start}`);
    const endTime = new Date(`${date}T${end}`);

    while (currentTime < endTime) {
      const startSlot = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + interval);
      const endSlot = new Date(currentTime);

      timeSlots.push({
        id: `${startSlot.toISOString()}-${endSlot.toISOString()}`,
        start: startSlot.toISOString(),
        end: endSlot.toISOString(),
        reserved: false,
        reservedBy: null,
      });
    }

    return timeSlots;
  };

  const deleteOfficeHour = async (id) => {
    try {
      const response = await fetch('/api/office_index_delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete office hour');
      }

      toast.success('Office hour deleted successfully');
      setOfficeHours((prevSlots) =>
        prevSlots.filter((slot) => slot.id !== id)
      );
    } catch (error) {
      console.error('Error deleting office hour:', error);
      toast.error('Failed to delete the office hour');
    }
  };

  const openModal = (id) => {
    setSelectedSlotId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStudentName('');
  };

  const handleReservation = async () => {
    if (!studentName) {
      toast.error('Please enter a student name');
      return;
    }

    try {
      const response = await fetch('/api/office_index_update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSlotId,
          reserved: true,
          reservedBy: studentName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update office hour');
      }

      toast.success('Office hour reserved successfully');
      fetchOfficeHours();
      closeModal();
    } catch (error) {
      console.error('Error updating office hour:', error);
      toast.error('Failed to update the office hour');
    }
  };

  const groupedSlots = officeHours.reduce((groups, slot) => {
    const dateKey = slot.start.toLocaleDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(slot);
    return groups;
  }, {});

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-3xl mt-10 bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Office Hours
        </h1>
        <form
          onSubmit={handleCreateOfficeHours}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Interval (minutes)
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <FaPlusCircle className="inline-block mr-2" />
            </button>
          </div>
        </form>
      </div>
  
      <div className="w-full max-w-5xl mt-10 bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Office Hours Created
        </h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          Object.keys(groupedSlots).map((dateKey) => (
            <div key={dateKey} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                {formatDate(dateKey)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedSlots[dateKey].map((slot) => {
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
  
                  return (
                    <div
                      key={slot.id}
                      className={`p-6 border rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 ${
                        slot.reserved
                          ? 'bg-red-100 border-red-200'
                          : 'bg-green-100 border-green-200'
                      }`}
                    >
                      <p className="text-xl font-medium text-gray-800 mb-2">
                        {startFormatted} - {endFormatted}
                      </p>
                      {slot.reserved && (
                        <p className="text-gray-600 mb-4">
                          Reserved by: {slot.reservedBy || 'Unknown'}
                        </p>
                      )}
                      <div className="flex space-x-4">
                        {!slot.reserved && (
                          <button
                            onClick={() => openModal(slot.id)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={() => deleteOfficeHour(slot.id)}
                          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
  
      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 z-10">
            <h2 className="text-2xl mb-4 text-black">Reserve Slot</h2>
            <input
              type="text"
              placeholder="Enter student's name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReservation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Reserve
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
export default OfficeHoursPage;
