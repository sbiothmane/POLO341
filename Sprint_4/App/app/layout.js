// app/layout.js
import './globals.css';
import { Providers } from './providers';
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'react-hot-toast'
import PropTypes from 'prop-types'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
