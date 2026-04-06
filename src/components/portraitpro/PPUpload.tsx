'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Translations } from '@/i18n/translations/de';

export default function PPUpload({ t }: { t: Translations }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamReady, setWebcamReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxFiles = 10;

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const remaining = maxFiles - files.length;
    const toAdd = fileArray.slice(0, remaining);

    setFiles(prev => [...prev, ...toAdd]);

    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [files.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setWebcamReady(true);
        };
      }
      setWebcamActive(true);
    } catch {
      alert('Webcam access denied. Please allow camera access.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || files.length >= maxFiles) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviews(prev => [...prev, dataUrl]);
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFiles(prev => [...prev, file]);
      }
    }, 'image/jpeg', 0.9);
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setWebcamActive(false);
    setWebcamReady(false);
  };

  return (
    <section id="upload" className="pp-section" style={{ background: 'var(--pp-bg-warm)' }}>
      <div className="pp-container" style={{ maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span className="pp-badge">{t.upload.badge}</span>
          <h2 style={{
            fontFamily: 'var(--font-pp-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 700,
            marginTop: 16,
            letterSpacing: '-0.02em',
          }}>
            {t.upload.title}
          </h2>
          <p style={{ color: 'var(--pp-text-secondary)', marginTop: 8 }}>
            {t.upload.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Dropzone */}
          <div
            className={`pp-dropzone ${dragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--pp-text-muted)" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ fontWeight: 600, color: 'var(--pp-text)', marginBottom: 4 }}>
              {t.upload.dropzone}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--pp-text-muted)' }}>
              {t.upload.dropzoneFormats}
            </p>
          </div>

          {/* Preview thumbnails */}
          {previews.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 20,
            }}>
              {previews.map((preview, i) => (
                <div key={i} style={{
                  width: 80, height: 80,
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid var(--pp-border)',
                }}>
                  <img src={preview} alt={`Upload ${i + 1}`} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }} />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', color: 'white',
                      border: 'none', cursor: 'pointer', fontSize: '0.7rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <p style={{ marginTop: 12, fontSize: '0.9rem', color: 'var(--pp-text-secondary)' }}>
              {t.upload.uploadCount.replace('{count}', String(files.length)).replace('{total}', String(maxFiles))}
            </p>
          )}

          {/* Webcam section */}
          <div style={{
            marginTop: 32,
            padding: '24px',
            background: 'var(--pp-bg-white)',
            borderRadius: 'var(--pp-radius)',
            border: '1px solid var(--pp-border-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pp-accent)" strokeWidth="2" strokeLinecap="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span style={{ fontWeight: 600, color: 'var(--pp-text)' }}>{t.upload.webcam}</span>
            </div>

            {!webcamActive ? (
              <button onClick={startWebcam} className="pp-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                {t.upload.webcamBtn}
              </button>
            ) : (
              <div>
                <div className="pp-webcam-container">
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
                  <button
                    onClick={capturePhoto}
                    className="pp-btn-primary"
                    disabled={!webcamReady || files.length >= maxFiles}
                    style={{ opacity: webcamReady ? 1 : 0.5 }}
                  >
                    <span>📸 {t.upload.capture}</span>
                  </button>
                  <button onClick={stopWebcam} className="pp-btn-secondary">
                    {t.upload.retake}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginTop: 24,
          }}>
            {[t.upload.tip1, t.upload.tip2, t.upload.tip3].map((tip, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'var(--pp-bg-white)',
                border: '1px solid var(--pp-border-light)',
                fontSize: '0.85rem',
                color: 'var(--pp-text-secondary)',
              }}>
                {tip}
              </div>
            ))}
          </div>

          {/* Generate button */}
          {files.length >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', marginTop: 32 }}
            >
              <button className="pp-btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>
                <span>✨ {t.upload.startGeneration}</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
