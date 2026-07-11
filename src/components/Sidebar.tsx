// Secondary panel: stats, the signal-history strip, and — once the round is
// finished — the share command. Subordinate to the log.

import type { Stats } from '../data/stats';
import type { DailyTerm, Score } from '../data/types';
import { StatsBlock } from './StatsBlock';
import { GuessPanel } from './GuessPanel';
import { ArchiveStrip } from './ArchiveStrip';
import { ShareCommand } from './ShareCommand';

interface ShareInfo {
  label: string;
  status: 'won' | 'lost' | null;
  attemptsUsed: number;
  solvedOnAttempt: number | null;
  total: number;
}

interface Props {
  stats: Stats;
  terms: DailyTerm[];
  scores: Record<string, Score>;
  guesses: string[];
  solved: boolean;
  share: ShareInfo;
}

export function Sidebar({ stats, terms, scores, guesses, solved, share }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <GuessPanel guesses={guesses} solved={solved} total={share.total} />
      <StatsBlock stats={stats} />
      <ArchiveStrip terms={terms} scores={scores} />
      {share.status && (
        <div className="rounded-[2px] border border-hairline bg-surface p-4">
          <ShareCommand
            label={share.label}
            status={share.status}
            attemptsUsed={share.attemptsUsed}
            solvedOnAttempt={share.solvedOnAttempt}
            total={share.total}
          />
        </div>
      )}
    </div>
  );
}
