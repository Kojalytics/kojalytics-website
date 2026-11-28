// Customer-voice clips (content in src/content/testimonial-videos.json, files in public/stimmen). Shared by the
// homepage (server, JSON-LD) and the row (client), so it lives outside the "use client" component.
export type Cue = { start: number; end: number; en: string; de: string };
export type TestimonialVideo = { slug: string; version: number; role: { de: string; en: string }; cues: Cue[] };

export const videoSrc = (v: TestimonialVideo) => `/stimmen/${v.slug}-v${v.version}.mp4`;
export const posterSrc = (v: TestimonialVideo) => `/stimmen/${v.slug}-v${v.version}.webp`;
