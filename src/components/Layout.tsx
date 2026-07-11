import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

// App shell: header plus a main region with intentionally asymmetric outer
// margins (64 left / 96 right at desktop), never a centered container.

export function Layout({ children }: { children: ReactNode }) {
  // Not a sticky footer: main sizes to its content and the footer sits directly
  // below it, so short pages don't leave a large gap above the footer.
  return (
    <div className="min-h-full bg-bg">
      <Header />
      <main className="px-6 py-8 lg:pb-16 lg:pl-16 lg:pr-24 lg:pt-12">{children}</main>
      <Footer />
    </div>
  );
}
