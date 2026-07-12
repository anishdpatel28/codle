// Turns any thrown value — a real Error, a Supabase/PostgREST error object
// ({ message, details, hint, code }), or something unexpected — into a readable
// string safe to show a user. Guards against "[object Object]" reaching the UI.

export function readableError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  if (
    e &&
    typeof e === 'object' &&
    'message' in e &&
    typeof (e as { message: unknown }).message === 'string'
  ) {
    return (e as { message: string }).message;
  }
  return 'Something went wrong. Please try again.';
}
