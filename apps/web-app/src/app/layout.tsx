import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vortex Agentic Pay',
  description: 'AI-powered payments with X402',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
