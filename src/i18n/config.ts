export const locales = ['de', 'en', 'es', 'fr', 'da', 'nl', 'sv'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  da: 'Dansk',
  nl: 'Nederlands',
  sv: 'Svenska',
};

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  da: '🇩🇰',
  nl: '🇳🇱',
  sv: '🇸🇪',
};

// Primary SEO keywords per locale
export const seoKeywords: Record<Locale, string[]> = {
  de: ['Bewerbungsfoto', 'KI Bewerbungsfoto', 'Bewerbungsfoto Generator', 'professionelles Bewerbungsfoto', 'Bewerbungsfoto erstellen', 'KI Passfoto', 'Bewerbungsbild'],
  en: ['AI Headshot', 'AI Headshot Generator', 'Professional Headshot', 'Business Photo AI', 'LinkedIn Photo Generator', 'Corporate Headshot AI'],
  es: ['Foto de currículum IA', 'Generador de fotos profesionales', 'Foto profesional IA', 'Foto de CV con inteligencia artificial'],
  fr: ['Photo CV IA', 'Générateur de photo professionnelle', 'Photo de candidature IA', 'Photo professionnelle intelligence artificielle'],
  da: ['Ansøgningsfoto AI', 'Professionelt ansøgningsfoto', 'AI pasfoto generator', 'CV foto kunstig intelligens'],
  nl: ['Sollicitatiefoto AI', 'Professionele pasfoto generator', 'AI bewerbingsfoto', 'Pasfoto generator kunstmatige intelligentie'],
  sv: ['CV-foto AI', 'Professionellt ansökningsfoto', 'AI porträttfoto generator', 'Passfoto artificiell intelligens'],
};
