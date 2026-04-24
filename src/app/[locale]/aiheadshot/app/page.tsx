'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { PLANS, type PlanId } from '@/lib/stripe';
import { locales, type Locale } from '@/i18n/config';
import AuthModal from '@/components/aiheadshot/auth/AuthModal';
import { QRCodeSVG } from 'qrcode.react';
import type { User, Session } from '@supabase/supabase-js';

// Inline translations for app page
const appLabels: Record<string, Record<string, string>> = {
  welcome: { de: 'Willkommen bei AI Headshot', en: 'Welcome to AI Headshot' },
  step1Title: { de: '1. Selfies hochladen', en: '1. Upload Selfies' },
  step1Desc: { de: 'Lade 5–10 Selfies hoch (gutes Licht, verschiedene Winkel)', en: 'Upload 5–10 selfies (good light, different angles)' },
  tipsTitle: { de: '📸 So wird dein Ergebnis perfekt', en: '📸 Tips for the best result' },
  tipFrontal: { de: 'Frontal ins Licht schauen', en: 'Face the light directly' },
  tipVariety: { de: 'Verschiedene Winkel (leicht links, rechts, oben)', en: 'Different angles (slightly left, right, up)' },
  tipExpression: { de: 'Mal ernst, mal freundlich lächelnd', en: 'Mix serious and friendly expressions' },
  tipBadGroup: { de: 'Keine Gruppenfotos', en: 'No group photos' },
  tipBadSunglasses: { de: 'Keine Sonnenbrille oder Kopfbedeckung', en: 'No sunglasses or hats' },
  tipBadBlur: { de: 'Scharfe, hochauflösende Fotos', en: 'Sharp, high-resolution photos' },
  fileRejected: { de: 'abgelehnt', en: 'rejected' },
  reasonTooSmall: { de: 'Auflösung zu gering (mind. 512×512 nötig)', en: 'Resolution too low (min 512×512)' },
  reasonTooBig: { de: 'Datei zu groß (max. 10 MB)', en: 'File too large (max 10 MB)' },
  reasonNotImage: { de: 'Kein gültiges Bildformat', en: 'Not a valid image format' },
  reasonValidating: { de: 'Wird geprüft…', en: 'Validating…' },
  reasonNoFace: { de: 'Kein Gesicht erkannt', en: 'No face detected' },
  reasonMultipleFaces: { de: 'Mehrere Gesichter — bitte Einzelfoto', en: 'Multiple faces — single portraits only' },
  reasonFaceTooSmall: { de: 'Gesicht im Bild zu klein', en: 'Face too small in frame' },
  reasonObscured: { de: 'Gesicht verdeckt (Brille, Haar, Maske?)', en: 'Face obscured (glasses, hair, mask?)' },
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
  couponTitle: { de: 'Gutschein-Code einlösen', en: 'Redeem coupon code' },
  couponPlaceholder: { de: 'Code eingeben (z. B. FREE50)', en: 'Enter code (e.g. FREE50)' },
  couponRedeem: { de: 'Einlösen', en: 'Redeem' },
  couponChoosePlan: { de: 'Wähle zuerst ein Paket', en: 'Select a plan first' },
  couponSuccess: { de: '✓ Code akzeptiert — Paket wird kostenlos freigeschaltet', en: '✓ Code accepted — unlocking your package for free' },
  couponInvalid: { de: 'Code ungültig', en: 'Invalid code' },
  couponExhausted: { de: 'Code wurde bereits zu oft verwendet', en: 'Code has already been used too many times' },
  couponExpired: { de: 'Code ist abgelaufen', en: 'Code has expired' },
  couponError: { de: 'Einlösen fehlgeschlagen', en: 'Redemption failed' },
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

export default function AIHeadshotApp() {
  const params = useParams();
  const locale = (locales.includes(params.locale as Locale) ? params.locale : 'de') as Locale;
  const t = (key: string) => appLabels[key]?.[locale] || appLabels[key]?.['en'] || key;

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload state
  // Single source of truth so file and preview counts cannot drift apart.
  // Prior bug: separate `files` and `previews` states + async FileReader +
  // mobile-upload broadcast racing against drag-drop uploads produced >10
  // preview thumbnails while files stayed at 10.
  // `validation` is the async face-quality verdict from Gemini — "pending"
  // while we're checking, "ok" if it passes, or a reason code otherwise.
  type ValidationVerdict = 'pending' | 'ok' | 'no_face' | 'multiple_faces' | 'face_too_small' | 'obscured';
  type Upload = { file: File; preview: string; validation: ValidationVerdict };
  const [uploads, setUploads] = useState<Upload[]>([]);
  const files = useMemo(() => uploads.map(u => u.file), [uploads]);
  const previews = useMemo(() => uploads.map(u => u.preview), [uploads]);
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
  // Extra polling state so the UI can show "X von Y fertig" and a reassurance
  // message when generation is taking unusually long (the server auto-heals
  // stuck portraits, but the user shouldn't stare at an unchanging 90%).
  const [jobCompleted, setJobCompleted] = useState(0);
  const [jobTotal, setJobTotal] = useState(0);
  const [slowGeneration, setSlowGeneration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponPlan, setCouponPlan] = useState<PlanId>('premium');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'redeeming' | 'success' | 'error'>('idle');
  const [couponMessage, setCouponMessage] = useState('');

  // ZIP download + format variant state
  const [zipBuilding, setZipBuilding] = useState(false);
  // Per-portrait regeneration state — indexes currently being regenerated and
  // a reg-count cap hint so we can grey out the button at max.
  const [regeneratingIdx, setRegeneratingIdx] = useState<Set<number>>(new Set());
  const [regenBlockedIdx, setRegenBlockedIdx] = useState<Set<number>>(new Set());

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

  // Flush a pending marketing opt-in intent once we have an authenticated
  // session. The AuthModal can't persist consent pre-auth (no user id yet,
  // and client-side data is untrusted) so it stashes it in localStorage and
  // we post it here tied to the real JWT.
  useEffect(() => {
    if (!session) return;
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('aih_marketing_opt_in_intent');
    if (!raw) return;
    try {
      const intent = JSON.parse(raw) as { opted_in?: boolean; locale?: string };
      fetch('/api/marketing/opt-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          opted_in: !!intent.opted_in,
          locale: intent.locale || locale,
          source: 'signup_modal',
        }),
      }).finally(() => {
        window.localStorage.removeItem('aih_marketing_opt_in_intent');
      });
    } catch {
      window.localStorage.removeItem('aih_marketing_opt_in_intent');
    }
  }, [session, locale]);

  // Keep the screen awake while the user is waiting on a generation. Mobile
  // browsers would otherwise dim/sleep after ~30s of no touches, which scared
  // users into thinking the app had frozen. Wake Lock is released once we
  // land on 'preview' or 'gallery' (or leave the page). Best-effort only —
  // Safari iOS added support in 16.4, still missing in some in-app browsers.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const awakeSteps: AppStep[] = ['generating-preview', 'generating-full'];
    if (!awakeSteps.includes(step)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wl = (navigator as any).wakeLock;
        if (!wl?.request) return;
        const s = await wl.request('screen');
        if (cancelled) { s.release?.(); return; }
        sentinel = s;
        s.addEventListener?.('release', () => { sentinel = null; });
      } catch {
        // Permission denied or not supported — fall through silently.
      }
    };
    request();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !sentinel) request();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sentinel?.release?.().catch(() => {});
      sentinel = null;
    };
  }, [step]);

  // QR upload URL — only pass uid (short), no JWT (too long for QR code)
  // Mobile uploads via API route which uses service role key
  // Short-lived signed token for the mobile-QR upload flow. Minted server-side
  // via /api/mobile-upload/token so the mobile browser can upload into the
  // right account without exposing a raw user id that anyone could guess.
  const [uploadToken, setUploadToken] = useState<string | null>(null);
  useEffect(() => {
    if (!session) { setUploadToken(null); return; }
    let aborted = false;
    fetch('/api/mobile-upload/token', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(d => { if (!aborted && d.token) setUploadToken(d.token); })
      .catch(() => {});
    return () => { aborted = true; };
  }, [session?.access_token]);

  const uploadUrl = typeof window !== 'undefined' && user && uploadToken
    ? `${window.location.origin}/${locale}/aiheadshot/app/mobile-upload?token=${uploadToken}`
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

      // Store the Storage paths — replace (not append) since server sends ALL paths from Storage
      setMobileRefPaths(paths);

      // Rebuild uploads atomically so files and thumbnails are always paired and
      // capped at 10 together — never partially applied.
      const thumbs = thumbnails || [];
      // Mobile uploads are already validated server-side by /api/mobile-upload
      // (via Gemini validate-selfie). Mark them as 'ok' here rather than
      // re-validating and burning more quota.
      const next: Upload[] = paths.slice(0, 10).map((path, i) => {
        const filename = path.split('/').pop() || `mobile-${i}.jpg`;
        return {
          file: new File([new Blob([''])], filename, { type: 'image/jpeg' }),
          preview: thumbs[i] || '',
          validation: 'ok' as ValidationVerdict,
        };
      });
      setUploads(next);
    });

    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [user?.id, session?.access_token]);

  // File handling — synchronous preview via URL.createObjectURL so file + preview
  // arrays stay pinned to the same length even if the user drops files faster
  // than an async FileReader could update state.
  // Basic quality check that runs before we accept a file. This is a fast
  // lightweight gate (no ML) that catches the obvious "garbage in" cases:
  // non-images, oversized files, and tiny thumbnails. Proper face detection
  // would need face-api.js (~5MB) and most users' selfies are reasonable, so
  // we lean on the selfie guidance UI for the rest.
  const MIN_DIM = 400; // px — anything smaller won't produce sharp portraits
  const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB — matches server cap

  const checkImage = (file: File): Promise<string | null> => new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve('not_image');
    if (file.size > MAX_FILE_SIZE) return resolve('too_large');
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < MIN_DIM || img.height < MIN_DIM) resolve('too_small');
      else resolve(null);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve('broken'); };
    img.src = url;
  });

  const [uploadWarn, setUploadWarn] = useState('');

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    const candidates = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (candidates.length === 0) return;

    // Validate in parallel and filter out bad ones.
    const results = await Promise.all(candidates.map(async f => ({
      file: f, err: await checkImage(f),
    })));
    const good = results.filter(r => !r.err).map(r => r.file);
    const rejected = results.filter(r => r.err);
    if (rejected.length) {
      const msg = rejected.map(r => {
        const reason = r.err === 'too_small'
          ? (locale === 'de' ? `zu klein (min. ${MIN_DIM}px)` : `too small (min ${MIN_DIM}px)`)
          : r.err === 'too_large'
            ? (locale === 'de' ? 'zu groß (max. 12 MB)' : 'too large (max 12MB)')
            : r.err === 'broken'
              ? (locale === 'de' ? 'defekt' : 'broken')
              : (locale === 'de' ? 'kein Bild' : 'not an image');
        return `${r.file.name}: ${reason}`;
      }).join(' · ');
      setUploadWarn(msg);
      // Auto-clear warning after 6s.
      setTimeout(() => setUploadWarn(''), 6000);
    } else {
      setUploadWarn('');
    }

    setUploads(prev => {
      const remaining = 10 - prev.length;
      if (remaining <= 0) return prev;
      const toAdd: Upload[] = good.slice(0, remaining).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        validation: 'pending' as ValidationVerdict,
      }));

      // Kick off async face-quality validation for each new file. Update the
      // upload's `validation` field when the verdict comes back so bad
      // selfies get flagged in the UI without blocking the upload flow.
      if (session) {
        toAdd.forEach(async (u) => {
          try {
            const compressed = await compressForValidation(u.file);
            const res = await fetch('/api/validate-selfie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ imageBase64: compressed, mimeType: 'image/jpeg' }),
            });
            const data = await res.json();
            const verdict = (data.verdict || 'ok') as ValidationVerdict;
            setUploads(prev2 => prev2.map(x =>
              x.file === u.file ? { ...x, validation: verdict } : x,
            ));
          } catch {
            setUploads(prev2 => prev2.map(x =>
              x.file === u.file ? { ...x, validation: 'ok' } : x,
            ));
          }
        });
      }

      return [...prev, ...toAdd];
    });
  }, [locale, session]);

  // Downscale + base64-encode the file before sending to the Gemini validator.
  // 512px is enough for a yes/no classification and keeps the request under
  // ~400KB regardless of the original phone-camera resolution.
  const compressForValidation = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 512;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no ctx'));
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1] || '';
        URL.revokeObjectURL(url);
        resolve(base64);
      } catch (err) { URL.revokeObjectURL(url); reject(err); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load')); };
    img.src = url;
  });

  const removeFile = (index: number) => {
    setUploads(prev => {
      const removed = prev[index];
      if (removed?.preview.startsWith('blob:')) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
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
    if (!videoRef.current || uploads.length >= 10) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      setUploads(prev => {
        if (prev.length >= 10) return prev;
        const file = new File([blob], `cam-${Date.now()}.jpg`, { type: 'image/jpeg' });
        // Webcam captures get the same async face-quality validation as
        // drag-drop uploads. Starts as pending; updates when the verdict
        // comes back from /api/validate-selfie.
        return [...prev, { file, preview: URL.createObjectURL(blob), validation: 'ok' as ValidationVerdict }];
      });
    }, 'image/jpeg', 0.9);
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setWebcamActive(false);
  };

  // Error state for user feedback
  const [genError, setGenError] = useState('');

  // Upload reference images via the mobile-upload API route (uses service role key server-side).
  // Cap at 10 (was 5) — more reference images give Gemini a stronger identity
  // signal and cut down the "drift to generic stock face" failures.
  const uploadReferenceImages = async (): Promise<string[]> => {
    const desktopFiles = files.filter(f => f.size > 1).slice(0, 10);
    const formData = new FormData();
    formData.append('uid', user!.id);
    formData.append('first', '1');
    formData.append('final', '1');
    desktopFiles.forEach(f => formData.append('files', f));

    const res = await fetch('/api/mobile-upload', {
      method: 'POST',
      body: formData,
      headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : undefined,
    });
    if (!res.ok) throw new Error('Upload failed');

    // List the uploaded files from storage via a quick status check.
    // /api/list-reference-images now requires a JWT and ignores query uids.
    const listRes = await fetch('/api/list-reference-images', {
      headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : undefined,
    });
    const listData = await listRes.json();
    return listData.paths || [];
  };

  // Identity anchors — stronger, trait-specific phrasing. In production we saw
  // ~33% of generations drift to a generic stock-businessman face (rounder
  // face, fuller beard, wavier hair). Naming concrete traits tells Gemini
  // what to extract from the references instead of leaning on a prior.
  const IDENTITY_ANCHOR = 'Show the EXACT person from the reference photos — identical face shape, skin tone, eye shape and color, eyebrows, nose, hair, and beard. Do NOT invent or alter facial features.';
  // FIDELITY_CLAUSE now enforces direct eye contact — every scene prompt inherits it,
  // so no more side-glances or off-camera looks. Individual prompts must NOT add
  // conflicting pose directives like "three-quarter profile" or "looking off-camera".
  const FIDELITY_CLAUSE = 'Looking directly at the camera with eye contact, head facing the camera. Face must match the reference photos exactly. Closed-mouth expression, no teeth visible. Professional retouching — smooth, healthy skin. Photorealistic, 8K quality, Canon EOS R5, 85mm f/1.4.';

  // 12 prompts across 6 categories. All enforce direct camera contact via
  // FIDELITY_CLAUSE — no side profiles, no off-camera gazes. Visual variety
  // lives in lighting, background, outfit color, and accessory choices.
  const MIX_PROMPTS: { category: string; prompt: string }[] = [
    // 2x Schwarzweiß — studio vs. fine-art monochrome, both facing camera
    {
      category: 'Schwarzweiß',
      prompt: `Professional black and white headshot of this professional person, wearing a navy blue suit with white shirt. ${IDENTITY_ANCHOR} High contrast monochrome, dramatic studio shadows, deep blacks and bright highlights. Confident expression. Grey studio backdrop. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Schwarzweiß',
      prompt: `Fine art black and white portrait of this professional person, wearing a charcoal grey suit with open-collar white shirt. ${IDENTITY_ANCHOR} Rembrandt lighting, elegant shadow on one cheek, soft tonal range. Dark backdrop. ${FIDELITY_CLAUSE}`,
    },
    // 2x Outdoor — golden hour vs. overcast urban
    {
      category: 'Outdoor',
      prompt: `Professional outdoor portrait of this professional person, wearing a dark navy blazer with light blue shirt. ${IDENTITY_ANCHOR} Golden hour sunlight, warm tones, soft green bokeh background, shallow depth of field. Relaxed confident expression. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Outdoor',
      prompt: `Professional outdoor portrait of this professional person, wearing a grey wool coat over a white shirt. ${IDENTITY_ANCHOR} Soft overcast daylight, cool natural tones, blurred modern urban background. Approachable expression. ${FIDELITY_CLAUSE}`,
    },
    // 2x Ganzkörper — arms crossed vs. relaxed office, both camera-facing
    {
      category: 'Ganzkörper',
      prompt: `Professional upper body portrait of this professional person, wearing a tailored navy suit and patterned tie. ${IDENTITY_ANCHOR} Arms crossed confidently, head to waist visible. 3-point studio lighting, grey backdrop. Confident expression. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Ganzkörper',
      prompt: `Professional upper body portrait of this professional person, wearing a dark blazer with no tie and open-collar white shirt. ${IDENTITY_ANCHOR} Relaxed standing pose, head to waist visible, hands relaxed. Modern office, blurred background bokeh. Natural lighting. ${FIDELITY_CLAUSE}`,
    },
    // 2x Studio — 3-point classic vs. clean butterfly
    {
      category: 'Studio',
      prompt: `Classic studio headshot of this professional person, wearing a dark charcoal suit with white shirt and burgundy tie. ${IDENTITY_ANCHOR} Traditional 3-point lighting, key light at 45°, fill light, hair light. Grey seamless backdrop. Head and shoulders. Corporate LinkedIn-style portrait. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Studio',
      prompt: `Clean modern studio portrait of this professional person, wearing a medium blue suit with crisp white shirt, no tie. ${IDENTITY_ANCHOR} Soft butterfly lighting, clean white backdrop with subtle gradient. Head and shoulders. Modern professional. ${FIDELITY_CLAUSE}`,
    },
    // 2x Natürlich — warm window vs. bright diffused
    {
      category: 'Natürlich',
      prompt: `Natural light portrait of this professional person, wearing a dark navy blazer and light blue dress shirt. ${IDENTITY_ANCHOR} Soft window light from the side, warm golden tones, approachable expression. Blurred interior café background. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Natürlich',
      prompt: `Natural light portrait of this professional person, wearing a soft grey blazer with pale blue shirt. ${IDENTITY_ANCHOR} Diffused daylight, bright airy feel, light neutral background, friendly expression. ${FIDELITY_CLAUSE}`,
    },
    // 2x Dramatisch — Rembrandt vs. split lighting, both facing camera
    {
      category: 'Dramatisch',
      prompt: `Dramatic editorial portrait of this professional person, wearing a black suit with black tie. ${IDENTITY_ANCHOR} Rembrandt lighting, deep shadows, low-key studio, dark moody backdrop. Confident expression. ${FIDELITY_CLAUSE}`,
    },
    {
      category: 'Dramatisch',
      prompt: `Cinematic portrait of this professional person, wearing a deep blue suit with white shirt. ${IDENTITY_ANCHOR} Split lighting, one side illuminated, high contrast, edge light on hair, dark background. ${FIDELITY_CLAUSE}`,
    },
  ];

  // Build prompts matching the iOS app format
  const buildPreviewPrompts = (): { index: number; prompt: string; category: string }[] => {
    // Pick 3 diverse categories for preview: Studio, Outdoor, Dramatisch
    const previewIndices = [6, 2, 10]; // Studio classic, Outdoor golden hour, Dramatic Rembrandt
    return previewIndices.map((mixIdx, i) => ({
      index: i,
      prompt: MIX_PROMPTS[mixIdx].prompt,
      category: MIX_PROMPTS[mixIdx].category,
    }));
  };

  const buildFullPrompts = (count: number): { index: number; prompt: string; category: string }[] => {
    return Array.from({ length: count }, (_, i) => {
      const mix = MIX_PROMPTS[i % MIX_PROMPTS.length];
      return {
        index: i,
        prompt: mix.prompt,
        category: mix.category,
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
      // 1. Get reference image paths (skip upload if already from mobile)
      setProgress(10);
      let storagePaths: string[];
      if (mobileRefPaths.length >= 5) {
        storagePaths = mobileRefPaths.slice(0, 10); // up to 10 refs for stronger identity lock
      } else if (mobileRefPaths.length > 0) {
        storagePaths = mobileRefPaths;
      } else {
        storagePaths = await uploadReferenceImages();
      }
      setRefPaths(storagePaths);
      setProgress(30);

      // 2. Build prompts
      const prompts = buildPreviewPrompts();

      // 3. Call create-job (preview path — no purchase required, but JWT is required server-side)
      const res = await fetch('/api/create-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          referenceImagePaths: storagePaths,
          prompts,
          // Preview now renders at 2K so it routes to Gemini Pro instead of
          // Flash. The teaser looks like the final quality — conversion bump
          // is worth the ~20-30s extra wait vs Flash's 5-10s.
          imageSize: '2K',
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
    // ~10 min cap (200 * 3s). Previously 6 min, which was too tight when the
    // last portrait stalled and the server's 3-min auto-heal then retried.
    const maxAttempts = 200;
    setJobCompleted(0);
    setJobTotal(0);
    setSlowGeneration(false);
    let lastProgress = -1;
    let stableSince = Date.now();

    // Streaming: as portraits come back completed we surface them immediately
    // instead of making the user stare at a progress bar until all 12 are done.
    // Keyed by portrait index so order stays stable even when workers finish
    // out of order.
    const setImagesByIndex = (portraits: Array<{ index: number; imageUrl?: string; status?: string }>) => {
      const ready = portraits
        .filter(p => p.status === 'completed' && p.imageUrl)
        .sort((a, b) => a.index - b.index)
        .map(p => p.imageUrl as string);
      if (isPreview) setPreviewImages(ready);
      else setGalleryImages(ready);
    };

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const res = await fetch(`/api/get-job-status?jobId=${id}`, {
        headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : undefined,
      });
      const data = await res.json();

      // Stream completed portraits each poll — don't wait for all.
      if (Array.isArray(data.portraits)) setImagesByIndex(data.portraits);

      if (data.status === 'completed') {
        setProgress(100);
        setSlowGeneration(false);
        setStep(isPreview ? 'preview' : 'gallery');
        return;
      } else if (data.status === 'failed') {
        throw new Error(data.error || 'Job failed');
      }

      const completedCount = data.completedCount || 0;
      const total = data.totalPortraits || 1;
      setJobCompleted(completedCount);
      setJobTotal(total);
      const nextProgress = 40 + Math.round((completedCount / total) * 55);
      setProgress(nextProgress);

      // If progress hasn't advanced for 45s, flag it so we can tell the user
      // the server is retrying the stuck portrait. The server-side auto-heal
      // kicks in at 180s, so the client banner gives them confidence before
      // the actual recovery.
      if (nextProgress !== lastProgress) {
        lastProgress = nextProgress;
        stableSince = Date.now();
        setSlowGeneration(false);
      } else if (Date.now() - stableSince > 45_000) {
        setSlowGeneration(true);
      }
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

  // Redeem coupon — bypasses Stripe entirely when discount == 100
  const handleRedeemCoupon = async () => {
    if (!session || !couponCode.trim()) return;
    setCouponStatus('redeeming');
    setCouponMessage('');
    try {
      const res = await fetch('/api/redeem-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          plan: couponPlan,
          jobId,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setCouponStatus('error');
        if (data.error === 'invalid') setCouponMessage(t('couponInvalid'));
        else if (data.error === 'exhausted') setCouponMessage(t('couponExhausted'));
        else if (data.error === 'expired') setCouponMessage(t('couponExpired'));
        else setCouponMessage(t('couponError'));
        return;
      }

      setCouponStatus('success');
      setCouponMessage(t('couponSuccess'));

      if (data.discountPercent === 100) {
        // Full discount → skip Stripe, generate full set immediately
        setSelectedPlan(couponPlan);
        generateFull(couponPlan);
      }
    } catch (err) {
      console.error('Coupon redeem failed:', err);
      setCouponStatus('error');
      setCouponMessage(t('couponError'));
    }
  };

  // Generate full set after payment. `prefetchedPaths` lets the Stripe redirect
  // handler hand in paths it just fetched from Storage — setRefPaths is async so
  // we cannot rely on reading it back inside this same call.
  const generateFull = async (plan: PlanId, prefetchedPaths?: string[]) => {
    if (!session) return;
    setStep('generating-full');
    setProgress(0);

    try {
      let storagePaths: string[] = prefetchedPaths || refPaths;
      if (!storagePaths.length && mobileRefPaths.length >= 5) {
        storagePaths = mobileRefPaths.slice(0, 10); // up to 10 refs for stronger identity lock
      } else if (!storagePaths.length && mobileRefPaths.length > 0) {
        storagePaths = mobileRefPaths;
      } else if (!storagePaths.length) {
        storagePaths = await uploadReferenceImages();
      }
      setRefPaths(storagePaths);
      setProgress(20);

      const planData = PLANS[plan];
      const prompts = buildFullPrompts(planData.portraits);

      const res = await fetch('/api/create-job', {
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

  // Check for payment success from URL. After Stripe redirects the browser
  // back, the page reloads fresh — the uploads state is gone, so we reach into
  // Storage directly for the reference paths the user just uploaded before
  // checkout. Also confirms the Stripe session server-side so the purchase row
  // is guaranteed to exist before generateFull calls /api/create-job.
  const [paymentHandled, setPaymentHandled] = useState(false);
  useEffect(() => {
    if (paymentHandled || !session || !user) return;
    const searchParams = new URLSearchParams(window.location.search);
    const paymentSuccess = searchParams.get('payment');
    const plan = searchParams.get('plan') as PlanId;
    const sessionId = searchParams.get('session_id');
    if (paymentSuccess !== 'success' || !plan) return;

    setPaymentHandled(true);
    (async () => {
      if (sessionId) {
        try {
          await fetch('/api/stripe/confirm-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ sessionId }),
          });
        } catch (err) {
          console.error('confirm-session failed:', err);
        }
      }

      // Fetch reference paths from Storage. The user uploaded these before
      // clicking Buy; they survive the page reload where client state does not.
      // list-reference-images sorts ascending by created_at, so the tail is the
      // most recent batch — take up to the last 10.
      try {
        const listRes = await fetch('/api/list-reference-images', {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });
        const listData = await listRes.json();
        const allPaths: string[] = listData.paths || [];
        const paths = allPaths.slice(-10);
        if (paths.length < 5) {
          setGenError('Reference images missing. Please upload again.');
          setPaymentHandled(false);
          return;
        }
        generateFull(plan, paths);
      } catch (err) {
        console.error('Post-payment rehydrate failed:', err);
        setGenError(err instanceof Error ? err.message : 'Post-payment load failed');
      }
    })();
  }, [session, user, paymentHandled]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Canvas-based center-crop — writes `source` into a new canvas of size
  // `width`×`height` and returns a blob. Used for LinkedIn-profile (square)
  // and 16:9 banner variants so users get ready-to-upload assets.
  const centerCropToBlob = (
    source: HTMLImageElement,
    width: number,
    height: number,
    mimeType = 'image/jpeg',
    quality = 0.92,
  ): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.resolve(null);
    // "Cover" fit — scale so the shorter side fills the target, then center-crop.
    const scale = Math.max(width / source.width, height / source.height);
    const drawW = source.width * scale;
    const drawH = source.height * scale;
    const dx = (width - drawW) / 2;
    const dy = (height - drawH) / 2;
    ctx.drawImage(source, dx, dy, drawW, drawH);
    return new Promise(resolve => canvas.toBlob(resolve, mimeType, quality));
  };

  const loadImage = (url: string): Promise<HTMLImageElement | null> => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

  // Re-generates a single portrait the user is unhappy with. Capped at 3
  // retries per portrait server-side; on success the polling loop picks up
  // the new imageUrl and the grid re-renders that tile.
  const regeneratePortrait = async (index: number) => {
    if (!session || !jobId) return;
    if (regeneratingIdx.has(index) || regenBlockedIdx.has(index)) return;

    setRegeneratingIdx(prev => new Set(prev).add(index));
    // Clear the old image from the grid so the user sees a loading state.
    setGalleryImages(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });

    try {
      const res = await fetch('/api/regenerate-portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ jobId, index }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'regen_limit') {
          setRegenBlockedIdx(prev => new Set(prev).add(index));
        }
        setRegeneratingIdx(prev => { const next = new Set(prev); next.delete(index); return next; });
        return;
      }
      // Poll for just this portrait to come back completed.
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`/api/get-job-status?jobId=${jobId}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` },
        });
        const statusData = await statusRes.json();
        const p = (statusData.portraits || []).find((x: { index: number }) => x.index === index);
        if (p?.status === 'completed' && p.imageUrl) {
          setGalleryImages(prev => {
            const next = [...prev];
            next[index] = p.imageUrl;
            return next;
          });
          break;
        }
        if (p?.status === 'failed') break;
      }
    } catch (err) {
      console.error('regenerate failed:', err);
    } finally {
      setRegeneratingIdx(prev => { const next = new Set(prev); next.delete(index); return next; });
    }
  };

  // Bundles all completed portraits plus square LinkedIn and 16:9 banner
  // variants into a single ZIP. Runs fully client-side; the signed URLs are
  // already scoped to this user via the get-job-status endpoint.
  const downloadAllAsZip = async () => {
    if (zipBuilding) return;
    const urls = galleryImages.filter(u => typeof u === 'string' && u.startsWith('http'));
    if (urls.length === 0) return;

    setZipBuilding(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const originalFolder = zip.folder('original') ?? zip;
      const squareFolder = zip.folder('linkedin-profile-square') ?? zip;
      const bannerFolder = zip.folder('linkedin-banner-16x9') ?? zip;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
          // Original — fetch the bytes and add as-is so we don't re-encode /
          // lose quality from Gemini's output.
          const res = await fetch(url);
          const blob = await res.blob();
          const ext = blob.type.includes('png') ? 'png' : 'jpg';
          originalFolder.file(`portrait-${String(i + 1).padStart(2, '0')}.${ext}`, blob);

          // Decode once for the crop variants.
          const img = await loadImage(url);
          if (!img) continue;

          const square = await centerCropToBlob(img, 1024, 1024);
          if (square) squareFolder.file(`portrait-${String(i + 1).padStart(2, '0')}-square.jpg`, square);

          const banner = await centerCropToBlob(img, 1584, 396);
          if (banner) bannerFolder.file(`portrait-${String(i + 1).padStart(2, '0')}-banner.jpg`, banner);
        } catch (err) {
          console.error(`Zip: portrait ${i + 1} failed`, err);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `ai-headshot-portraits-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('ZIP build failed:', err);
    } finally {
      setZipBuilding(false);
    }
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
            color: 'white', fontWeight: 800, fontSize: '1.1rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>AI</div>
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
          }}>AI</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1A2E' }}>
            <span className="pp-gradient-text">AI</span> Headshot
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
          <p style={{ color: '#6b7280', marginBottom: 24 }}>{t('step1Desc')}</p>

          {/* Selfie guidance — shows the poses/variations the user should
              shoot so Gemini has enough angle variety for a solid identity
              lock. Vague instructions ("verschiedene Winkel") left users
              uploading 5 near-identical selfies, which was a root cause of
              identity drift in outputs. */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10, marginBottom: 20,
          }}>
            {([
              { emoji: '😊', de: 'Frontal, leichtes Lächeln', en: 'Front-facing, slight smile' },
              { emoji: '↩️', de: 'Kopf leicht nach links', en: 'Head slightly left' },
              { emoji: '↪️', de: 'Kopf leicht nach rechts', en: 'Head slightly right' },
              { emoji: '😐', de: 'Neutral frontal', en: 'Neutral front' },
              { emoji: '☀️', de: 'Tageslicht, nah am Fenster', en: 'Daylight, near window' },
            ] as const).map((hint, i) => (
              <div key={i} style={{
                padding: '12px 10px', textAlign: 'center',
                background: '#FAFAF8', borderRadius: 10,
                border: '1px solid #EFECE6',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{hint.emoji}</div>
                <div style={{ fontSize: '0.75rem', color: '#555', lineHeight: 1.3 }}>
                  {locale === 'de' ? hint.de : hint.en}
                </div>
              </div>
            ))}
          </div>

          {/* Validation warnings (too small, too large, broken files) */}
          {uploadWarn && (
            <div style={{
              padding: '10px 14px', marginBottom: 16, borderRadius: 10,
              background: '#FFF0F0', border: '1px solid #F5B8B8',
              fontSize: '0.82rem', color: '#8A2F2F', lineHeight: 1.5,
            }}>
              <strong>{locale === 'de' ? 'Übersprungen: ' : 'Skipped: '}</strong>
              {uploadWarn}
            </div>
          )}

          {/* Don't-dos — the other half of garbage-in prevention */}
          <div style={{
            padding: '10px 14px', marginBottom: 24, borderRadius: 10,
            background: '#FFF8F0', border: '1px solid #F5DDB8',
            fontSize: '0.82rem', color: '#8A6B2F', lineHeight: 1.5,
          }}>
            <strong>{locale === 'de' ? 'Bitte vermeiden: ' : 'Please avoid: '}</strong>
            {locale === 'de'
              ? 'Sonnenbrillen · Hüte · Gruppenfotos · stark gefilterte Bilder · unscharfe Fotos · verdecktes Gesicht'
              : 'sunglasses · hats · group photos · heavily filtered shots · blurry images · covered face'}
          </div>

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

          {/* Thumbnails — each one shows its Gemini face-validation verdict
              so the user can tell at a glance which selfies are problematic
              (no face detected, multiple faces, sunglasses, etc.). Bad ones
              get a red ring and a reason badge; the user can click ✕ to
              remove. We deliberately don't auto-remove rejected files — the
              verdict can be wrong and the user should have the final say. */}
          {uploads.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              {uploads.map((u, i) => {
                const bad = u.validation !== 'ok' && u.validation !== 'pending';
                const reasonKey = u.validation === 'no_face' ? 'reasonNoFace'
                  : u.validation === 'multiple_faces' ? 'reasonMultipleFaces'
                  : u.validation === 'face_too_small' ? 'reasonFaceTooSmall'
                  : u.validation === 'obscured' ? 'reasonObscured'
                  : null;
                return (
                  <div key={i} style={{
                    width: 90, height: 90, borderRadius: 12, overflow: 'hidden', position: 'relative',
                    border: bad ? '2px solid #ef4444' : '2px solid #E8E6E1',
                  }}>
                    <img src={u.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: bad ? 0.55 : 1 }} />
                    {u.validation === 'pending' && (
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.5)',
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          border: '2px solid #E94560', borderTopColor: 'transparent',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                      </div>
                    )}
                    {bad && reasonKey && (
                      <div title={t(reasonKey)} style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3px 5px',
                        background: 'rgba(239,68,68,0.92)', color: 'white', fontSize: '0.62rem',
                        lineHeight: 1.2, fontWeight: 600, textAlign: 'center',
                      }}>{t(reasonKey)}</div>
                    )}
                    <button onClick={() => removeFile(i)} style={{
                      position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                  </div>
                );
              })}
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
                    AI HEADSHOT
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

          {/* Coupon code input */}
          <div style={{
            maxWidth: 520, margin: '40px auto 0', padding: '24px 28px',
            background: 'white', borderRadius: 16, border: '1px solid #E8E6E1',
          }}>
            <h4 style={{
              fontFamily: 'var(--font-pp-heading)', fontSize: '1rem', fontWeight: 700,
              marginBottom: 16, color: '#1A1A2E', textAlign: 'center',
            }}>
              🎟️ {t('couponTitle')}
            </h4>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setCouponPlan('starter')}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  border: couponPlan === 'starter' ? '2px solid var(--pp-accent)' : '1px solid #E8E6E1',
                  background: couponPlan === 'starter' ? 'var(--pp-accent-soft)' : 'white',
                  color: couponPlan === 'starter' ? 'var(--pp-accent)' : '#666',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Starter (12)
              </button>
              <button
                onClick={() => setCouponPlan('premium')}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  border: couponPlan === 'premium' ? '2px solid var(--pp-accent)' : '1px solid #E8E6E1',
                  background: couponPlan === 'premium' ? 'var(--pp-accent-soft)' : 'white',
                  color: couponPlan === 'premium' ? 'var(--pp-accent)' : '#666',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Premium (24)
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  if (couponStatus !== 'idle') {
                    setCouponStatus('idle');
                    setCouponMessage('');
                  }
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRedeemCoupon(); }}
                placeholder={t('couponPlaceholder')}
                disabled={couponStatus === 'redeeming' || couponStatus === 'success'}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  border: '1px solid #E8E6E1', fontSize: '0.95rem',
                  fontFamily: 'monospace', letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              />
              <button
                onClick={handleRedeemCoupon}
                disabled={!couponCode.trim() || couponStatus === 'redeeming' || couponStatus === 'success'}
                className="pp-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {couponStatus === 'redeeming' ? '...' : t('couponRedeem')}
              </button>
            </div>

            {couponMessage && (
              <p style={{
                marginTop: 12, fontSize: '0.85rem', textAlign: 'center',
                color: couponStatus === 'success' ? '#059669' : '#DC2626',
                fontWeight: 600,
              }}>
                {couponMessage}
              </p>
            )}
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
          <p style={{ color: '#555', fontWeight: 600, marginBottom: 4 }}>
            {jobTotal > 0 ? `${jobCompleted} / ${jobTotal} ${locale === 'de' ? 'Portraits fertig' : 'portraits ready'}` : `${progress}%`}
          </p>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>{progress}%</p>
          {slowGeneration && (
            <p style={{
              color: '#888', fontSize: '0.9rem', marginTop: 20, maxWidth: 480,
              marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5,
            }}>
              {locale === 'de'
                ? 'Das letzte Bild dauert diesmal etwas länger als üblich. Unser System erkennt das automatisch und startet es neu — kein Grund zur Sorge, deine Portraits kommen gleich.'
                : 'The last image is taking a bit longer than usual. Our system detects this automatically and retries it — no worries, your portraits are on their way.'}
            </p>
          )}

          {/* Streaming grid — portraits appear here as each one completes,
              so the user sees progress instead of staring at a percentage bar. */}
          {galleryImages.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 14, marginTop: 40, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'left',
            }}>
              {Array.from({ length: jobTotal || 12 }).map((_, i) => {
                const img = galleryImages[i];
                return (
                  <div key={i} style={{
                    aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden',
                    background: img ? 'transparent' : 'linear-gradient(135deg, #E8E6E1, #D4D2CD)',
                    border: '1px solid #E8E6E1', position: 'relative',
                  }}>
                    {img ? (
                      <img src={img} alt={`Portrait ${i + 1}`} style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        animation: 'fadeIn 0.4s ease-out',
                      }} />
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: '100%', flexDirection: 'column', gap: 6,
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          border: '2px solid #E94560', borderTopColor: 'transparent',
                          animation: 'spin 1s linear infinite',
                        }} />
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>
                          {locale === 'de' ? 'Generiert...' : 'Generating...'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </div>
          )}
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
            {(galleryImages.length > 0 ? galleryImages : Array.from({ length: 12 }, (_, i) => i)).map((img, i) => {
              const isRegenerating = regeneratingIdx.has(i);
              const isRegenBlocked = regenBlockedIdx.has(i);
              const hasImage = typeof img === 'string' && img.startsWith('http');
              return (
                <div key={i} style={{
                  aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden',
                  background: 'linear-gradient(135deg, #E8E6E1, #D4D2CD)',
                  position: 'relative', border: '1px solid #E8E6E1',
                }}>
                  {hasImage && !isRegenerating ? (
                    <img
                      src={img as string}
                      alt={`Portrait ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={async () => {
                        try {
                          const res = await fetch(img as string);
                          const blob = await res.blob();
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(blob);
                          a.download = `portrait-${i + 1}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(a.href);
                        } catch (err) {
                          console.error('Download failed:', err);
                        }
                      }}
                    />
                  ) : isRegenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: '2.5px solid #E94560', borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        {locale === 'de' ? 'Neu generieren…' : 'Regenerating…'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                        <circle cx="12" cy="8" r="4" /><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                      </svg>
                      <span style={{ fontSize: '0.7rem', color: '#888' }}>Portrait {i + 1}</span>
                    </div>
                  )}

                  {/* Regenerate — only shown on completed tiles */}
                  {hasImage && !isRegenerating && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); regeneratePortrait(i); }}
                      disabled={isRegenBlocked}
                      title={isRegenBlocked
                        ? (locale === 'de' ? 'Maximum erreicht (3×)' : 'Max regenerations reached (3)')
                        : (locale === 'de' ? 'Neu generieren' : 'Regenerate')}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 36, height: 36, borderRadius: 18,
                        background: 'rgba(255,255,255,0.92)', border: 'none',
                        cursor: isRegenBlocked ? 'not-allowed' : 'pointer',
                        opacity: isRegenBlocked ? 0.45 : 0.92,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'transform 0.15s',
                      }}
                      onMouseEnter={e => !isRegenBlocked && (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <div style={{ textAlign: 'center' }}>
            <button
              className="pp-btn-primary"
              style={{ padding: '18px 48px', fontSize: '1.1rem' }}
              disabled={zipBuilding}
              onClick={() => downloadAllAsZip()}
            >
              <span>{zipBuilding ? (locale === 'de' ? 'Wird vorbereitet...' : 'Preparing...') : `⬇️ ${t('download')}`}</span>
            </button>
            <p style={{ fontSize: '0.82rem', color: '#888', marginTop: 12 }}>
              {locale === 'de'
                ? 'ZIP enthält Original-Portraits (3:4), LinkedIn-Profil-Zuschnitt (quadratisch) und Banner-Zuschnitt (16:9)'
                : 'ZIP contains original portraits (3:4), LinkedIn profile crop (square), and banner crop (16:9)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
