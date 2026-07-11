// Archive: every past transmission with the signed-in user's result beside it.

import { Layout } from '../components/Layout';
import { ArchiveRow } from '../components/ArchiveRow';
import { useAuth } from '../hooks/authContext';
import { useDashboard } from '../hooks/useDashboard';

export function ArchivePage() {
  const { user } = useAuth();
  const { terms, scores, loading, error } = useDashboard(user?.id ?? null);

  return (
    <Layout>
      <h1 className="mb-8 font-sans text-h1 text-primary">
        Codle <span className="text-accent">archive</span>
      </h1>

      {loading && <p className="font-mono text-mono text-muted">decoding archive…</p>}
      {error && <p className="font-mono text-mono text-danger">error: {error}</p>}

      {!loading && !error && (
        <div className="max-w-2xl">
          {terms.map((t) => (
            <ArchiveRow key={t.id} term={t} score={scores[t.id]} />
          ))}
          {terms.length === 0 && (
            <p className="font-mono text-mono text-muted">no transmissions archived yet.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
