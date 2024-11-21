'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { format, isSameDay } from 'date-fns';
import { UserPlus, Calendar as CalendarIcon, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import AnimatedBackground from '@/app/components/home/AnimatedBackground';
import NavBar from '@/app/components/home/Navbar';

const ViewOfficeHours = ({ params }) => {
  const [instructorName] = useState(params?.instructor || '');
  const [officeHours, setOfficeHours] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: session, status } = useSession();
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    if (instructorName) fetchOfficeHours();
  }, [instructorName]);

  const fetchOfficeHours = async () => {
    try {
      const response = await fetch(`/api/office-hours/office-hours?instructor=${instructorName}`);
      if (!response.ok) throw new Error('Failed to fetch office hours');

      const hours = await response.json();
      const parsedHours = hours.map((hour) => ({
        ...hour,
        start: new Date(hour.start),
        end: new Date(hour.end),
      }));
      setOfficeHours(parsedHours);
    } catch (error) {
      console.error('Error fetching office hours:', error);
      toast.error('Error fetching office hours');
    }
  };

  const reserveOfficeHour = async (slotId, isReserved) => {
    if (!session?.user) {
      toast.error('You need to be logged in to reserve or unreserve office hours.');
      return;
    }

    setIsReserving(true);

    try {
      const response = await fetch('/api/office-hours/office-hours-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          reserved: !isReserved,
          reservedBy: !isReserved ? session.user.username : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update the office hour');

      toast.success(`Office hour ${isReserved ? 'unreserved' : 'reserved'} successfully.`);
      fetchOfficeHours();
    } catch (error) {
      console.error('Error updating office hour:', error);
      toast.error('Failed to update the office hour. Please try again.');
    } finally {
      setIsReserving(false);
    }
  };

  const filteredOfficeHours = selectedDate
    ? officeHours.filter((slot) => isSameDay(slot.start, selectedDate))
    : [];

  if (status === 'unauthenticated') {
    return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
  }

  const renderSlotActions = (slot) => {
    if (!slot.reserved) {
      return (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-green-200"
          onClick={() => reserveOfficeHour(slot.id, slot.reserved)}
          disabled={isReserving}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      );
    }

    if (slot.reservedBy === session?.user?.username) {
      return (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-red-200"
          onClick={() => reserveOfficeHour(slot.id, slot.reserved)}
          disabled={isReserving}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 bg-white/30">
      <AnimatedBackground />
      <NavBar role={session?.user?.role} />
      <main className="pt-24 relative z-10">
        <section className="py-10">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row bg-white/30">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-full p-6 flex flex-col items-center"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow bg-white p-3 w-full h-full bg-white/30"
                  modifiers={{
                    hasOfficeHours: officeHours.map((slot) => slot.start),
                  }}
                  modifiersClassNames={{
                    hasOfficeHours: 'bg-blue-200 text-blue-800',
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="md:w-1/2 p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <CalendarIcon className="mr-2" />
                  {selectedDate
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Select a date'}
                </h2>
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {filteredOfficeHours.map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-lg shadow-md bg-white/80 backdrop-blur-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 ${
                          slot.reserved ? 'border-red-500' : 'border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {slot.reserved ? (
                              <XCircle className="text-red-500 mr-2 h-6 w-6 animate-pulse" />
                            ) : (
                              <CheckCircle className="text-green-500 mr-2 h-6 w-6 animate-bounce" />
                            )}
                            <div>
                              <p className="text-lg font-medium">
                                {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
                              </p>
                              {slot.reserved && slot.reservedBy && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Reserved by: {slot.reservedBy}
                                </p>
                              )}
                              {slot.reserved &&
                                slot.reservedBy === session?.user?.username && (
                                  <p className="text-sm mt-2 font-bold">
                                    (You reserved this slot)
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="flex space-x-2">{renderSlotActions(slot)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredOfficeHours.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-center py-4"
                    >
                      No office hours scheduled for this day.
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white/30 backdrop-blur-lg py-8 mt-auto w-full fixed bottom-0">
        <div className="container mx-auto px-6 text-center text-gray-800">
          <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

ViewOfficeHours.propTypes = {
  params: PropTypes.shape({
    instructor: PropTypes.string.isRequired,
  }).isRequired,
};

export default ViewOfficeHours;
