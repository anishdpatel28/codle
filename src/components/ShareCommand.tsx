// "Share result" as a mono command line. Renders only once the round is
// finished. Builds a spoiler-free signal read — no letter grid.

import { useState } from 'react';

interface Props {
  label: string;
  status: 'won' | 'lost';
  attemptsUsed: number;
  solvedOnAttempt: number | null;
  total: number;
}

function buildShare({ label, status, attemptsUsed, solvedOnAttempt, total }: Props): string {
  const filled = '■'.repeat(attemptsUsed);
  const empty = '□'.repeat(Math.max(0, total - attemptsUsed));
  const read = status === 'won' ? `${solvedOnAttempt}/${total} decoded` : `X/${total} signal lost`;
  return `codle // ${label}\n[${filled}${empty}] ${read}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function ShareCommand(props: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copyToClipboard(buildShare(props));
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-left font-mono text-mono text-accent transition-shadow hover:glow-accent"
    >
      &gt; {copied ? 'copied to clipboard' : 'share result'}
    </button>
  );
}
