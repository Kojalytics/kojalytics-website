'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function MobileUpload() {
  const params = useParams();
  const locale = params.locale as string;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDe = locale === 'de';

  const handleFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const toAdd = fileArray.slice(0, 10 - files.length);
    setFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    // In production: upload to Supabase storage and link to session
    // For now: show success
    setUploaded(true);
  };

  if (uploaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: '#FAFAF8', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: '#1A1A2E' }}>
            {isDe ? 'Fotos hochgeladen!' : 'Photos uploaded!'}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {isDe ? 'Du kannst dieses Fenster jetzt schließen und am Computer weitermachen.' : 'You can close this window and continue on your computer.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', padding: 24, background: '#FAFAF8',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px',
          background: 'linear-gradient(135deg, #E94560, #F27121)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '1.3rem',
        }}>P</div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E' }}>
          {isDe ? 'Selfies hochladen' : 'Upload Selfies'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: 4 }}>
          {isDe ? '5–10 Fotos für beste Ergebnisse' : '5–10 photos for best results'}
        </p>
      </div>

      {/* Camera / Upload buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'user';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) handleFiles(target.files);
            };
            input.click();
          }}
          style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            border: 'none', cursor: 'pointer',
          }}
        >
          📸 {isDe ? 'Kamera öffnen' : 'Open Camera'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'white', color: '#1A1A2E', fontWeight: 600,
            fontSize: '1rem', border: '2px solid #E8E6E1', cursor: 'pointer',
          }}
        >
          🖼️ {isDe ? 'Aus Galerie wählen' : 'Choose from Gallery'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={e => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Thumbnails */}
      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
          {previews.map((p, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
              position: 'relative', border: '2px solid #E8E6E1',
            }}>
              <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => removeFile(i)} style={{
                position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: files.length >= 5 ? '#16a34a' : '#888', marginBottom: 24 }}>
        {files.length}/10 {isDe ? 'Fotos' : 'photos'}
      </p>

      {/* Upload button */}
      {files.length >= 5 && (
        <button
          onClick={handleUpload}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: 14,
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            color: 'white', fontWeight: 700, fontSize: '1.05rem',
            border: 'none', cursor: 'pointer',
          }}
        >
          ✨ {isDe ? `${files.length} Fotos hochladen` : `Upload ${files.length} photos`}
        </button>
      )}
    </div>
  );
}
