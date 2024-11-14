// app/layout.js
import './globals.css';
import { Providers } from './providers';
import 'react-toastify/dist/ReactToastify.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}