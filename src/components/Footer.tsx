import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-6 lg:px-16">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-meta uppercase text-muted">
        <span>© 2026 Anish Patel</span>
        <Link to="/privacy" className="transition-colors hover:text-primary">
          privacy
        </Link>
      </div>
    </footer>
  );
}
