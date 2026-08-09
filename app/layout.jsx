import './globals.css';
import { AuthProvider } from '../lib/AuthContext';

export const metadata = {
  title: 'Docket — AI-Powered Regulatory Platform',
  description: 'Manage entity compliance, filings, and regulatory automation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fraunces — institutional serif for headings */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink antialiased min-h-screen" style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
