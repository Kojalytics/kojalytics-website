'use client';

import { Suspense, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

const MAX_FILES = 10;
const MAX_IMAGE_DIMENSION = 1536;
const JPEG_QUALITY = 0.75;

export default function MobileUploadPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <MobileUpload />
    </Suspense>
  );
}

// Compress image client-side before upload
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Skip non-images or already small files (<500KB)
    if (!file.type.startsWith('image/') || file.size < 500_000) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      // Scale down if larger than max dimension
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function MobileUpload() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const userId = searchParams.get('uid') || '';

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDe = locale === 'de';

  const handleFiles = (newFiles: FileList) => {
    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) return;
    const fileArray = Array.from(newFiles).filter(f => f.type.startsWith('image/')).slice(0, remaining);
    setFiles(prev => [...prev, ...fileArray]);
    fileArray.forEach(file => {
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
    if (!userId || files.length < 5) return;
    setUploading(true);
    setError('');
    setUploadProgress(5);

    try {
      // Compress all images client-side first
      setUploadProgress(10);
      const compressed = await Promise.all(files.map(f => compressImage(f)));
      setUploadProgress(25);

      // Upload in batches of 3 to avoid timeout/size issues
      const batchSize = 3;
      let uploadedCount = 0;

      for (let batch = 0; batch < compressed.length; batch += batchSize) {
        const batchFiles = compressed.slice(batch, batch + batchSize);
        const formData = new FormData();
        formData.append('uid', userId);
        batchFiles.forEach(f => formData.append('files', f));

        // Add flags: first batch clears old files, last batch triggers broadcast
        if (batch === 0) formData.append('first', '1');
        const isLastBatch = batch + batchSize >= compressed.length;
        formData.append('final', isLastBatch ? '1' : '0');

        const res = await fetch('/api/mobile-upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(data.error || 'Upload failed');
        }

        uploadedCount += batchFiles.length;
        setUploadProgress(25 + Math.round((uploadedCount / compressed.length) * 70));
      }

      setUploadProgress(100);
      setUploaded(true);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      setError(isDe ? 'Upload fehlgeschlagen. Bitte versuche es erneut.' : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const atLimit = files.length >= MAX_FILES;

  if (uploaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: '#FAFAF8', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: '#1A1A2E' }}>
            {isDe ? `${files.length} Fotos hochgeladen!` : `${files.length} Photos uploaded!`}
          </h1>
          <p style={{ color: '#6b7280' }}>
            {isDe ? 'Du kannst dieses Fenster jetzt schließen und am Computer weitermachen.' : 'You can close this window and continue on your computer.'}
          </p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: '#FAFAF8', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: '#1A1A2E' }}>
            {isDe ? 'Ungültiger Link' : 'Invalid Link'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {isDe ? 'Bitte scanne den QR-Code erneut von der Desktop-Seite.' : 'Please scan the QR code again from the desktop page.'}
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
          color: 'white', fontWeight: 800, fontSize: '1.1rem',
        }}>AI</div>
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
          disabled={atLimit || uploading}
          onClick={() => {
            if (atLimit) return;
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
            background: atLimit ? '#ccc' : 'linear-gradient(135deg, #E94560, #F27121)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            border: 'none', cursor: atLimit ? 'not-allowed' : 'pointer',
          }}
        >
          📸 {isDe ? 'Kamera öffnen' : 'Open Camera'}
        </button>

        <button
          disabled={atLimit || uploading}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'white', color: atLimit ? '#aaa' : '#1A1A2E', fontWeight: 600,
            fontSize: '1rem', border: '2px solid #E8E6E1',
            cursor: atLimit ? 'not-allowed' : 'pointer',
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

      {/* Limit hint */}
      {atLimit && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#E94560', marginBottom: 16, fontWeight: 600 }}>
          {isDe ? 'Maximum erreicht (10 Fotos)' : 'Maximum reached (10 photos)'}
        </p>
      )}

      {/* Thumbnails */}
      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
          {previews.map((p, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
              position: 'relative', border: '2px solid #E8E6E1',
            }}>
              <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {!uploading && (
                <button onClick={() => removeFile(i)} style={{
                  position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: files.length >= 5 ? '#16a34a' : '#888', marginBottom: 24 }}>
        {files.length}/{MAX_FILES} {isDe ? 'Fotos' : 'photos'}
        {files.length > 0 && files.length < 5 && ` — ${isDe ? 'mindestens 5 nötig' : 'at least 5 needed'}`}
      </p>

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#E8E6E1', overflow: 'hidden' }}>
            <div style={{
              width: `${uploadProgress}%`, height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #E94560, #F27121)',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: 8 }}>
            {isDe ? `Komprimiere & lade hoch... ${uploadProgress}%` : `Compressing & uploading... ${uploadProgress}%`}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#ef4444', marginBottom: 16 }}>{error}</p>
      )}

      {/* Upload button */}
      {files.length >= 1 && !uploading && (
        <button
          onClick={handleUpload}
          disabled={files.length < 5}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: 14,
            background: files.length >= 5
              ? 'linear-gradient(135deg, #E94560, #F27121)'
              : '#ccc',
            color: 'white', fontWeight: 700, fontSize: '1.05rem',
            border: 'none',
            cursor: files.length >= 5 ? 'pointer' : 'not-allowed',
            opacity: files.length >= 5 ? 1 : 0.6,
          }}
        >
          ✨ {isDe ? `${files.length} Fotos hochladen` : `Upload ${files.length} photos`}
        </button>
      )}
    </div>
  );
}
