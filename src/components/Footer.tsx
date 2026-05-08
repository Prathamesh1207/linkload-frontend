export function Footer() {
  return (
    <footer className="text-center py-6 text-xs border-t"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
      LinkLoad · Powered by{' '}
      <a href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noreferrer"
        className="underline hover:opacity-80">yt-dlp</a>
      {' '}· Use responsibly. Respect content creators.
    </footer>
  );
}