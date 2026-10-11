interface HighlightProps {
  text: string;
  query: string;
}

/** Wrap case-insensitive matches of `query` in <mark>. */
export function Highlight({ text, query }: HighlightProps) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="search-match">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
