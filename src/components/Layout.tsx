import type { ReactNode } from 'react';
import { Header } from './Header';

// App shell: header plus a main region with intentionally asymmetric outer
// margins (64 left / 96 right at desktop), never a centered container.

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-bg">
      <Header />
      <main className="flex-1 px-6 py-8 lg:pb-16 lg:pl-16 lg:pr-24 lg:pt-12">{children}</main>
    </div>
  );
}
