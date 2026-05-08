'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent)' }}>
          <Download size={16} color="white" />
        </div>
        <span className="font-display font-700 text-xl" style={{ color: 'var(--text)' }}>
          LinkLoad
        </span>
      </div>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text)' }}
        aria-label="Toggle theme">
        {mounted ? (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />) : <Moon size={16} />}
      </button>
    </header>
  );
}