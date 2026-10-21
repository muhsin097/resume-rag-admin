// No logo asset in this app (internal tool, not brand-facing) -- a plain
// spinner instead of resume-rag-web's pulsing wordmark.
export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        style={{ color: 'var(--accent, #6D28D9)' }}
        aria-hidden="true"
      />
      <p className="text-sm muted">{label ?? 'Loading...'}</p>
    </div>
  );
}
