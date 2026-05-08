import { Header } from '@/components/Header';
import { DownloaderCard } from '@/components/DownloaderCard';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-8">
        {/* Hero */}
        <div className="text-center max-w-2xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            ⚡ Free · No signup · No watermarks
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-800 leading-tight mb-4"
            style={{ color: 'var(--text)' }}>
            Download Any
            <span style={{ color: 'var(--accent)' }}> Instagram</span> or
            <span style={{ color: 'var(--accent)' }}> Twitter</span> Media
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Paste a post URL below — images, videos, reels & carousels, all in full quality.
          </p>
        </div>

        {/* Main Card */}
        <DownloaderCard />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          {['📸 Instagram Posts', '🎬 Reels & Videos', '🐦 Twitter/X Clips', '🗂 Carousel ZIP', '🌙 Dark Mode'].map((f) => (
            <span key={f} className="px-3 py-1 rounded-full border"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              {f}
            </span>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}