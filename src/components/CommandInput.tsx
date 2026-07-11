// Guess input with a prefix-matched term dropdown. Picking an option fills the
// field; an empty submit is a skip.

import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter((s) => s.toLowerCase().startsWith(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [value, suggestions]);

  const showList = open && !disabled && matches.length > 0;

  const select = (term: string) => {
    setValue(term);
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit(value);
    setValue('');
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
      className="relative flex items-center gap-3 border-t border-hairline bg-surface-raised px-6 py-4"
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

      <span className="select-none font-mono text-mono text-accent">&gt;</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          className="cmd caret-accent text-mono"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
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
        {value === '' && !disabled && (
          <span className="animate-cursor-blink pointer-events-none absolute left-0 top-1/2 h-[18px] w-[9px] -translate-y-1/2 bg-accent" />
        )}
      </div>
    </form>
  );
}
