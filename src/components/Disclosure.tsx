import type { ReactNode } from 'react';

// Mono-styled disclosure used to collapse the sidebar below the log on mobile.

interface Props {
  label: string;
  children: ReactNode;
}

export function Disclosure({ label, children }: Props) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none font-mono text-mono text-accent marker:hidden">
        &gt;{' '}
        <span className="group-open:hidden">view {label}</span>
        <span className="hidden group-open:inline">hide {label}</span>
      </summary>
      <div className="mt-6">{children}</div>
    </details>
  );
}
