// app/layout.js
import './globals.css';
import { Providers } from './providers';
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'react-hot-toast'

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