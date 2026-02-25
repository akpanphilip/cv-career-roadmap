'use client';

import ThemeToggle from './ThemeToggle';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}