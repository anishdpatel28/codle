// Binary feedback for the last guess: wrong, or a skip acknowledgement.

import type { LastResult } from '../game/types';

interface Props {
  result: LastResult;
}

export function FeedbackLine({ result }: Props) {
  if (result === 'wrong') {
    return (
      <div className="flex items-center gap-3 border-l-2 border-danger bg-danger/5 px-4 py-2">
        <span className="font-mono text-mono text-danger">[!] WRONG</span>
        <span className="font-mono text-mono text-muted">signal not matched — next hint decrypted</span>
      </div>
    );
  }
  if (result === 'skip') {
    return (
      <div className="flex items-center gap-3 border-l-2 border-hairline px-4 py-2">
        <span className="font-mono text-mono text-muted">[~] skipped</span>
        <span className="font-mono text-mono text-muted">attempt traded for a hint</span>
      </div>
    );
  }
  return null;
}
