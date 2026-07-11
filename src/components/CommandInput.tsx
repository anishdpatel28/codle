// Guess input with a prefix-matched term dropdown. Only a known term (or an
// empty skip) can be submitted; anything else shows an inline error. Uses the
// browser's native caret (tinted amber) so selection/highlighting work normally.

import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { isEmptyGuess, isValidTerm } from '../game/validate';

interface Props {
  onSubmit: (guess: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

const MAX_SUGGESTIONS = 6;

export function CommandInput({ onSubmit, disabled, suggestions = [] }: Props) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter((s) => s.toLowerCase().startsWith(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [value, suggestions]);

  const showList = open && !disabled && matches.length > 0;

  // A submission is allowed if it's an intentional skip or a recognized term.
  const canSubmit = isEmptyGuess(value) || isValidTerm(value, suggestions);

  const select = (term: string) => {
    setValue(term);
    setError(false);
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!canSubmit) {
      setError(true);
      return;
    }
    onSubmit(value);
    setValue('');
    setError(false);
    setOpen(false);
    setHighlight(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? matches.length - 1 : h - 1));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      select(matches[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlight(-1);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-1 border-t border-hairline bg-surface-raised px-6 py-4"
    >
      {showList && (
        <ul className="absolute inset-x-6 bottom-full mb-2 overflow-hidden rounded-[2px] border border-hairline bg-surface">
          {matches.map((term, i) => (
            <li key={term}>
              <button
                type="button"
                // Prevent the input blur from firing before the click.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(term)}
                onMouseEnter={() => setHighlight(i)}
                className={`block w-full px-4 py-2 text-left font-mono text-mono ${
                  i === highlight ? 'bg-surface-raised text-accent' : 'text-primary'
                }`}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3">
        <span className="select-none font-mono text-mono text-accent">&gt;</span>
        <input
          ref={inputRef}
          className="cmd text-mono"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
            setOpen(true);
            setHighlight(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          disabled={disabled}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Guess the term, or submit empty to skip for a hint"
        />
      </div>

      {error && (
        <span className="pl-6 font-mono text-meta uppercase text-danger">not a valid term</span>
      )}
    </form>
  );
}
