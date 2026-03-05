import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                K
              </div>
              <span className="text-lg font-semibold tracking-tight">Kojalytics</span>
            </Link>
            <p className="mt-4 text-muted max-w-sm leading-relaxed">
              Software development studio building world-class apps and custom
              solutions. Based in Germany.
            </p>
            <p className="mt-4 text-muted text-sm">
              <a
                href="mailto:support@kojalytics.com"
                className="hover:text-foreground transition-colors"
              >
                support@kojalytics.com
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#services", label: "Services" },
                { href: "#work", label: "Work" },
                { href: "#about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/support", label: "PortraitPro AI" },
                { href: "#work", label: "BILDER AI" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section-divider mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Kojalytics. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/datenschutz" className="text-sm text-muted hover:text-foreground transition-colors">
              Datenschutz
            </Link>
            <Link href="/impressum" className="text-sm text-muted hover:text-foreground transition-colors">
              Impressum
            </Link>
            <Link href="/support" className="text-sm text-muted hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
