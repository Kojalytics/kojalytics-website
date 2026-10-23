import Link from "next/link";
import { APPS } from "@/lib/apps";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { Logo } from "@/components/Navigation";

const company = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/licensing", label: "Software licensing" },
];

const help = [
  { href: "/support", label: "Support" },
  { href: "/cancel", label: "Cancel subscription" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-5 pb-12 pt-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Software studio from Germany. We build apps for clients and make the Koja apps for Mac.
            </p>
            <p className="mt-4 text-sm text-muted">support@kojalytics.com</p>
          </div>

          <div className="col-span-2 md:col-span-4">
            <p className="eyebrow mb-4">Koja apps</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {APPS.map((app) => (
                <li key={app.slug}>
                  <Link href={`/software/${app.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Company</p>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Help & legal</p>
            <ul className="space-y-2.5">
              {help.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs leading-relaxed text-muted md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Kojalytics. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            The Koja apps are based on the open-source Craft apps by the ArtCraft team (MIT / Apache-2.0). Kojalytics is not
            affiliated with or endorsed by ArtCraft. Product names of other companies are trademarks of their owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
