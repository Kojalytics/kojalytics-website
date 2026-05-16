"use client";

import {
  ArrowRight,
  RefreshCw,
  ShoppingCart,
  Package,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Check,
  Store,
  Truck,
  Layers,
} from "lucide-react";
import Link from "next/link";
import "./etsy-sync.css";

const features = [
  {
    icon: RefreshCw,
    title: "Product Sync",
    desc: "Push all your Shopify products to Etsy with one click. Title, description, images, pricing, variants — everything transfers automatically.",
  },
  {
    icon: ShoppingCart,
    title: "Order Import",
    desc: "Etsy orders appear in Shopify instantly. Manage all your orders from one dashboard — no switching between platforms.",
  },
  {
    icon: Package,
    title: "Inventory Sync",
    desc: "Bidirectional inventory tracking. Sell on Etsy? Stock updates in Shopify. No overselling, no manual counting.",
  },
  {
    icon: Truck,
    title: "Fulfillment Sync",
    desc: "Ship from Shopify as usual. Tracking numbers are automatically sent to Etsy — your buyers stay informed.",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    desc: "Real-time overview of sync status, errors, and sales. See exactly what's happening across both channels.",
  },
  {
    icon: Zap,
    title: "Auto-Sync",
    desc: "Set it and forget it. Webhooks trigger automatic updates when products change or new orders come in.",
  },
];

const workflow = [
  {
    step: "01",
    icon: Store,
    title: "Connect Your Shops",
    desc: "Link your Shopify store and Etsy shop with secure OAuth authentication. Takes under 2 minutes.",
  },
  {
    step: "02",
    icon: Layers,
    title: "Select & Sync Products",
    desc: "Choose which products to push to Etsy — individually or in bulk. Set price markups, map categories.",
  },
  {
    step: "03",
    icon: ShoppingCart,
    title: "Orders Flow Back",
    desc: "When someone buys on Etsy, the order shows up in Shopify. Fulfill it normally with your existing workflow.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Ship & Track",
    desc: "Create shipping labels in Shopify. Tracking info syncs to Etsy automatically. Customer gets notified.",
  },
];

const pricing = [
  { label: "Products synced", value: "Unlimited" },
  { label: "Order imports", value: "Unlimited" },
  { label: "Inventory sync", value: "Bidirectional" },
  { label: "Auto-sync", value: "Included" },
  { label: "Image transfer", value: "Up to 10/product" },
  { label: "Price markup rules", value: "% or fixed" },
  { label: "Fulfillment sync", value: "Automatic" },
  { label: "Support", value: "Email & Chat" },
];

