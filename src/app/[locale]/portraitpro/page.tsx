import { locales, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/get-translations';
import PPNavigation from '@/components/portraitpro/PPNavigation';
import PPHero from '@/components/portraitpro/PPHero';
import PPSocialProof from '@/components/portraitpro/PPSocialProof';
import PPHowItWorks from '@/components/portraitpro/PPHowItWorks';
import PPComparisons from '@/components/portraitpro/PPComparisons';
import PPGallery from '@/components/portraitpro/PPGallery';
import PPFeatures from '@/components/portraitpro/PPFeatures';
import PPPricing from '@/components/portraitpro/PPPricing';
import PPUpload from '@/components/portraitpro/PPUpload';
import PPFAQ from '@/components/portraitpro/PPFAQ';
import PPCTA from '@/components/portraitpro/PPCTA';
import PPFooter from '@/components/portraitpro/PPFooter';

export default async function PortraitProPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : 'de') as Locale;
  const t = await getTranslations(locale);

  return (
    <>
      <PPNavigation t={t} locale={locale} />
      <main>
        <PPHero t={t} locale={locale} />
        <PPSocialProof t={t} />
        <PPHowItWorks t={t} />
        <PPComparisons t={t} />
        <PPGallery t={t} />
        <PPFeatures t={t} />
        <PPPricing t={t} locale={locale} />
        <PPUpload t={t} locale={locale} />
        <PPFAQ t={t} locale={locale} />
        <PPCTA t={t} locale={locale} />
      </main>
      <PPFooter t={t} locale={locale} />
    </>
  );
}
