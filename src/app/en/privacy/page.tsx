import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import type { Metadata } from "next";
import { alternates, href } from "@/lib/i18n";
import { planText } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Privacy policy of Kojalytics: which data the website, the Koja apps and AI Headshot process, which services we use and what rights you have.",
  alternates: alternates("en", "/datenschutz"),
};

const USA_TRANSFER =
  "The basis for a transfer to the USA is the European Commission's adequacy decision on the EU-US Data Privacy Framework (Art. 45 GDPR), insofar as the recipient is certified under it, and otherwise the European Commission's standard contractual clauses (Art. 46(2)(c) GDPR).";

const pad = "px-5 md:px-10";

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Title and contents */}
        <section className="rail">
          <SectionBar index="01" label="Legal" meta="GDPR · Part A and Part B" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in hyphens-auto break-words text-[clamp(2rem,4vw,3.2rem)]">
              Privacy policy
            </h1>
            <p className="hud rise-in mt-5 [--i:1]">Last updated: 13 November 2026</p>
            <p className="rise-in mt-8 max-w-3xl border border-border border-t-2 border-t-foreground p-4 text-sm leading-relaxed text-muted [--i:2]">
              This English version is a courtesy translation. Only the{" "}
              <Link href="/datenschutz" className="text-foreground underline underline-offset-4">
                German version (Datenschutzerklärung)
              </Link>{" "}
              is legally binding.
            </p>
            <p className="rise-in mt-6 max-w-3xl text-lg leading-relaxed text-muted [--i:2]">
              This page explains which personal data we process when you visit kojalytics.com, buy and use the Koja apps or
              use the iOS app AI Headshot. Part A applies to the website and the Koja apps, Part B to AI Headshot.
            </p>
            <nav aria-label="Contents" className="rise-in mt-10 max-w-3xl border border-border [--i:3]">
              <ul className="cells sm:grid-cols-2">
                <li>
                  <a href="#website" className="group flex min-h-14 items-center justify-between gap-4 p-5 font-medium hover:text-accent">
                    <span>Part A: Website kojalytics.com and Koja apps</span>
                    <ArrowDown size={16} className="shrink-0 text-faint group-hover:text-accent" aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="#ai-headshot" className="group flex min-h-14 items-center justify-between gap-4 p-5 font-medium hover:text-accent">
                    <span>Part B: AI Headshot (iOS app)</span>
                    <ArrowDown size={16} className="shrink-0 text-faint group-hover:text-accent" aria-hidden />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        {/* 02 Part A */}
        <section id="website" className="rail crosshairs scroll-mt-12">
          <SectionBar index="02" label="Part A" meta="Website and Koja apps · Sections 1–13" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-4xl text-[clamp(1.8rem,3.4vw,2.8rem)]" data-reveal>
              Part <span className="text-highlight">A</span>: Website kojalytics.com and Koja apps
            </h2>
          </div>
          <div className="divide-y divide-border border-t border-border">

            <Section title="1. Controller">
              <P>
                The controller responsible for data processing within the meaning of the General Data Protection Regulation
                (GDPR, in German DSGVO) is:
              </P>
              <P>
                Kojalytics
                <br />
                Farzad Khojazada, sole proprietorship (Einzelunternehmen)
                <br />
                Am Diggen 40i
                <br />
                21077 Hamburg
                <br />
                Germany
                <br />
                Email: <SupportMail />
              </P>
            </Section>

            <Section title="2. Hosting and server log files">
              <P>
                Our website is hosted by Vercel Inc. (USA). Each time a page is accessed, Vercel automatically processes
                data that your browser transmits (server log files):
              </P>
              <List>
                <li>IP address</li>
                <li>date and time of access</li>
                <li>page or file accessed and HTTP status code</li>
                <li>referrer URL (the page previously visited), if transmitted</li>
                <li>browser, operating system and device type (user agent)</li>
              </List>
              <P>
                We need this data to deliver the website, to ensure its security and stability and to fend off attacks.
                The legal basis is our legitimate interest in secure and error-free operation (Art. 6(1)(f) GDPR); access
                to your device is technically necessary for this (§ 25(2) no. 2 of the German Telecommunications Digital
                Services Data Protection Act, TDDDG).
              </P>
              <P>
                Vercel processes the data on our behalf (Art. 28 GDPR) and operates a global server network, so data may
                also be processed in the USA. {USA_TRANSFER} We do not store the log data permanently; Vercel deletes it
                according to its own retention periods. We only analyse it when this is necessary for troubleshooting or
                to fend off attacks.
              </P>
              <P>
                We load fonts and images from our own server. No connection to Google Fonts or other third-party providers
                is established for this. The connection to our website is encrypted with TLS (HTTPS).
              </P>
            </Section>

            <Section title="3. Consent and storage of your choice">
              <P>
                On your first visit, we ask you in a banner whether you allow Google Ads, the Meta Pixel and Microsoft
                Clarity (sections 4 to 6). Until you have clicked “Allow all cookies”, we do not load any of these
                services, and they cannot set cookies.
              </P>
              <P>
                We store your choice (“Allow all cookies” or “Reject optional cookies”) in your browser's local storage
                (localStorage) under the key <code className="font-mono text-[0.92em]">kj-consent-v1</code>. This entry is
                not a cookie, is not transmitted to us and remains stored until you delete it in your browser or change
                your choice. It is technically necessary so that we do not ask you again every time you open a page
                (§ 25(2) no. 2 TDDDG, Art. 6(1)(f) GDPR).
              </P>
              <P>
                Without consent we also set one technically necessary cookie:{" "}
                <code className="font-mono text-[0.92em]">kj-lang</code> remembers for one year that you switched from the English to
                the German version. It contains no identifier and only serves to display the website (§ 25(2) no. 2 TDDDG,
                Art. 6(1)(f) GDPR).
              </P>
              <P>
                The legal basis for the services in sections 4 to 6 is your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG).
                It is voluntary. You can withdraw it at any time with effect for the future: click “Cookie settings” in
                the footer and then “Reject optional cookies”. The page then reloads without these services. Cookies that
                the services have already set remain in your browser until they expire; you can delete them in your
                browser settings. The withdrawal does not affect the lawfulness of the processing carried out before the
                withdrawal.
              </P>
            </Section>

            <Section title="4. Google Ads (conversion tracking and remarketing)">
              <Facts
                items={[
                  ["Provider", "Google Ireland Limited, Ireland (“Google”)."],
                  [
                    "Purpose",
                    "With your consent, we load the Google tag (gtag.js) for our Google Ads account AW-17685521393. We use it to measure whether visitors reach us through our ads and then carry out certain actions (conversion tracking). Google may also use the data to show you relevant ads from us on other websites and in Google services (remarketing) and to manage the delivery of our ads.",
                  ],
                  [
                    "Data",
                    "IP address, browser and device information, pages visited and referrer, time, cookie identifiers and, if you come via a Google ad, the click ID. We also report these events to Google: page view, view of an app page, click on a download button, click on “Send the link to your computer” (on devices without macOS or Windows), start of checkout (with plan and price) and completed purchase (with amount, currency and order number). If you are signed in to a Google account, Google may link the data to your account.",
                  ],
                  [
                    "Retention period",
                    "Google sets, among others, the cookie _gcl_au, which according to Google remains stored for up to 90 days; cookies on Google domains may last longer. Google determines how long it stores the data on its servers.",
                  ],
                  [
                    "Legal basis",
                    "Your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG). You can withdraw it at any time via “Cookie settings” in the footer.",
                  ],
                  [
                    "Third country",
                    "Google may transfer data to Google LLC in the USA. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="5. Meta Pixel">
              <Facts
                items={[
                  ["Provider", "Meta Platforms Ireland Limited, Ireland (“Meta”)."],
                  [
                    "Purpose",
                    "With your consent, we load the Meta Pixel. We use it to measure how successful our ads on Facebook and Instagram are, and we can show visitors to our website relevant ads there (retargeting) and build audiences for our ads.",
                  ],
                  [
                    "Data",
                    "IP address, browser and device information, pages visited and referrer, time, cookie identifiers (e.g. _fbp) and these events: PageView (page view), ViewContent (view of an app page), Lead (click on a download button), SendToMac (click on “Send the link to your computer” on devices without macOS or Windows), InitiateCheckout (start of checkout with plan and price) and Purchase or Subscribe (completed purchase or completed subscription with amount, currency and order number). We also report the completed purchase from our server via Meta's Conversions API, so that it arrives even if a browser blocks the pixel: with order number, amount, currency, IP address, browser identifier, the cookie identifiers _fbp and _fbc and your email address as a hash value (SHA-256, not in plain text). This, too, only happens with your consent. If you are logged in to Facebook or Instagram, Meta may link the data to your account.",
                  ],
                  [
                    "Joint controllership",
                    "We and Meta are joint controllers for the collection of the data on our website and its transmission to Meta (Art. 26 GDPR). The addendum for controllers (“Controller Addendum”) to Meta's business terms applies to this. Meta makes the essential content of this agreement available and is responsible for requests concerning the data stored at Meta; however, you can also contact us. Meta alone is responsible for the further processing at Meta.",
                  ],
                  [
                    "Retention period",
                    "According to Meta, the cookie _fbp remains stored for 90 days. Meta determines how long it stores the data on its servers.",
                  ],
                  [
                    "Legal basis",
                    "Your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG). You can withdraw it at any time via “Cookie settings” in the footer.",
                  ],
                  [
                    "Third country",
                    "Meta may transfer data to Meta Platforms, Inc. in the USA. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="6. Microsoft Clarity (heatmaps and session recordings)">
              <Facts
                items={[
                  ["Provider", "Microsoft Ireland Operations Limited, Ireland (“Microsoft”)."],
                  [
                    "Purpose",
                    "With your consent, we load Microsoft Clarity (project zd6llnwxwk). Clarity records how you use our website and uses this to create heatmaps (aggregated click and scroll maps) and session recordings (a replay of your visit). This shows us where our pages are unclear or do not work, so that we can improve them.",
                  ],
                  [
                    "Data",
                    "Mouse movements, clicks and scrolling, the page content displayed, pages visited, screen size, browser, device and operating system information, IP address and your approximate location derived from it (e.g. country), as well as cookie identifiers (_clck, _clsk).",
                  ],
                  [
                    "Retention period",
                    "According to Microsoft, the cookie _clck remains stored for one year and the cookie _clsk for one day. According to Microsoft, session recordings are deleted after 30 days by default.",
                  ],
                  [
                    "Legal basis",
                    "Your consent (Art. 6(1)(a) GDPR, § 25(1) TDDDG). You can withdraw it at any time via “Cookie settings” in the footer.",
                  ],
                  [
                    "Third country",
                    "Microsoft may transfer data to Microsoft Corporation in the USA. " + USA_TRANSFER,
                  ],
                ]}
              />
            </Section>

            <Section title="7. Purchase of the Koja apps">
              <P>
                When you buy a monthly subscription ({planText("monthly", "en").label}) or a one-time license (
                {planText("lifetime", "en").label}), we process the data needed to conclude the contract, process the
                payment and deliver your license key.
              </P>
              <P>
                <B>Payment via Stripe:</B> Payment is processed by Stripe Payments Europe, Limited (Ireland) via Stripe
                Checkout. There you enter your email address and your payment details; depending on the payment method,
                Stripe asks for further information, such as your name or your country. We do not receive full card
                details. From Stripe we receive, among other things, your email address, plan, amount, payment status and
                time of payment. At Stripe, we also record when, before the purchase, you requested that the contract
                begin immediately and confirmed the development status of the apps. Stripe itself is responsible for part
                of the processing, for example for fraud prevention and its own legal obligations as a payment service
                provider. Stripe may transfer data to Stripe, Inc. in the USA. {USA_TRANSFER}
              </P>
              <P>
                <B>Confirmation page:</B> After payment, Stripe redirects you back to us. We then set a technically
                necessary cookie (<code className="font-mono text-[0.92em]">kj_session</code>) for one hour containing the
                ID of your payment session, so that only you can see your license key on the confirmation page (§ 25(2)
                no. 2 TDDDG, Art. 6(1)(b) GDPR).
              </P>
              <P>
                <B>License database (Supabase):</B> After payment, we generate your license key and store the following in
                our database at Supabase (servers in the EU): your email address, the license key (encrypted), the plan,
                the ID of the Stripe payment session and, where applicable, the time at which the license was deactivated,
                for example after a subscription ends. Supabase processes the data on our behalf (Art. 28 GDPR). Insofar
                as access from the USA is possible, the following applies: {USA_TRANSFER}
              </P>
              <P>
                <B>Sending emails (Resend):</B> We send you your license key and the purchase confirmation by email via
                Resend, Inc. (USA). For this, Resend processes your email address and the content of the email on our
                behalf. {USA_TRANSFER}
              </P>
              <P>
                <B>Legal basis:</B> Performance of the contract (Art. 6(1)(b) GDPR) and statutory retention obligations
                (Art. 6(1)(c) GDPR). Without an email address and payment details, we cannot conclude the contract.
              </P>
              <P>
                <B>Retention period:</B> We store the license data for as long as your license exists. After that, we keep
                the data that we are required to retain under commercial and tax law (§ 147 of the German Fiscal Code, AO;
                § 257 of the German Commercial Code, HGB): invoices and other accounting records for eight years,
                commercial and business letters for six years, books and records for ten years, in each case from the end
                of the calendar year. We then delete them.
              </P>
            </Section>

            <Section title="8. License activation and free trial in the Kojalytics Launcher">
              <P>
                When you activate your license key in the Kojalytics Launcher, the Launcher sends the following to our
                server: the license key, a pseudonymous device ID (a hash value) and, if transmitted, the device name
                (which may contain your name, e.g. “Max's MacBook”), the app and its version. We check whether the key is
                valid and whether the limit of 3 devices has been reached, and store the activation with its time in our
                database at Supabase (section 7). In the process, our host Vercel also processes your IP address (section
                2).
              </P>
              <P>
                The purpose is to provide your license and to protect against misuse. The legal basis is the performance
                of the contract (Art. 6(1)(b) GDPR) and our legitimate interest in enforcing the agreed number of devices
                (Art. 6(1)(f) GDPR). We store the activation data for as long as your license exists and delete it
                afterwards, unless a retention obligation prevents this.
              </P>
              <P>
                When you start the free trial in the Kojalytics Launcher, the Launcher sends the following to our server:
                the pseudonymous device ID, the device name if transmitted, the app and its version. We store when the
                trial started on this device, so that it ends after 3 days and is only possible once per device, also at
                Supabase. The purpose is to provide the trial and to protect against misuse. The legal basis is
                pre-contractual measures taken at your request (Art. 6(1)(b) GDPR) and our legitimate interest in limiting
                the trial to once per device (Art. 6(1)(f) GDPR). We delete the trial data as soon as it is no longer
                needed for this, at the latest when we discontinue the free trial.
              </P>
            </Section>

            <Section title="9. Download and download link by email">
              <P>
                You download the Kojalytics Launcher directly from our website. We store the installation files at GitHub
                (GitHub, Inc., USA). When you click a download button, our server fetches the file from there and
                transfers it to you. GitHub does not receive your IP address or information about your browser, only the
                request from our server. As with every page request, the connection to you runs via our host Vercel
                (section 2).
              </P>
              <P>
                The legal basis is our legitimate interest in providing the download reliably (Art. 6(1)(f) GDPR) and, if
                you have bought the apps, the performance of the contract (Art. 6(1)(b) GDPR). If you have consented to
                the advertising services, the click is also reported to Google and Meta as a “Lead” (sections 4 and 5).
              </P>
              <P>
                <B>Download link by email:</B> On smartphones and tablets, you can have the download link sent to you by
                email so that you can download the apps on your computer. We use your email address only to send you this
                email. The legal basis is pre-contractual measures taken at your request (Art. 6(1)(b) GDPR). Only if you
                tick “Remind me again by email tomorrow” do we send you a single reminder with the same links 24 hours
                later. The legal basis for this is your consent (Art. 6(1)(a) GDPR). You can withdraw it at any time with
                effect for the future by writing to <SupportMail />; we will then delete the scheduled reminder.
              </P>
              <P>
                We send both emails via Resend (section 7). We create the reminder at Resend for sending the next day;
                until then, Resend stores your email address and the content of the email. We do not store your email
                address in our own database. Resend stores delivery data (e.g. recipient, subject, time and delivery
                status) according to its own retention periods. To prevent misuse, we count in our server's memory how
                often the same email address and the same IP address request a link; this count is not stored
                permanently (Art. 6(1)(f) GDPR).
              </P>
            </Section>

            <Section title="10. Cancellation form">
              <P>
                You can cancel your subscription via{" "}
                <Link href={href("en", "/kuendigen")}>
                  “Cancel contracts here”
                </Link>
                . In doing so, we process your name, your email address, the type of cancellation (ordinary or
                extraordinary) and, if you provide them, a reason for the cancellation and your license key or an invoice
                number. Using the email address, we look up your subscription at Stripe, cancel it with effect from the
                end of the paid period and record the type of and reason for the cancellation at Stripe. We send you the
                acknowledgement of receipt by email via Resend (section 7); a copy goes to support@kojalytics.com.
              </P>
              <P>
                The legal basis is the performance of the contract (Art. 6(1)(b) GDPR) and our legal obligation to accept
                and confirm cancellations (Art. 6(1)(c) GDPR in conjunction with § 312k of the German Civil Code, BGB). We
                keep the cancellation as evidence for as long as claims arising from the contract can be asserted (usually
                three years from the end of the year of the cancellation), and as a business letter for up to six years
                (§ 147 AO, § 257 HGB).
              </P>
            </Section>

            <Section title="11. Reviews">
              <P>
                When you submit a review on kojalytics.com, we process your star rating, your name, your email address, the
                headline and text of your review and the date. Only the stars, name, headline, text and date are published,
                never your email address. We use the email address to check whether it belongs to a licence bought on
                kojalytics.com (“Verified purchase”) and to contact you about your review if needed. We notify
                support@kojalytics.com of every new review by email via Resend (section 7). The review is stored with
                Supabase (servers in the EU, section 7).
              </P>
              <P>
                The legal basis is your consent (Art. 6(1)(a) GDPR), which you give when submitting. You can withdraw it at
                any time with effect for the future; an email to support@kojalytics.com is enough, and we will delete your
                review. Unless you withdraw it, we keep the review for as long as it is shown on the website.
              </P>
            </Section>

            <Section title="12. Contact by email">
              <P>
                Our{" "}
                <Link href={href("en", "/kontakt")}>
                  contact page
                </Link>{" "}
                does not send any data to our server. It only opens your own email program with a prepared message to
                support@kojalytics.com. Only when you send the email do we receive your email address, your name (if
                provided) and the content of your message. We receive emails to addresses at @kojalytics.com via Resend
                (section 7) and forward them to our mailbox.
              </P>
              <P>
                We use the data only to answer your enquiry. The legal basis is Art. 6(1)(b) GDPR if it concerns a
                contract or steps prior to entering into a contract, otherwise our legitimate interest in answering
                enquiries (Art. 6(1)(f) GDPR). We delete the enquiry once it has been dealt with, unless statutory
                retention obligations prevent this (e.g. six years for business letters).
              </P>
            </Section>

            <Section title="13. Your rights">
              <P>You have the following rights with respect to us:</P>
              <List>
                <li>access to your stored data (Art. 15 GDPR)</li>
                <li>rectification of inaccurate data (Art. 16 GDPR)</li>
                <li>erasure of your data (Art. 17 GDPR)</li>
                <li>restriction of processing (Art. 18 GDPR)</li>
                <li>data portability (Art. 20 GDPR)</li>
                <li>withdrawal of consent with effect for the future (Art. 7(3) GDPR)</li>
              </List>
              <P>
                <B>Right to object (Art. 21 GDPR):</B> If we process data on the basis of our legitimate interest (Art.
                6(1)(f) GDPR), you can object to the processing at any time on grounds relating to your particular
                situation.
              </P>
              <P>
                To do so, simply write to us at <SupportMail />. You can also lodge a complaint with a data protection
                supervisory authority (Art. 77 GDPR). The authority responsible for us is the Hamburg Commissioner for Data
                Protection and Freedom of Information (Hamburgischer Beauftragter für Datenschutz und
                Informationsfreiheit). We do not make automated decisions within the meaning of Art. 22 GDPR.
              </P>
            </Section>

            <Section title="14. Changes to this privacy policy">
              <P>
                We update this privacy policy when our website, our services or the legal situation change. The version
                published on this page at the time applies.
              </P>
            </Section>
          </div>
        </section>

        {/* 03 Part B */}
        <section id="ai-headshot" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Part B" meta="AI Headshot · iOS app · Sections B1–B12" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h2 className="display max-w-4xl text-[clamp(1.8rem,3.4vw,2.8rem)]" data-reveal>
              Part <span className="text-highlight">B</span>: AI Headshot (iOS app)
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted" data-reveal>
              This part applies to the iOS app AI Headshot, a separate offering from Kojalytics.
            </p>
            <div className="mt-8 max-w-3xl border border-border border-t-2 border-t-foreground p-5" data-reveal>
              <p className="font-medium leading-relaxed">
                AI Headshot does not require a user account, does not create user profiles and does not use any tracking
                or analytics tools. We process your photos only to create your portraits.
              </p>
            </div>
          </div>
          <div className="divide-y divide-border border-t border-border">
            <Section title="B1. Controller">
              <P>
                Kojalytics
                <br />
                Farzad Khojazada, sole proprietorship (Einzelunternehmen)
                <br />
                Am Diggen 40i, 21077 Hamburg, Germany
                <br />
                Email: <SupportMail />
                <br />
                Website:{" "}
                <a href="https://www.kojalytics.com">www.kojalytics.com</a>
              </P>
            </Section>

            <Section title="B2. What data is processed?">
              <P>
                AI Headshot processes only the data that is necessary to create AI-generated portraits:
              </P>
              <List>
                <li>
                  <B>Reference photos:</B> The photos you select (max. 5) are transmitted to our server to create the
                  portraits and then forwarded to the{" "}
                  <B>third-party AI service Google Gemini API</B> (see sections B4 and B6).
                </li>
                <li>
                  <B>Portrait settings:</B> The style options you choose (e.g. style, framing, background).
                </li>
                <li>
                  <B>Purchase data:</B> Transaction IDs for in-app purchases are stored locally on your device. Payments
                  are processed exclusively by Apple.
                </li>
              </List>
              <div className="mt-6 border border-border border-t-2 border-t-foreground p-5">
                <p className="font-medium text-foreground">
                  Important: Before your photos are transmitted to the AI service for the first time, the app asks for
                  your explicit consent. Without your consent, no photos are transferred to third parties.
                </p>
              </div>
            </Section>

            <Section title="B3. What is NOT collected?">
              <List>
                <li>No user accounts or registration required</li>
                <li>No email addresses, names or phone numbers</li>
                <li>No location data</li>
                <li>
                  No analytics or tracking tools in the app (no Google Analytics, Firebase etc.)
                </li>
                <li>No advertising or ad networks in the app</li>
                <li>No sharing of data with third parties for marketing purposes</li>
              </List>
            </Section>

            <Section title="B4. How are your photos processed?">
              <P>Your reference photos are processed as follows:</P>
              <List>
                <li>
                  The photos are transmitted in encrypted form (HTTPS) to our server (Supabase).
                </li>
                <li>
                  <B>Third-party AI service:</B> To generate the images, your reference photos are forwarded to the{" "}
                  <B>Google Gemini API</B> (an AI service of Google Ireland Limited).
                  <ul className="mb-0 mt-2">
                    <li>
                      <B>Data transmitted:</B> Your reference photos (images of your face) and style and formatting
                      instructions.
                    </li>
                    <li>
                      <B>Purpose of the transfer:</B> Solely to generate your AI portraits.
                    </li>
                    <li>
                      <B>Consent:</B> The transfer only takes place after you have given your explicit consent during the
                      app's onboarding (legal basis: Art. 6(1)(a), Art. 9(2)(a) GDPR).
                    </li>
                    <li>
                      Google processes the images in accordance with the{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Privacy Policy
                      </a>{" "}
                      and ensures an equivalent level of data protection.
                    </li>
                  </ul>
                </li>
                <li>
                  Once generation is complete, the reference photos are deleted both from our server and at Google.
                </li>
                <li>
                  The generated portraits are provided via time-limited, signed URLs (valid for 1 hour).
                </li>
              </List>
            </Section>

            <Section title="B5. Data storage">
              <p className="font-semibold text-foreground">
                On your device (locally):
              </p>
              <List className="mt-2">
                <li>Generated portraits and thumbnails in the app's storage</li>
                <li>
                  Purchase receipts and settings in the encrypted iOS keychain
                </li>
                <li>
                  Vault data with automatic expiry (24 hours to 30 days, depending on the package)
                </li>
              </List>
              <p className="mt-6 font-semibold text-foreground">
                On our server:
              </p>
              <List className="mt-2">
                <li>Reference photos are deleted after processing</li>
                <li>
                  Generated portraits are stored temporarily and can only be accessed via time-limited URLs
                </li>
                <li>
                  Job metadata (status, timestamps) is stored without any personal reference
                </li>
              </List>
              <P>
                You can remove the locally stored portraits, vault entries and settings at any time in the app under
                Settings › “Delete all my data”.
              </P>
            </Section>

            <Section title="B6. Third-party providers">
              <P>The app uses the following third-party services:</P>
              <List className="[&>li+li]:mt-3">
                <li>
                  <B>Google Gemini API (third-party AI service):</B> For AI-based image generation. Your reference photos
                  (images of your face) are transmitted to Google solely for the purpose of generating portraits and only
                  after your explicit consent. Google processes the data in accordance with the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Privacy Policy
                  </a>{" "}
                  and ensures an equivalent level of data protection. After processing, the photos are deleted at Google.
                </li>
                <li>
                  <B>Supabase:</B> Backend infrastructure for secure data processing and storage. Servers in the EU
                  (Frankfurt am Main).
                </li>
                <li>
                  <B>Apple StoreKit:</B> For in-app purchases. Apple processes payment data in accordance with the{" "}
                  <a
                    href="https://www.apple.com/legal/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apple Privacy Policy
                  </a>
                  .
                </li>
              </List>
            </Section>

            <Section title="B7. Data security">
              <List>
                <li>All data transfers are encrypted via HTTPS</li>
                <li>Local data is stored encrypted in the iOS keychain</li>
                <li>
                  Generated portraits can only be accessed via time-limited, signed URLs
                </li>
                <li>Security through unique, unguessable job IDs</li>
              </List>
            </Section>

            <Section title="B8. Your rights (GDPR)">
              <P>
                As a user in the EU, you have the following rights in particular:
              </P>
              <List>
                <li>
                  <B>Access:</B> You can ask which data about you is stored.
                </li>
                <li>
                  <B>Erasure:</B> You can request the erasure of your data.
                </li>
                <li>
                  <B>Objection:</B> You can object to the processing of your data.
                </li>
                <li>
                  <B>Data portability:</B> You can request that your data be handed over to you in a common format.
                </li>
                <li>
                  <B>Withdrawal:</B> You can withdraw your consent at any time with effect for the future.
                </li>
              </List>
              <P>
                As the app does not use user accounts, no personal data is stored permanently. All other rights, including
                the right to lodge a complaint with a supervisory authority, can be found in Part A, section 13. If you
                have any questions or wish to exercise your rights, you can reach us at <SupportMail />.
              </P>
            </Section>

            <Section title="B9. Device permissions">
              <List>
                <li>
                  <B>Photo library (read):</B> To select reference photos for creating portraits.
                </li>
                <li>
                  <B>Photo library (write):</B> To save generated portraits to your photo library.
                </li>
              </List>
              <P>
                No other permissions are required (no access to the camera, microphone, location or contacts).
              </P>
            </Section>

            <Section title="B10. Children">
              <P>
                AI Headshot is not directed at children under the age of 16. We do not knowingly collect data from
                children.
              </P>
            </Section>

            <Section title="B11. Changes">
              <P>
                We reserve the right to update this part of the privacy policy as necessary. The current version is always
                available at this URL.
              </P>
            </Section>

            <Section title="B12. Contact">
              <P>
                If you have any questions about data protection, you can reach us at: <SupportMail />
              </P>
            </Section>
          </div>
        </section>
      </main>
      <Footer offer={false} lang="en" />
    </>
  );
}

/** One numbered section: title left (sticky on wide screens), text right in a readable column. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`grid gap-4 py-10 md:py-12 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`} data-reveal>
      <h3 className="text-[1.125rem] font-semibold leading-snug lg:sticky lg:top-20 lg:self-start">{title}</h3>
      <div className="prose-de [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="text-foreground">{children}</strong>;
}

function List({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <ul className={className}>{children}</ul>;
}

/** Label/value rows for the services that run with consent: mono label left, text right, hairlines between. */
function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="border-t border-border lg:border-t-0">
      {items.map(([label, text]) => (
        <div
          key={label}
          className="grid gap-1 border-b border-border py-4 last:border-b-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 lg:first:pt-0"
        >
          <dt className="hud sm:pt-[7px]">{label}</dt>
          <dd>
            <p>{text}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SupportMail() {
  return <a href="mailto:support@kojalytics.com">support@kojalytics.com</a>;
}
