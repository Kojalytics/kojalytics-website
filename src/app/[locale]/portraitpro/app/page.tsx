'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { PLANS, type PlanId } from '@/lib/stripe';
import { locales, type Locale } from '@/i18n/config';
import AuthModal from '@/components/portraitpro/auth/AuthModal';
import { QRCodeSVG } from 'qrcode.react';
import type { User, Session } from '@supabase/supabase-js';

// Inline translations for app page
const appLabels: Record<string, Record<string, string>> = {
  welcome: { de: 'Willkommen bei PortraitPro AI', en: 'Welcome to PortraitPro AI' },
  step1Title: { de: '1. Selfies hochladen', en: '1. Upload Selfies' },
  step1Desc: { de: 'Lade 5–10 Selfies hoch (gutes Licht, verschiedene Winkel)', en: 'Upload 5–10 selfies (good light, different angles)' },
  step2Title: { de: '2. Vorschau generieren', en: '2. Generate Preview' },
  step2Desc: { de: 'Wir erstellen 3 kostenlose Vorschau-Bilder mit Wasserzeichen', en: 'We create 3 free preview images with watermark' },
  step3Title: { de: '3. Paket kaufen', en: '3. Buy Package' },
  step3Desc: { de: 'Gefällt dir die Vorschau? Kaufe das volle Paket ohne Wasserzeichen', en: 'Like the preview? Buy the full package without watermark' },
  uploadArea: { de: 'Fotos hierher ziehen oder klicken', en: 'Drag photos here or click' },
  uploadFormats: { de: 'JPG, PNG — max. 10 MB pro Bild', en: 'JPG, PNG — max 10 MB per image' },
  orQR: { de: 'Oder vom Handy hochladen:', en: 'Or upload from phone:' },
  scanQR: { de: 'QR-Code scannen um Fotos vom Handy hochzuladen', en: 'Scan QR code to upload from phone' },
  photosUploaded: { de: 'Fotos hochgeladen', en: 'photos uploaded' },
  minPhotos: { de: 'Mindestens 5 Fotos nötig', en: 'At least 5 photos needed' },
  generatePreview: { de: 'Kostenlose Vorschau generieren', en: 'Generate Free Preview' },
  generating: { de: 'KI generiert Vorschau...', en: 'AI generating preview...' },
  previewReady: { de: 'Deine Vorschau ist fertig!', en: 'Your preview is ready!' },
  previewWatermark: { de: 'Vorschau mit Wasserzeichen — kaufe ein Paket für volle Qualität', en: 'Preview with watermark — buy a package for full quality' },
  buyStarter: { de: '12 Portraits — €9,99', en: '12 Portraits — €9.99' },
  buyPremium: { de: '24 Portraits — €20,99', en: '24 Portraits — €20.99' },
  paymentSoon: { de: 'Zahlung wird bald verfügbar sein! Wir richten gerade Stripe ein.', en: 'Payment coming soon! We are setting up Stripe.' },
  processing: { de: 'Deine Portraits werden generiert...', en: 'Your portraits are being generated...' },
  done: { de: 'Fertig! Deine Portraits sind bereit.', en: 'Done! Your portraits are ready.' },
  download: { de: 'Alle herunterladen', en: 'Download All' },
  downloadSingle: { de: 'Herunterladen', en: 'Download' },
  logout: { de: 'Abmelden', en: 'Sign Out' },
  webcamBtn: { de: 'Webcam nutzen', en: 'Use Webcam' },
  capture: { de: 'Foto aufnehmen', en: 'Take Photo' },
  stopCam: { de: 'Webcam schließen', en: 'Close Webcam' },
  remove: { de: 'Entfernen', en: 'Remove' },
};

type AppStep = 'upload' | 'generating-preview' | 'preview' | 'checkout' | 'generating-full' | 'gallery';