export default function EtsySyncPage() {
  return (
    <>
      {/* Nav */}
      <nav className="es-nav fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-bold text-white text-sm transition-transform group-hover:scale-110">
              K
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Kojalytics
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
            <a
              href="https://apps.shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="es-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F56400] to-[#F56400]/80 text-white text-sm font-medium hover:shadow-lg hover:shadow-[#F56400]/20 transition-all duration-300"
            >
              Install on Shopify
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#F56400]/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="es-fade-in es-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-muted">Shopify App</span>
            </div>

            <h1 className="es-fade-in es-delay-2 text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Sell on{" "}
              <span className="bg-gradient-to-r from-[#F56400] to-[#F5A623] bg-clip-text text-transparent">
                Etsy
              </span>
              .{" "}Manage in{" "}
              <span className="bg-gradient-to-r from-[#96BF48] to-[#5E8E3E] bg-clip-text text-transparent">
                Shopify
              </span>
              .
            </h1>

            <p className="es-fade-in es-delay-3 text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Sync your products to Etsy with one click. Orders flow back to
              Shopify automatically. Ship, track, and manage everything from one
              place.
            </p>

            <div className="es-fade-in es-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://apps.shopify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#F56400] to-[#F5A623] text-white font-semibold text-lg hover:shadow-xl hover:shadow-[#F56400]/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Install Free on Shopify
                <ArrowRight size={18} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-medium hover:bg-surface-light transition-all duration-300"
              >
                See How It Works
              </a>
            </div>

            {/* Visual: Shopify ↔ Etsy connection */}
            <div className="es-fade-in es-delay-5 mt-20 flex items-center justify-center gap-6 md:gap-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#96BF48]/20 to-[#5E8E3E]/10 border border-[#96BF48]/20 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 109 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M95.8 23.4c-.4-.3-.8-.5-1.2-.5-.4 0-7.6-.5-7.6-.5s-5.1-5-5.7-5.6c-.6-.6-1.6-.4-2-.3l-2.8.9c-1.7-4.7-4.6-9-9.7-9-0.1 0-.3 0-.4 0-1.5-1.9-3.3-2.7-4.9-2.7-12.2 0-18 15.2-19.8 22.9l-8.6 2.7c-2.7.8-2.8.9-3.1 3.5L18.8 114.5l68 12.7L109 23.8s-13-.4-13.2-.4zm-21.3-3.9l-6.1 1.9c0-1.5-.1-3.3-.5-5.4 2.7.5 4.5 3.5 6.6 3.5zm-10-3c.4 2.5.5 5.8.5 7.3l-11.3 3.5c2.2-8.4 6.3-12.5 10.8-10.8zm-4.3-5.5c.7 0 1.4.2 2.1.7-5.1 2.4-10.6 8.5-12.9 20.6l-8.9 2.7c2.5-8.3 8.3-24 19.7-24z" fill="#96BF48"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted">Shopify</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="es-sync-line w-8 h-[2px] bg-gradient-to-r from-[#96BF48] to-[#F56400] rounded-full" />
                  <RefreshCw size={20} className="text-accent-light es-spin" />
                  <div className="es-sync-line-reverse w-8 h-[2px] bg-gradient-to-r from-[#F56400] to-[#96BF48] rounded-full" />
                </div>
                <span className="text-xs text-muted mt-1">Real-time Sync</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#F56400]/20 to-[#F5A623]/10 border border-[#F56400]/20 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M18 0C8.06 0 0 8.06 0 18s8.06 18 18 18 18-8.06 18-18S27.94 0 18 0zm7.2 22.32c-.36.72-1.26 1.08-2.7 1.08h-1.62l-.72 3.6h-2.52l.72-3.6h-2.52l-.72 3.6h-2.52l.72-3.6H11.7l.54-2.16h1.62l1.08-5.4H13.5l.54-2.16h1.44l.72-3.6h2.52l-.72 3.6h2.52l.72-3.6h2.52l-.72 3.6h1.26c1.44 0 2.34.36 2.7 1.08.36.72.18 1.8-.54 3.24-.72 1.44-1.62 2.52-2.7 3.24zm-2.88-5.76h-2.52l-1.08 5.4h2.52c.72 0 1.26-.18 1.62-.54.36-.36.72-1.08 1.08-2.16.36-1.08.36-1.8 0-2.16-.36-.36-.9-.54-1.62-.54z" fill="#F56400"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted">Etsy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-accent-light to-purple-400 bg-clip-text text-transparent">
                  sell everywhere
                </span>
              </h2>
              <p className="text-muted text-lg max-w-xl mx-auto">
                One integration. Two powerful sales channels. Zero manual work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="es-card group p-8 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm hover:border-accent/30 hover:bg-surface-light/50 transition-all duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <f.icon size={22} className="text-accent-light" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-32 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Up and running in{" "}
                <span className="bg-gradient-to-r from-[#F56400] to-[#F5A623] bg-clip-text text-transparent">
                  minutes
                </span>
              </h2>
              <p className="text-muted text-lg">
                Four simple steps to connect your Shopify and Etsy shops.
              </p>
            </div>

            <div className="space-y-8">
              {workflow.map((w, i) => (
                <div
                  key={w.step}
                  className="es-card flex items-start gap-6 p-8 rounded-2xl border border-border bg-surface/30 hover:bg-surface/60 transition-all duration-500"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F56400]/20 to-accent/10 border border-[#F56400]/20 flex items-center justify-center">
                    <span className="text-lg font-bold bg-gradient-to-r from-[#F56400] to-accent-light bg-clip-text text-transparent">
                      {w.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-3">
                      <w.icon size={20} className="text-accent-light" />
                      {w.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Simple pricing
              </h2>
              <p className="text-muted text-lg">
                One plan. Everything included. No hidden fees.
              </p>
            </div>

            <div className="relative rounded-3xl border border-accent/30 bg-gradient-to-b from-surface/80 to-surface-light/40 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />

              <div className="p-10 md:p-14">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl md:text-6xl font-bold">$14.99</span>
                  <span className="text-muted text-lg">/month</span>
                </div>
                <p className="text-muted mb-10">
                  Everything you need to sell on Etsy through Shopify.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {pricing.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-accent-light" />
                      </div>
                      <span className="text-sm">
                        <span className="text-muted">{item.label}:</span>{" "}
                        <span className="font-medium">{item.value}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://apps.shopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#F56400] to-[#F5A623] text-white font-semibold text-lg hover:shadow-xl hover:shadow-[#F56400]/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </a>
                <p className="text-center text-muted text-sm mt-4">
                  7-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Security */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: Shield,
                  title: "Secure OAuth 2.0",
                  desc: "Bank-level encryption for all connections. Your data stays safe.",
                },
                {
                  icon: Clock,
                  title: "Real-time Sync",
                  desc: "Webhook-driven updates. No delays, no stale data.",
                },
                {
                  icon: Zap,
                  title: "Built for Scale",
                  desc: "Handles thousands of products and orders without breaking a sweat.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-light border border-border flex items-center justify-center">
                    <item.icon size={20} className="text-accent-light" />
                  </div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-muted text-sm max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to expand to Etsy?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
              Join thousands of Shopify merchants who sell on Etsy without the
              hassle. Install now and start syncing in minutes.
            </p>
            <a
              href="https://apps.shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#F56400] to-[#F5A623] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-[#F56400]/30 transition-all duration-300 hover:-translate-y-1"
            >
              Install Etsy Sync
              <ArrowRight size={20} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center font-bold text-white text-xs">
              K
            </div>
            <span className="text-sm font-semibold">Kojalytics</span>
            <span className="text-muted text-sm">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
