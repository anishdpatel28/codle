import type { ReactNode } from 'react';
import { Disclosure } from './Disclosure';

// The shared game layout: log on the left (~62%), sidebar on the right (~38%),
// with the sidebar collapsing behind a disclosure on mobile. Used by the daily,
// practice, and archive-review pages so they stay structurally identical.

interface Props {
  main: ReactNode;
  sidebar: ReactNode;
  disclosureLabel?: string;
}

export function TwoColumn({ main, sidebar, disclosureLabel = 'stats & guesses' }: Props) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[62fr_38fr]">
      <div>{main}</div>
      <aside className="lg:mt-14">
        <div className="hidden lg:block">{sidebar}</div>
        <div className="lg:hidden">
          <Disclosure label={disclosureLabel}>{sidebar}</Disclosure>
        </div>
      </aside>
    </div>
  );
}
