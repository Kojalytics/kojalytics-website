import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBar from "@/components/instrument/SectionBar";
import { TRIAL_DAYS, planText } from "@/lib/pricing";
import { alternates, href } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms and conditions for the Koja apps",
  description:
    "General terms and conditions (AGB) for the Koja apps: monthly subscription, one-time license, cancellation and right of withdrawal.",
  alternates: alternates("en", "/agb"),
  robots: { index: false },
};

const PROVIDER = "Farzad Khojazada, Kojalytics, Am Diggen 40i, 21077 Hamburg, Germany, email: support@kojalytics.com";

const pad = "px-5 md:px-10";

export default function TermsPage() {
  const preview = process.env.VERCEL_ENV !== "production";
  return (
    <>
      <Navigation />
      <main className="pt-12">
        {/* 01 Title */}
        <section className="rail">
          <SectionBar index="01" label="Legal" meta="Terms · Withdrawal instructions · Model withdrawal form" />
          <div className={`py-14 md:py-20 ${pad}`}>
            <h1 className="display rise-in text-[clamp(2rem,4vw,3.2rem)]">
              Terms and conditions for the <span className="text-highlight">Koja apps</span>
            </h1>
            <p className="hud rise-in mt-5 [--i:1]">Last updated: 13 November 2026</p>
            <p className="rise-in mt-8 max-w-3xl border border-border border-t-2 border-t-foreground p-4 text-sm leading-relaxed text-muted [--i:2]">
              This English version is a courtesy translation. Only the{" "}
              <Link href="/agb" className="text-foreground underline underline-offset-4">
                German version (AGB)
              </Link>{" "}
              is legally binding.
            </p>
            {preview && (
              <p className="rise-in mt-8 max-w-3xl border border-dashed border-accent p-4 text-sm text-accent [--i:2]">
                [Visible in preview only] Have a lawyer review this before going live.
              </p>
            )}
          </div>
        </section>

        {/* 02 Sections 1 to 8 */}
        <section className="rail crosshairs">
          <SectionBar index="02" label="Terms" meta="Sections 1–8" />
          <div className="divide-y divide-border">
            <Section title="1. Scope and provider">
              <P>
                These general terms and conditions (Allgemeine Geschäftsbedingungen, AGB) apply to all contracts for the
                Koja apps that you conclude via kojalytics.com. Your contractual partner is:
              </P>
              <P>
                Farzad Khojazada, Kojalytics (sole proprietorship, Einzelunternehmen)
                <br />
                Am Diggen 40i, 21077 Hamburg, Germany
                <br />
                Email: support@kojalytics.com
              </P>
              <P>
                A consumer (Verbraucher) is any natural person who concludes a contract for purposes that are predominantly
                outside their trade, business or self-employed profession (§ 13 of the German Civil Code, BGB).
              </P>
            </Section>

            <Section title="2. Services">
              <P>
                You receive the right to use all Koja apps for macOS and Windows on up to 3 of your own computers (Mac or
                Windows PC). The license is delivered as a license key, which you activate in the Kojalytics Launcher; you
                install the apps via the Launcher. The apps run on macOS and Windows. You need an internet connection to
                download and activate them.
              </P>
              <P>
                Before buying, you can test the apps free of charge for {TRIAL_DAYS} days after downloading them; you
                start the trial in the Kojalytics Launcher, once per device. The trial ends automatically and costs
                nothing.
              </P>
              <P>
                <strong className="text-foreground">Further development:</strong> We continuously develop the Koja apps.
                You receive updates and new features at no extra charge via the Kojalytics Launcher, with both the
                monthly subscription and the one-time license. The product pages on kojalytics.com describe the features
                of each app. Back up your files regularly.
              </P>
            </Section>

            <Section title="3. Conclusion of the contract">
              <P>
                The presentation of the Koja apps on kojalytics.com is not yet a binding offer. The ordering process works
                as follows:
              </P>
              <ol>
                <li>
                  On kojalytics.com, you choose the monthly subscription or the one-time license and, if you have one, enter
                  a discount code. The discounted price is shown to you before you buy.
                </li>
                <li>
                  You are redirected to Stripe Checkout, the payment page of our payment service provider Stripe. There you
                  enter your email address and your payment details and see an overview of the product and price.
                </li>
                <li>
                  By clicking the payment button, you make a binding offer to conclude the contract.
                </li>
                <li>
                  The contract is concluded as soon as the payment is confirmed and we provide you with your license key:
                  on the confirmation page and by email.
                </li>
              </ol>
              <P>
                <strong className="text-foreground">Correcting input errors:</strong> Until you click the payment button,
                you can check and change all entries in Stripe Checkout. The back link in Checkout takes you back to the
                price overview, where you can change your selection or abort the purchase.
              </P>
              <P>
                <strong className="text-foreground">Contract text:</strong> We store your order data. We send you the
                contract confirmation with your license key and the essential contract details by email. You can view,
                print or save these terms on this page at any time.
              </P>
              <P>
                <strong className="text-foreground">The contract language</strong> (Vertragssprache) is German.
              </P>
            </Section>

            <Section title="4. Prices and payment">
              <P>
                All prices are final prices. Prices in euros include statutory VAT. On the English-language website we show prices in
                US dollars; the amount shown on the website and in Stripe Checkout in US dollars then applies, without German VAT. You pay via Stripe by credit or debit card or with another
                payment method shown in Stripe Checkout. The monthly subscription is billed monthly in advance from the
                date of purchase; the one-time license is billed once at purchase.
              </P>
            </Section>

            <Section title="5. Monthly subscription: term and cancellation">
              <P>
                The monthly subscription costs {planText("monthly", "en").label} {planText("monthly", "en").per} (in other currencies, the amount shown). It runs
                for one month at a time and renews automatically for a further month unless you cancel it.
              </P>
              <P>
                You can cancel at any time, free of charge, with effect from the end of the paid month: using the button{" "}
                <Link href={href("en", "/kuendigen")}>
                  “Cancel contracts here”
                </Link>{" "}
                (kojalytics.com/en/cancel) or by email to support@kojalytics.com. We confirm the cancellation to you by
                email. Your right to extraordinary termination for good cause (außerordentliche Kündigung aus wichtigem
                Grund) remains unaffected.
              </P>
              <P>When the subscription ends, your right of use ends and we deactivate your license key.</P>
            </Section>

            <Section title="6. One-time license (dauerhafte Lizenz)">
              <P>
                The one-time license costs {planText("lifetime", "en").label} (in other currencies, the amount shown), paid once. It has no expiry date and does
                not renew; no further payments are due.
              </P>
            </Section>

            <Section title="7. Warranty and updates">
              <P>
                The statutory rights in the event of defects for digital products apply (§§ 327 et seq. BGB), taking into
                account the services described in section 2.
              </P>
              <P>
                We provide you with updates, including security updates, that are necessary to keep the apps in conformity
                with the contract (§ 327f BGB): for the monthly subscription throughout its entire term, for the one-time
                license for the period you can reasonably expect given the type and purpose of the apps and the
                circumstances of the contract. You receive updates via the Kojalytics Launcher. If you do not install an
                update within a reasonable period, although we have informed you about it and about the consequences of not
                installing it, we are not liable for a defect that results solely from this (§ 327f (2) BGB).
              </P>
            </Section>

            <Section title="8. Liability">
              <P>
                We are liable without limitation for intent and gross negligence, for injury to life, body or health, under
                the German Product Liability Act (Produkthaftungsgesetz) and insofar as we have given a guarantee. In cases
                of slight negligence, we are liable only for breach of an essential contractual obligation, meaning an
                obligation whose fulfilment makes the proper performance of the contract possible in the first place and on
                whose fulfilment you may regularly rely. In this case, liability is limited to the foreseeable damage
                typical for this type of contract.
              </P>
              <P>
                In the event of data loss, we are liable only for the effort that would also have been required if the data
                had been backed up regularly and in a manner appropriate to the risk. The statutory rights in the event of
                defects (section 7) remain unaffected.
              </P>
            </Section>
          </div>
        </section>

        {/* 03 Withdrawal instructions (id kept from the German page, so links to /agb#widerruf work in both languages) */}
        <section id="widerruf" className="rail crosshairs scroll-mt-12">
          <SectionBar index="03" label="Withdrawal instructions" meta="Section 9" />
          <Section title="9. Withdrawal instructions (Widerrufsbelehrung)">
            <P>Consumers have a right of withdrawal in accordance with the following provisions.</P>

            <h3 className="text-[1.0625rem]">Right of withdrawal (Widerrufsrecht)</h3>
            <P>You have the right to withdraw from this contract within fourteen days without giving any reason.</P>
            <P>The withdrawal period is fourteen days from the day on which the contract is concluded.</P>
            <P>
              To exercise your right of withdrawal, you must inform us ({PROVIDER}) of your decision to withdraw from this
              contract by means of a clear statement (e.g. a letter sent by post or an email). You may use the attached
              model withdrawal form, but this is not mandatory. You can also declare your withdrawal using the withdrawal
              function on our website:{" "}
              <Link href={href("en", "/widerrufen")}>
                “Withdraw from a contract”
              </Link>{" "}
              (kojalytics.com/en/withdrawal).
            </P>
            <P>
              To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise
              of the right of withdrawal before the withdrawal period has expired.
            </P>

            <h3 className="text-[1.0625rem]">Effects of withdrawal (Folgen des Widerrufs)</h3>
            <P>
              If you withdraw from this contract, we shall reimburse to you all payments received from you, including the
              costs of delivery (with the exception of the supplementary costs resulting from your choice of a type of
              delivery other than the least expensive type of standard delivery offered by us), without undue delay and in
              any event not later than fourteen days from the day on which we received the notice of your withdrawal from
              this contract. We will carry out such reimbursement using the same means of payment as you used for the
              initial transaction, unless expressly agreed otherwise with you; in any event, you will not be charged any
              fees as a result of such reimbursement.
            </P>

            <P>End of withdrawal instructions</P>
          </Section>
        </section>

        {/* 04 Model withdrawal form */}
        <section className="rail crosshairs">
          <SectionBar index="04" label="Model withdrawal form" meta="Section 10" />
          <Section title="10. Model withdrawal form (Muster-Widerrufsformular)">
            <P>(If you want to withdraw from the contract, please complete this form and return it.)</P>
            <div className="my-6 border border-border-strong p-5 sm:p-6">
              <ul className="m-0 list-none p-0">
                <li>– To {PROVIDER}:</li>
                <li>
                  – I/We (*) hereby give notice that I/we (*) withdraw from my/our (*) contract for the purchase of the
                  following goods (*)/for the provision of the following service (*)
                </li>
                <li>– Ordered on (*)/received on (*)</li>
                <li>– Name of consumer(s)</li>
                <li>– Address of consumer(s)</li>
                <li>– Signature of consumer(s) (only if this form is notified on paper)</li>
                <li>– Date</li>
              </ul>
            </div>
            <P>(*) Delete as appropriate.</P>
          </Section>
        </section>

        {/* 05 Third-party components and final provisions */}
        <section className="rail crosshairs">
          <SectionBar index="05" label="Final provisions" meta="Sections 11–12" />
          <div className="divide-y divide-border">
            <Section title="11. Third-party components">
              <P>
                The software may contain third-party components; their license terms are included with the respective app
                and remain unaffected.
              </P>
            </Section>

            <Section title="12. Dispute resolution and final provisions">
              <P>
                We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer
                arbitration board (Verbraucherschlichtungsstelle).
              </P>
              <P>
                German law applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). If
                you are a consumer, this choice of law applies only insofar as it does not deprive you of the protection
                of the mandatory provisions of the law of the country in which you have your habitual residence.
              </P>
            </Section>
            <div className={`grid py-8 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`} data-reveal>
              <p className="text-sm leading-relaxed text-muted lg:col-start-2">
                Questions about these terms: support@kojalytics.com. See also the{" "}
                <Link href={href("en", "/impressum")} className="text-foreground underline underline-offset-4">
                  imprint
                </Link>{" "}
                and the{" "}
                <Link href={href("en", "/datenschutz")} className="text-foreground underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer offer={false} lang="en" />
    </>
  );
}

/** One numbered clause: title left (sticky on wide screens), text right in a readable column. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`grid gap-4 py-10 md:py-12 lg:grid-cols-[17rem_minmax(0,48rem)] lg:gap-12 ${pad}`} data-reveal>
      <h2 className="text-[1.125rem] font-semibold leading-snug lg:sticky lg:top-20 lg:self-start">{title}</h2>
      <div className="prose-de [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}
