'use client';
import { useState, useRef } from 'react';
import { Search, AlertCircle, X } from 'lucide-react';
import { MediaResult } from './MediaResult';
import { Spinner } from './Spinner';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function DownloaderCard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

async function handleFetch() {
  setError('');
  setResult(null);

  if (!url.trim()) {
    setError('Please paste a URL first.');
    return;
  }

  inputRef.current?.blur();
  setLoading(true);

  try {
    console.log('Fetching from:', `${BACKEND}/api/media/info`); // check this in mobile browser

    const res = await fetch(`${BACKEND}/api/media/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    setResult(data);

  } catch (err: any) {
    // Show detailed error on screen instead of just console
    if (err.message === 'Failed to fetch') {
      setError(`Cannot reach backend at ${BACKEND} — check your IP in .env.local and that backend is running.`);
    } else {
      setError(err.message);
    }
  } finally {
    setLoading(false);
  }
}

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFetch();
    }
  }

  function clearInput() {
    setUrl('');
    setResult(null);
    setError('');
    inputRef.current?.focus();
  }

  return (
    <div className="w-full max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Input card */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Input row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Input wrapper with clear button */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"              // ← text not "url" (prevents mobile mangling)
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste Instagram or Twitter/X URL..."
              autoComplete="off"
              autoCorrect="off"        // ← stops iOS autocorrect
              autoCapitalize="none"    // ← stops iOS capitalizing https://
              spellCheck={false}       // ← stops red underlines mangling URL
              inputMode="url"          // ← shows URL keyboard on mobile
              className="w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-colors"
              style={{
                background: 'var(--surface-2)',
                borderColor: error ? '#e05252' : 'var(--border)',
                color: 'var(--text)',
              }}
            />
            {/* Clear X button */}
            {url.length > 0 && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Fetch button — type="button" prevents form submit */}
          <button
            type="button"
            onClick={handleFetch}
            disabled={loading}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? <Spinner size={16} /> : <Search size={16} />}
            {loading ? 'Processing…' : 'Fetch Media'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 flex items-start gap-2 p-3 rounded-xl text-sm"
            style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6c6' }}
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 animate-slide-up">
          <MediaResult data={result} backendUrl={BACKEND} />
        </div>
      )}
    </div>
  );
}