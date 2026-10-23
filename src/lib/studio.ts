// Services and projects of the studio: one source for the homepage, /services and /work.

export type Service = { slug: string; title: string; summary: string; details: string[]; stack: string[] };

export const SERVICES: Service[] = [
  {
    slug: "apps",
    title: "iOS apps",
    summary: "Native iPhone and iPad apps in SwiftUI, from first prototype to App Store release.",
    details: ["Product design and clickable prototype", "SwiftUI app with offline support", "In-app purchases and subscriptions", "App Store submission and updates"],
    stack: ["SwiftUI", "StoreKit", "Supabase"],
  },
  {
    slug: "web",
    title: "Web apps and websites",
    summary: "Fast web platforms and landing pages in Next.js, built to rank on Google and convert.",
    details: ["Next.js and React", "Payments with Stripe", "SEO and Core Web Vitals", "Hosting on Vercel"],
    stack: ["Next.js", "TypeScript", "Stripe", "Vercel"],
  },
  {
    slug: "ai",
    title: "AI integration",
    summary: "AI features inside your product: image generation, text, search and automation that save real work.",
    details: ["Image and text generation", "Document search and assistants", "Automated workflows", "Costs and privacy kept in check"],
    stack: ["Gemini", "Claude", "OpenAI", "Supabase"],
  },
  {
    slug: "design",
    title: "Design",
    summary: "Interfaces and brands that people understand without a manual.",
    details: ["UX flows and wireframes", "UI design and design systems", "Brand and app icons", "Usability testing"],
    stack: ["Figma", "Design tokens"],
  },
  {
    slug: "backend",
    title: "Backend and cloud",
    summary: "APIs, databases and infrastructure that carry real customers and payments.",
    details: ["APIs and webhooks", "Postgres databases with Supabase", "Auth, roles and licensing", "Monitoring and backups"],
    stack: ["Supabase", "Postgres", "Node.js", "Vercel"],
  },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  image: string;
  imageAlt: string;
  href?: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "ai-headshot",
    title: "AI Headshot",
    kind: "iOS app and web app",
    summary: "Professional portraits from a few selfies. An iOS app and a web app with payments, uploads from the phone and AI image generation.",
    image: "/aiheadshot/comparisons/after-1.webp",
    imageAlt: "AI-generated professional business portrait",
    href: "/work/ai-headshot",
    tags: ["SwiftUI", "Next.js", "Supabase", "Gemini", "Stripe"],
  },
  {
    slug: "koja-apps",
    title: "Koja apps",
    kind: "Our own product",
    summary: "13 creative and office apps for Mac, packaged with a launcher, licensing and one-click subscriptions.",
    image: "/software/hero.webp",
    imageAlt: "Creative workshop with several screens showing photo, video and audio work",
    href: "/software",
    tags: ["macOS", "Licensing", "Stripe"],
  },
  {
    slug: "etsy-sync",
    title: "Etsy Sync",
    kind: "Shopify app",
    summary: "Sell on Etsy and manage everything in Shopify. Products sync with one click and orders flow back automatically.",
    image: "/studio/etsy-sync.webp",
    imageAlt: "Handmade products and parcels on a packing table next to a laptop",
    href: "/etsy-sync",
    tags: ["Shopify", "Etsy API", "Node.js"],
  },
];
