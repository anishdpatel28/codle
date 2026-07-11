import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-6 lg:px-16">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-meta uppercase text-muted">
        {/* DRAFT: placeholder copyright — replace "The Codle Team" with the
            actual rights holder before launch. */}
        <span>© 2026 The Codle Team</span>
        <Link to="/privacy" className="transition-colors hover:text-primary">
          privacy
        </Link>
      </div>
    </footer>
  );
}
