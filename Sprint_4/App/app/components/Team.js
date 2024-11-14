"use client";
import React, { useState } from 'react';
import { FaUsers, FaUser, FaPoll, FaClock, FaChalkboardTeacher } from 'react-icons/fa';
import Link from 'next/link';

export default function Team({ team, instructor, role }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
      <Link href={`/team/${team.name}`}>
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FaUsers className="mr-2 text-blue-500" />
          {team.name}
        </h1>
        </Link>
        <div className="text-right flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-700 flex items-center mb-2">
            <FaChalkboardTeacher className="mr-1 text-blue-500" />
            <span className="ml-1 text-gray-800 font-bold">{instructor}</span>
          </span>
          {role === 'student' && (
            <div className="flex space-x-2 mt-1">
              <Link href={`/polls/${instructor}`} key={instructor}>
                <span className="flex items-center bg-blue-200 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-blue-300 transition">
                  <FaPoll className="mr-1" />
                  Polls
                </span>
              </Link>
              <Link href={`/OfficeHours/${instructor}`} key={`${instructor}-office`}>
                <span className="flex items-center bg-blue-200 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-blue-300 transition">
                  <FaClock className="mr-1" />
                  Office Hours
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Students list */}
      <div
        className={`relative overflow-hidden transition-max-height duration-300 ease-in-out ${
          isHovered ? 'max-h-screen' : 'max-h-6'
        }`}
      >
        <div
          className={`text-gray-600 ${
            isHovered
              ? 'whitespace-normal'
              : 'whitespace-nowrap overflow-hidden text-ellipsis'
          }`}
        >
          {team?.students?.map((student) =>
            role === 'student' ? (
              <Link href={`/evaluate/${team.name}/${student}`} key={student}>
                <div className="inline-flex items-center mr-3 mb-2 cursor-pointer hover:text-blue-500 hover:bg-blue-50 rounded-md p-1 transition-colors duration-200">
                  <FaUser className="text-gray-500 mr-1" />
                  <span className="text-sm">{student}</span>
                </div>
              </Link>
            ) : (
              <div
                key={student}
                className="inline-flex items-center mr-3 mb-2 rounded-md p-1 text-gray-500 opacity-50 cursor-default"
              >
                <FaUser className="mr-1" />
                <span className="text-sm">{student}</span>
              </div>
            )
          )}
        </div>
        {!isHovered && (
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
        )}
      </div>
    </div>
  );
}
