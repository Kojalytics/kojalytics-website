import { locales, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/get-translations';
import PPNavigation from '@/components/aiheadshot/PPNavigation';
import PPHero from '@/components/aiheadshot/PPHero';
import PPSocialProof from '@/components/aiheadshot/PPSocialProof';
import PPHowItWorks from '@/components/aiheadshot/PPHowItWorks';

import PPGallery from '@/components/aiheadshot/PPGallery';
import PPFeatures from '@/components/aiheadshot/PPFeatures';
import PPAppPromo from '@/components/aiheadshot/PPAppPromo';
import PPPricing from '@/components/aiheadshot/PPPricing';
import PPUpload from '@/components/aiheadshot/PPUpload';
import PPFAQ from '@/components/aiheadshot/PPFAQ';
import PPCTA from '@/components/aiheadshot/PPCTA';
import PPTrustLogos from '@/components/aiheadshot/PPTrustLogos';
import PPReviews from '@/components/aiheadshot/PPReviews';
import PPFooter from '@/components/aiheadshot/PPFooter';
import PPFloatingCTA from '@/components/aiheadshot/PPFloatingCTA';

export default async function AIHeadshotPage({
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
        <PPTrustLogos />
        <PPHowItWorks t={t} />
        <PPGallery t={t} />
        <PPReviews t={t} />
        <PPFeatures t={t} />
        <PPAppPromo t={t} />
        <PPPricing t={t} locale={locale} />
        <PPUpload t={t} locale={locale} />
        <PPFAQ t={t} locale={locale} />
        <PPCTA t={t} locale={locale} />
      </main>
      <PPFooter t={t} locale={locale} />
      <PPFloatingCTA t={t} locale={locale} />
    </>
  );
}
