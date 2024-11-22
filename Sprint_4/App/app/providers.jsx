// app/providers.jsx
"use client";

import { SessionProvider } from 'next-auth/react';
import PropTypes from 'prop-types';

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
