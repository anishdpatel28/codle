import { NavLink } from 'react-router-dom';
import { AuthButton } from './AuthButton';

function navClass({ isActive }: { isActive: boolean }): string {
  return `font-mono text-mono ${isActive ? 'text-accent' : 'text-muted hover:text-primary'}`;
}

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-4 lg:px-16">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="font-mono text-mono font-semibold text-primary" end>
          codle<span className="animate-cursor-blink text-accent">_</span>
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navClass} end>
            daily
          </NavLink>
          <NavLink to="/archive" className={navClass}>
            archive
          </NavLink>
          <NavLink to="/practice" className={navClass}>
            practice
          </NavLink>
        </nav>
      </div>
      <AuthButton />
    </header>
  );
}
