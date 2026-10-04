import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OSINT Threat & Corporate Intelligence Platform',
  description: 'Cybersecurity intelligence platform for tracking defense-industrial and dual-use entities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0d14] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
