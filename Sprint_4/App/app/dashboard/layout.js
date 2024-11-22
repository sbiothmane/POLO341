// app/dashboard/layout.js
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

// Add PropTypes validation
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

import Loading from '../components/auth/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
if (status === 'loading') {
  return <Loading />; // Directly return the Loading component
}
    if (!session) router.push('/login'); // Redirect to login if not authenticated
  }, [session, status, router]);

  if (status === 'loading') {
    setTimeout(() => {
      return <Loading />;
    }, 1000);
  }

  return <>{children}</>;
}
