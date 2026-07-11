// DRAFT PRIVACY POLICY — placeholder copy for review only. This is NOT
// lawyer-reviewed final text. Confirm accuracy, fill in the contact address, and
// have it reviewed before publishing.

import { Layout } from '../components/Layout';

const CONTACT_EMAIL = 'privacy@example.com'; // DRAFT: replace with a real address.

export function PrivacyPage() {
  return (
    <Layout>
      <h1 className="mb-2 font-sans text-h1 text-primary">
        Privacy <span className="text-accent">policy</span>
      </h1>
      <p className="mb-8 font-mono text-meta uppercase text-muted">
        Draft — pending review
      </p>

      <div className="flex max-w-prose flex-col gap-6 font-sans text-body text-primary/90">
        <section className="flex flex-col gap-2">
          <h2 className="font-sans text-h2 text-primary">What we collect</h2>
          <p>
            If you sign in with Google, we receive your Google account&rsquo;s
            email address and display name through Google&rsquo;s OAuth sign-in.
            We also store your game results — the puzzle date, the term, your
            guesses, the number of attempts, and whether you solved it — linked to
            your account.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-sans text-h2 text-primary">How we use it</h2>
          <p>
            We use this information only to run the game: to show your archive,
            your results for each day, and your win rate. If you play without
            signing in, your progress is stored only in your browser.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-sans text-h2 text-primary">Sharing</h2>
          <p>
            We do not sell your data, and we do not share it with third parties.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-sans text-h2 text-primary">Deleting your data</h2>
          <p>
            You can request deletion of your account and its game results by
            emailing{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent hover:glow-accent">
              {CONTACT_EMAIL}
            </a>
            . We will remove your stored results and account association.
          </p>
        </section>
      </div>
    </Layout>
  );
}
