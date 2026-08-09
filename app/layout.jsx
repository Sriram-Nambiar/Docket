import './globals.css';
import { AuthProvider } from '../lib/AuthContext';

export const metadata = {
  title: 'Docket — AI-Powered Regulatory Platform',
  description: 'Manage entity compliance, filings, and regulatory automation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
