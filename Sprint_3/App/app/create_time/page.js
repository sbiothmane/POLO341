'use client';
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';

const OfficeHoursPage = () => {
    const { data: session, status } = useSession();

    if (status === 'unauthenticated') {
        return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
    }

    let usernames;
    if (session) {
        const username = session.user.username;
        usernames = username;
    }

    const [officeHours, setOfficeHours] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [interval, setInterval] = useState(30);

    useEffect(() => {
        const fetchOfficeHours = async () => {
            const officeHoursCollection = collection(db, 'officeHours');
            const snapshot = await getDocs(officeHoursCollection);
            const data = snapshot.docs.map(doc => {
                const { start, end, reservedBy, ...rest } = doc.data();
                return {
                    id: doc.id,
                    start: start instanceof Timestamp ? start.toDate() : new Date(start),
                    end: end instanceof Timestamp ? end.toDate() : new Date(end),
                    reservedBy: reservedBy || null,
                    ...rest,
                };
            });
            const sortedData = data.sort((a, b) => a.start - b.start);
            setOfficeHours(sortedData);
        };

        fetchOfficeHours();
    }, []);

    const handleCreateOfficeHours = async (e) => {
        e.preventDefault();
        const slots = generateTimeSlots(date, startTime, endTime, interval);
    
        // Prevent duplicates
        const filteredSlots = slots.filter(newSlot => 
            !officeHours.some(existingSlot => 
                existingSlot.start.getTime() === newSlot.start.getTime() || 
                existingSlot.end.getTime() === newSlot.end.getTime()||
                existingSlot.start.toLocaleDateString() === newSlot.start.toLocaleDateString()
            )
        );
    
        if (filteredSlots.length === 0) {
            alert("All the selected time slots conflict with existing ones.");
            return;
        }
    
        await saveOfficeHours(filteredSlots);
        setOfficeHours(prev => [...prev, ...filteredSlots].sort((a, b) => a.start - b.start));
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
                start: startSlot,
                end: endSlot,
                reserved: false,
                reservedBy: null,
            });
        }

        return timeSlots;
    };

    const saveOfficeHours = async (slots) => {
        const officeHoursCollection = collection(db, 'officeHours');

        for (const slot of slots) {
            await addDoc(officeHoursCollection, {
                username: usernames,
                start: Timestamp.fromDate(slot.start),
                end: Timestamp.fromDate(slot.end),
                reserved: false,
                reservedBy: null,
            });
        }
    };

    const deleteOfficeHour = async (id) => {
        try {
            await deleteDoc(doc(db, 'officeHours', id));
            setOfficeHours(prevSlots => prevSlots.filter(slot => slot.id !== id));
        } catch (error) {
            console.error("Error deleting office hour: ", error);
            alert('Failed to delete the office hour. Please try again.');
        }
    };

    const updateReservation = async (id) => {
        const studentName = prompt("Enter the student's name to reserve this slot:");
        if (studentName) {
            const slotDoc = doc(db, 'officeHours', id);
            await updateDoc(slotDoc, {
                reserved: true,
                reservedBy: studentName,
            });
            setOfficeHours(prevSlots => prevSlots.map(slot => 
                slot.id === id ? { ...slot, reserved: true, reservedBy: studentName } : slot
            ));
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
       
            <div className="min-h-screen h-full bg-white flex flex-col items-center justify-start">
                <div className="w-full  h-120 flex items-center justify-center"  style={{ backgroundImage: "url('/some.jpg')" }}>
                <div className="w-full max-w-md p-6 bg-blue-500 text-white rounded-lg shadow-lg border border-blue-700">
                <h1 className="text-2xl text-white-800 font-bold mb-4">Create Office Hours</h1>
                <form onSubmit={handleCreateOfficeHours}>
                    <div className="mb-4">
                        <label className="block text-white-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white-700">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white-700">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                        />
                    </div>
                    <div className="mb-4">
                       
                        <label className="block">
                        <span className="text-white-700">Interval (minutes):</span>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={45}>45</option>
                            <option value={60}>60</option>
                        </select>
                    </label>

                        
                    </div>
                    <button type="submit" className="w-full bg-blue-700 text-white p-2 rounded">Create Office Hours</button>
                </form>
            </div>
            </div>

            <div className="w-full bg-white p-4 flex-1 mt-8 overflow-y-auto">
                <h1 className="text-xl text-center font-semibold text-gray-800 mb-4">Office Hours Created</h1>
                {Object.keys(groupedSlots).map((dateKey) => (
                    <div key={dateKey} className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{formatDate(dateKey)}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedSlots[dateKey].map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`p-4 border rounded-md shadow-sm ${
                                        slot.reserved ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'
                                    }`}
                                >
                                    <p className="text-gray-700">
                                        {`${slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </p>
                                    {slot.reserved && (
                                        <p className="text-gray-500 text-sm">
                                            Reserved by: {slot.reservedBy || 'Unknown'}
                                        </p>
                                    )}
                                    {!slot.reserved && (
                                        <button
                                            onClick={() => updateReservation(slot.id)}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Reserve for Student
                                        </button>
                                    )}
                                    <br></br><button
                                        onClick={() => deleteOfficeHour(slot.id)}
                                        className="text-red-500 hover:underline text-sm mt-2"
                                    >
                                        Delete Slot
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfficeHoursPage;