export default function PortraitProApp() {
  const params = useParams();
  const locale = (locales.includes(params.locale as Locale) ? params.locale : 'de') as Locale;
  const t = (key: string) => appLabels[key]?.[locale] || appLabels[key]?.['en'] || key;

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Webcam state
  const [webcamActive, setWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Generation state
  const [step, setStep] = useState<AppStep>('upload');
  const [jobId, setJobId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  const supabase = createClient();

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setShowAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // QR upload URL — only pass uid (short), no JWT (too long for QR code)
  // Mobile uploads via API route which uses service role key
  const uploadUrl = typeof window !== 'undefined' && user
    ? `${window.location.origin}/${locale}/portraitpro/app/mobile-upload?uid=${user.id}`
    : '';

  // Track reference image paths already in Storage (from mobile upload)
  const [mobileRefPaths, setMobileRefPaths] = useState<string[]>([]);

  // Listen for mobile uploads via Supabase Realtime
  useEffect(() => {
    if (!user || !session) return;

    const channel = supabase.channel(`mobile-upload:${user.id}`);
    channel.on('broadcast', { event: 'files_ready' }, async (payload) => {
      const { paths, thumbnails, count } = payload.payload as {
        paths: string[]; thumbnails: string[]; count: number;
      };
      if (!paths?.length) return;

      // Store the Storage paths — these are already in reference-images bucket
      setMobileRefPaths(prev => [...prev, ...paths]);

      // Create placeholder File objects so the file count is correct
      paths.forEach((path, i) => {
        const filename = path.split('/').pop() || `mobile-${i}.jpg`;
        const placeholder = new File([new Blob([''])], filename, { type: 'image/jpeg' });
        setFiles(prev => {
          if (prev.length >= 10) return prev;
          return [...prev, placeholder];
        });
      });

      // Use signed URLs as thumbnails
      if (thumbnails?.length) {
        setPreviews(prev => [...prev, ...thumbnails]);
      }
    });

    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [user?.id, session?.access_token]);

  // File handling
  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const maxFiles = 10;
    const fileArray = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const remaining = maxFiles - files.length;
    const toAdd = fileArray.slice(0, remaining);

    setFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }, [files.length]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 1280, height: 960 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setWebcamActive(true);
    } catch { /* denied */ }
  };

  const capturePhoto = () => {
    if (!videoRef.current || files.length >= 10) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreviews(prev => [...prev, dataUrl]);
    canvas.toBlob(blob => {
      if (blob) setFiles(prev => [...prev, new File([blob], `cam-${Date.now()}.jpg`, { type: 'image/jpeg' })]);
    }, 'image/jpeg', 0.9);
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setWebcamActive(false);
  };

  // Error state for user feedback
  const [genError, setGenError] = useState('');

  // Upload reference images to Supabase Storage via direct fetch with auth token
  const uploadReferenceImages = async (): Promise<string[]> => {
    const paths: string[] = [];
    const uid = user!.id;
    const token = session!.access_token;
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${uid}/${Date.now()}-${i}.${ext}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/reference-images/${path}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': file.type,
            'x-upsert': 'false',
          },
          body: file,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(`Upload failed: ${err.error || err.message || res.statusText}`);
      }
      paths.push(path);
    }
    return paths;
  };

  // Build prompts matching the iOS app format
  const buildPreviewPrompts = (): { index: number; prompt: string; category: string }[] => {
    const categories = [
      { category: 'Studio', fragment: 'elegant formal style, refined classic lighting, timeless look, clean studio background' },
      { category: 'Modern', fragment: 'modern contemporary style, clean crisp look, minimalist aesthetic, subtle gradient background' },
      { category: 'Natural', fragment: 'natural authentic style, relaxed warm atmosphere, genuine expression, soft window light' },
    ];
    return categories.map((cat, i) => ({
      index: i,
      prompt: `Ultra-realistic professional headshot portrait of a professional. This must be the SAME person as in the reference photos — same face, same features, same identity. ${cat.fragment}. Professional business attire. Shot with Canon EOS R5, 85mm f/1.4 lens, shallow depth of field. Keep the face identical to the reference photos. Closed-mouth expression, no teeth visible, confident and approachable look.`,
      category: cat.category,
    }));
  };

  const buildFullPrompts = (count: number): { index: number; prompt: string; category: string }[] => {
    const categories = [
      { category: 'Studio', fragment: 'elegant formal style, refined classic lighting, timeless look, clean studio background' },
      { category: 'Modern', fragment: 'modern contemporary style, clean crisp look, minimalist aesthetic, subtle gradient background' },
      { category: 'Natural', fragment: 'natural authentic style, relaxed warm atmosphere, genuine expression, soft window light' },
      { category: 'Outdoor', fragment: 'natural outdoor light, urban environment, blurred city background, golden hour warmth' },
      { category: 'Schwarzweiß', fragment: 'black and white photography, high contrast monochrome, dramatic shadows, timeless elegance' },
      { category: 'Dramatisch', fragment: 'dramatic artistic lighting, bold rim light, deep shadows, cinematic mood' },
    ];
    return Array.from({ length: count }, (_, i) => {
      const cat = categories[i % categories.length];
      return {
        index: i,
        prompt: `Ultra-realistic professional headshot portrait of a professional. This must be the SAME person as in the reference photos — same face, same features, same identity. ${cat.fragment}. Professional business attire. Shot with Canon EOS R5, 85mm f/1.4 lens, shallow depth of field. Keep the face identical to the reference photos. Closed-mouth expression, no teeth visible, confident and approachable look.`,
        category: cat.category,
      };
    });
  };

  // Generate preview (3 watermarked images)
  const generatePreview = async () => {
    if (files.length < 5 || !session) return;
    setStep('generating-preview');
    setProgress(0);
    setGenError('');

    try {
      // 1. Upload reference images to Storage (skip if already uploaded from mobile)
      setProgress(10);
      let storagePaths: string[];
      if (mobileRefPaths.length >= 5) {
        storagePaths = mobileRefPaths.slice(0, 5);
      } else if (mobileRefPaths.length > 0) {
        // Mix mobile + desktop uploads
        storagePaths = [...mobileRefPaths];
        const desktopFiles = files.filter(f => f.size > 1); // skip placeholders
        for (let i = 0; storagePaths.length < 5 && i < desktopFiles.length; i++) {
          const file = desktopFiles[i];
          const ext = file.name.split('.').pop() || 'jpg';
          const path = `${user!.id}/${Date.now()}-desktop-${i}.${ext}`;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/reference-images/${path}`,
            { method: 'POST', headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': file.type, 'x-upsert': 'false' }, body: file }
          );
          if (res.ok) storagePaths.push(path);
        }
      } else {
        storagePaths = await uploadReferenceImages();
      }
      setRefPaths(storagePaths);
      setProgress(30);

      // 2. Build prompts
      const prompts = buildPreviewPrompts();

      // 3. Call create-job with correct format
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          referenceImagePaths: storagePaths,
          prompts,
          imageSize: '1K',
          aspectRatio: '1:1',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.jobId) throw new Error('No job ID returned');
      setJobId(data.jobId);
      setProgress(40);

      // 4. Poll for completion
      await pollJob(data.jobId, true);
    } catch (err) {
      console.error('Preview generation failed:', err);
      setGenError(err instanceof Error ? err.message : 'Generation failed');
      setStep('upload');
    }
  };

  // Poll job status
  const pollJob = async (id: string, isPreview: boolean) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-job-status?jobId=${id}`, {
        headers: { 'Authorization': `Bearer ${session!.access_token}` },
      });
      const data = await res.json();

      if (data.status === 'completed') {
        const pct = isPreview ? 100 : 100;
        setProgress(pct);

        if (isPreview) {
          // Get preview images (watermarked)
          setPreviewImages(data.portraits?.map((p: { url: string }) => p.url) || []);
          setStep('preview');
        } else {
          setGalleryImages(data.portraits?.map((p: { url: string }) => p.url) || []);
          setStep('gallery');
        }
        return;
      } else if (data.status === 'failed') {
        throw new Error(data.error || 'Job failed');
      }

      const completedCount = data.completedCount || 0;
      const total = data.totalPortraits || 1;
      setProgress(40 + Math.round((completedCount / total) * 55));
    }
  };

  // Check if Stripe is configured
  const stripeConfigured = typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string'
    && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 10
    && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('REPLACE');

  // Stripe checkout
  const handleCheckout = async (plan: PlanId) => {
    if (!stripeConfigured) return;
    setSelectedPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          jobId,
          locale,
          userId: user?.id,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  // Store reference paths for reuse after payment
  const [refPaths, setRefPaths] = useState<string[]>([]);

  // Generate full set after payment
  const generateFull = async (plan: PlanId) => {
    if (!session) return;
    setStep('generating-full');
    setProgress(0);

    try {
      // Use previously uploaded reference paths, or upload fresh
      let storagePaths = refPaths;
      if (!storagePaths.length) {
        storagePaths = await uploadReferenceImages();
        setRefPaths(storagePaths);
      }
      setProgress(20);

      const planData = PLANS[plan];
      const prompts = buildFullPrompts(planData.portraits);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          referenceImagePaths: storagePaths,
          prompts,
          imageSize: plan === 'premium' ? '4K' : '2K',
          aspectRatio: '1:1',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.jobId) throw new Error('No job ID');
      setJobId(data.jobId);
      setProgress(40);
      await pollJob(data.jobId, false);
    } catch (err) {
      console.error('Full generation failed:', err);
      setGenError(err instanceof Error ? err.message : 'Generation failed');
    }
  };

  // Check for payment success from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentSuccess = searchParams.get('payment');
    const plan = searchParams.get('plan') as PlanId;
    if (paymentSuccess === 'success' && plan && files.length >= 5) {
      generateFull(plan);
    }
  }, [files]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Loading
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.3rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>P</div>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
      </div>
    );
  }

  // Not authenticated — show auth modal directly over branded background
  if (!user) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24,
        background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0EB 100%)',
      }}>
        <AuthModal locale={locale} onClose={() => window.history.back()} onAuth={() => {}} />
      </div>
    );
  }

  // ==================== AUTHENTICATED APP ====================
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 100px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 0', marginBottom: 32, borderBottom: '1px solid var(--pp-border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1rem',
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A2E' }}>
            Portrait<span className="pp-gradient-text">Pro</span> AI
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>{user.email}</span>
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid #E8E6E1', borderRadius: 8,
            padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', color: '#666',
          }}>{t('logout')}</button>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        {[
          { key: 'upload', label: t('step1Title'), active: step === 'upload' },
          { key: 'preview', label: t('step2Title'), active: step === 'generating-preview' || step === 'preview' },
          { key: 'buy', label: t('step3Title'), active: step === 'checkout' || step === 'generating-full' || step === 'gallery' },
        ].map((s, i) => (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 100,
            background: s.active ? 'var(--pp-accent-soft)' : 'var(--pp-bg-warm)',
            color: s.active ? 'var(--pp-accent)' : 'var(--pp-text-muted)',
            fontWeight: s.active ? 700 : 500, fontSize: '0.9rem',
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
              background: s.active ? 'var(--pp-accent)' : 'var(--pp-border)',
              color: 'white', fontWeight: 700,
            }}>{i + 1}</span>
            {s.label}
          </div>
        ))}
      </div>

      {/* ===== STEP: Upload ===== */}
      {step === 'upload' && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
            {t('step1Title')}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 32 }}>{t('step1Desc')}</p>

          {/* Dropzone */}
          <div
            className={`pp-dropzone ${dragOver ? 'dragover' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: 20 }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} style={{ display: 'none' }} />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.4 }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ fontWeight: 600, color: '#1A1A2E' }}>{t('uploadArea')}</p>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>{t('uploadFormats')}</p>
          </div>

          {/* Thumbnails */}
          {previews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              {previews.map((p, i) => (
                <div key={i} style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '2px solid #E8E6E1' }}>
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => removeFile(i)} style={{
                    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: '0.9rem', color: files.length >= 5 ? '#16a34a' : '#888', marginBottom: 24 }}>
            {files.length}/10 {t('photosUploaded')} {files.length < 5 && `— ${t('minPhotos')}`}
          </p>

          {/* Webcam */}
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E8E6E1', marginBottom: 24 }}>
            {!webcamActive ? (
              <button onClick={startWebcam} className="pp-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                📸 {t('webcamBtn')}
              </button>
            ) : (
              <div>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4/3', marginBottom: 12 }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={capturePhoto} className="pp-btn-primary" disabled={files.length >= 10}>
                    <span>📸 {t('capture')}</span>
                  </button>
                  <button onClick={stopWebcam} className="pp-btn-secondary">{t('stopCam')}</button>
                </div>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div style={{
            background: 'white', borderRadius: 16, padding: 32, border: '1px solid #E8E6E1',
            textAlign: 'center', marginBottom: 32,
          }}>
            <p style={{ fontWeight: 600, marginBottom: 16, color: '#1A1A2E' }}>{t('orQR')}</p>
            <div style={{ display: 'inline-block', padding: 16, background: 'white', borderRadius: 12, border: '1px solid #E8E6E1' }}>
              <QRCodeSVG value={uploadUrl || 'https://kojalytics.com'} size={180} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: 12 }}>{t('scanQR')}</p>
          </div>

          {/* Error message */}
          {genError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
              padding: '14px 20px', marginBottom: 20, textAlign: 'center',
            }}>
              <p style={{ color: '#DC2626', fontSize: '0.9rem', fontWeight: 500 }}>
                {locale === 'de' ? 'Fehler: ' : 'Error: '}{genError}
              </p>
            </div>
          )}

          {/* Generate preview button */}
          <button
            onClick={generatePreview}
            className="pp-btn-primary"
            disabled={files.length < 5}
            style={{
              width: '100%', justifyContent: 'center', padding: '18px 36px', fontSize: '1.1rem',
              opacity: files.length < 5 ? 0.5 : 1,
            }}
          >
            <span>✨ {t('generatePreview')}</span>
          </button>
        </div>
      )}

      {/* ===== STEP: Generating Preview ===== */}
      {step === 'generating-preview' && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '2rem' }}>🎨</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
            {t('generating')}
          </h2>
          <div style={{ width: '100%', maxWidth: 400, margin: '24px auto', height: 8, borderRadius: 4, background: '#E8E6E1', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #E94560, #F27121)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ color: '#888' }}>{progress}%</p>
          <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
        </div>
      )}

      {/* ===== STEP: Preview (watermarked) ===== */}
      {step === 'preview' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
              {t('previewReady')}
            </h2>
            <p style={{ color: '#888' }}>{t('previewWatermark')}</p>
          </div>

          {/* Preview images */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
            {(previewImages.length > 0 ? previewImages : [1, 2, 3]).map((img, i) => (
              <div key={i} style={{
                aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(135deg, #E8E6E1, #D4D2CD)',
                position: 'relative', border: '1px solid #E8E6E1',
              }}>
                {typeof img === 'string' && img.startsWith('http') ? (
                  <img src={img} alt={`Preview ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                      <circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                    </svg>
                  </div>
                )}
                {/* Watermark overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    transform: 'rotate(-30deg)', color: 'rgba(233,69,96,0.25)',
                    fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.05em',
                    fontFamily: 'var(--font-pp-heading)',
                  }}>
                    PORTRAITPRO
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stripe not configured notice */}
          {!stripeConfigured && (
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 16,
              padding: '20px 28px', marginBottom: 32, textAlign: 'center',
              border: '1px solid #F59E0B',
            }}>
              <p style={{ fontWeight: 600, color: '#92400E', fontSize: '0.95rem' }}>
                🚧 {t('paymentSoon')}
              </p>
            </div>
          )}

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700, margin: '0 auto' }}>
            {/* Starter */}
            <div style={{
              background: 'white', borderRadius: 20, padding: '32px 24px',
              border: '1px solid #E8E6E1', textAlign: 'center',
              opacity: stripeConfigured ? 1 : 0.6,
            }}>
              <h3 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Starter</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 4 }}>€9,99</div>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 20 }}>12 Portraits</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left' }}>
                {PLANS.starter.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: '0.9rem', color: '#4A4A68' }}>
                    <span style={{ color: '#34D399' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('starter')} className="pp-btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled={!stripeConfigured}>
                {t('buyStarter')}
              </button>
            </div>

            {/* Premium */}
            <div style={{
              background: 'white', borderRadius: 20, padding: '32px 24px',
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #E94560, #F27121)',
              backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
              textAlign: 'center', position: 'relative',
              opacity: stripeConfigured ? 1 : 0.6,
            }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #E94560, #F27121)', color: 'white',
                padding: '4px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
              }}>Beliebt</div>
              <h3 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Premium</h3>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 4 }}>€20,99</div>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 20 }}>24 Portraits</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left' }}>
                {PLANS.premium.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: '0.9rem', color: '#4A4A68' }}>
                    <span style={{ color: '#E94560' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('premium')} className="pp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={!stripeConfigured}>
                <span>{t('buyPremium')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== STEP: Generating Full Set ===== */}
      {step === 'generating-full' && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #E94560, #F27121)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
            {t('processing')}
          </h2>
          <div style={{ width: '100%', maxWidth: 400, margin: '24px auto', height: 8, borderRadius: 4, background: '#E8E6E1', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #E94560, #F27121)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ color: '#888' }}>{progress}%</p>
        </div>
      )}

      {/* ===== STEP: Gallery ===== */}
      {step === 'gallery' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-pp-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
              {t('done')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
            {(galleryImages.length > 0 ? galleryImages : Array.from({ length: 12 }, (_, i) => i)).map((img, i) => (
              <div key={i} style={{
                aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden',
                background: 'linear-gradient(135deg, #E8E6E1, #D4D2CD)',
                position: 'relative', border: '1px solid #E8E6E1',
                cursor: 'pointer',
              }}>
                {typeof img === 'string' && img.startsWith('http') ? (
                  <img src={img} alt={`Portrait ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                      <circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                    </svg>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>Portrait {i + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="pp-btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>
              <span>⬇️ {t('download')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
