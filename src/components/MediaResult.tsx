'use client';
import { useState } from 'react';
import { Download, Film, Image as ImageIcon, Package, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface MediaItem {
  type: 'video' | 'image';
  title: string;
  uploader: string;
  thumbnail: string;
  videoUrl: string | null;
  imageUrl: string | null;
  ext: string;
  duration: number | null;
}

interface ResultData {
  platform: string;
  title: string;
  uploader: string;
  isCarousel: boolean;
  items: MediaItem[];
}

export function MediaResult({ data, backendUrl }: { data: ResultData; backendUrl: string }) {
  const [downloading, setDownloading] = useState<string | null>(null);

  function buildProxyUrl(mediaUrl: string, filename: string) {
    const platform = data.platform?.includes('instagram') ? 'instagram' : 'twitter';
    return `${backendUrl}/api/media/proxy?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}&platform=${platform}`;
  }

// In downloadSingle(), replace the link.click() block with:
async function downloadSingle(item: MediaItem, index: number) {
  const key = `${index}`;
  setDownloading(key);
  const rawUrl = item.type === 'video' ? item.videoUrl! : item.imageUrl!;
  const ext = item.type === 'video' ? 'mp4' : 'jpg';
  const filename = `linkload_${item.uploader || 'media'}_${index + 1}.${ext}`;
  const proxyUrl = buildProxyUrl(rawUrl, filename);
  
  console.log('Attempting download from:', proxyUrl); // ← check this in DevTools
  
  const link = document.createElement('a');
  link.href = proxyUrl;
  link.download = filename;
  link.click();
  setTimeout(() => setDownloading(null), 2000);
}

  async function downloadAll() {
    setDownloading('all');
    const items = data.items.map((item, i) => {
      const rawUrl = item.type === 'video' ? item.videoUrl! : item.imageUrl!;
      const ext = item.type === 'video' ? 'mp4' : 'jpg';
      return { url: encodeURIComponent(rawUrl), filename: `linkload_${i + 1}.${ext}` };
    });

    const res = await fetch(`${backendUrl}/api/media/download-zip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'linkload_media.zip';
    link.click();
    setDownloading(null);
  }

  const platformIcon = data.platform?.includes('instagram') ? '📸' : '🐦';

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
        <span className="text-2xl">{platformIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
            {data.title || 'Media Post'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            @{data.uploader} · {data.items.length} item{data.items.length > 1 ? 's' : ''}
          </p>
        </div>
        {data.items.length > 1 && (
          <button
            onClick={downloadAll}
            disabled={downloading === 'all'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: 'var(--accent)' }}>
            {downloading === 'all' ? '⏳' : <Package size={13} />}
            Download All ZIP
          </button>
        )}
      </div>

      {/* Grid of media items */}
      <div className={clsx('p-4 gap-4', data.items.length === 1 ? 'flex' : 'grid grid-cols-2 sm:grid-cols-3')}>
        {data.items.map((item, i) => (
          <div key={i} className="rounded-xl overflow-hidden border group relative"
            style={{ borderColor: 'var(--border)' }}>
            {/* Thumbnail */}
            {item.thumbnail && (
              <div className="relative aspect-square bg-black">
                <img src={item.thumbnail} alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.type === 'video'
                    ? <Film size={28} color="white" />
                    : <ImageIcon size={28} color="white" />}
                </div>
                {item.duration && (
                  <span className="absolute bottom-1.5 right-1.5 text-white text-xs px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(0,0,0,0.65)' }}>
                    {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            )}

            {/* Download button */}
            <div className="p-2" style={{ background: 'var(--surface-2)' }}>
              <button
                onClick={() => downloadSingle(item, i)}
                disabled={downloading === String(i)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'var(--accent)' }}>
                {downloading === String(i) ? '⏳' : <Download size={13} />}
                {item.type === 'video' ? 'Video' : 'Image'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}